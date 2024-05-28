import { Worker } from "bullmq";
import "dotenv/config";
import fetchPdf from "./utils/fetchPdf.js";
import fs from "fs/promises";
import pool from "./database/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


async function processPdf(pdfPath, id) {
  try {
    // Read PDF content
    const dataBuffer = await fs.readFile(pdfPath);
    const uint8Array = new Uint8Array(dataBuffer);
    const pdfDoc = await getDocument({ data: uint8Array }).promise;
    const numPages = pdfDoc.numPages;
    let textContent = "";

    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContentItems = await page.getTextContent();
      textContentItems.items.forEach((item) => {
        textContent += item.str + " ";
      });
    }

    // Split text into chunks
    const chunkSize = 1500;
    const textChunks = [];
    for (let i = 0; i < textContent.length; i += chunkSize) {
      textChunks.push(textContent.slice(i, i + chunkSize));
    }

    // Create vector embeddings for each chunk
    const embeddings = await Promise.all(textChunks.map(async (chunk) => {
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(chunk);
        const embedding = result.embedding;

        return ({ chunk, embedding})
      }))
    

    storeEmbeddings(id, embeddings);

  } catch (error) {
    console.error("Error processing PDF:", error);
  }
}

async function storeEmbeddings(id, embeddings) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN"); // Start transaction

    for (const embedding of embeddings) {
      const query = `INSERT INTO pdf_embeddings (project_id, chunk, embedding) VALUES ($1, $2, $3)`;
      await client.query(query, [
        id,
        embedding.chunk,
        JSON.stringify(embedding.embedding.values),
      ]);
    }

    await client.query("COMMIT"); // Commit transaction
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback on error
    throw error;
  } finally {
    client.release();
  }
}

const worker = new Worker(
  "embedding",
  async (job) => {
    try {
      await fetchPdf(job.data.pdf_url, job.data.id);

      processPdf(`./${job.data.id}.pdf`, job.data.id);

      // removing the pdf after embedding generation
      await fs.unlink(`./${job.data.id}.pdf`);
    } catch (error) {
      console.log(`Error ==>> ${error}`);
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

worker.on("completed", async (job) => {
  // update the embedding status to "created"
  const client = await pool.connect()
  try {
    await client.query(`
    UPDATE project
    SET embedding_status = $1
    WHERE id = $2;
    `, ["created", job.data.id])
  } catch (error) {
    console.error('Error in updating embedding status to success', error);
  } finally {
    client.release()
  }

  console.log(`${job.id} has completed!`);
});

worker.on("failed", async (job, err) => {
  // update the embedding status to "success"
  const client = await pool.connect()
  try {
    await client.query(`
    UPDATE project
    SET embedding_status = $1
    WHERE id = $2;
    `, ["failed", job.data.id])
  } catch (error) {
    console.error('Error in updating embedding status to failed":', error);
  } finally {
    client.release()
  }

  console.log(`${job.id} has failed with ${err.message}`);
});
