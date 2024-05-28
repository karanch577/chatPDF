import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomError from "../utils/customError.js";
import pool from "../database/db.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


const generateQueryEmbedding = async (query) => {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(query);
  const embedding = result.embedding;

  return embedding;
}


export const chatWithPdf = async (req, res) => {
  const { query, id, chatHistory } = req.body;

  if(!query || !id) {
    throw new CustomError("query and id is required", 400)
  }

  const client = await pool.connect()


  console.log("history send", JSON.stringify(chatHistory), "\n\n\n")

  try {
    const queryEmbedding = await generateQueryEmbedding(query)

    // similarity search using query
    const similaritySearch = await client.query(
      'SELECT * FROM pdf_embeddings WHERE project_id = $1 ORDER BY embedding <-> $2 LIMIT 4', // Using '<=>' for cosine distance similarity search
      [id, JSON.stringify(queryEmbedding.values)]
    );

    const formattedContext = similaritySearch?.rows?.map(item => item.chunk)?.join("")

    console.log(formattedContext)


    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });


    const msg = `You are a helpful and enthusiastic bot who can answer a given question based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I,m sorry, I don't know the answer to that." Don't try to make up an answer at any cost. The user question is provided below.
    question: ${query}
    context: ${formattedContext}
    `

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });


    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();

    // // updating the chatHistory in the db
    // // gemini model update the chatHistory - it adds the above msg and response to it at the end of the array
    // // meaning last 2 indexes are added by the gemini model
    // // removing the last 2 elements from the array and updating the chatHistory
    // // this may vary according to the LLM models

    const newChatHistory = chatHistory.slice(0, chatHistory.length - 2)

    // console.log('after',JSON.stringify(chatHistory))

    const updatedChatHistory = newChatHistory.map((item, i) => {
      if(i === newChatHistory.length - 1) {
        return ({
          role: "model",
          parts: [{text: text}]
        })
      }
      return item
    })


    await client.query(
      'UPDATE project SET chat_history = $1, updated_at = $2 WHERE id = $3',
      [JSON.stringify(updatedChatHistory), new Date(), id]
    );

    return res.status(200).json({
      success: true,
      answer: text
    });

  } catch (error) {
    console.log(`Error in chat ==>> ${error}`);
  } finally {
    client.release()
  }
};
