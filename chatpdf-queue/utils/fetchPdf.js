import fetch from "node-fetch";
import fs from "fs";

async function fetchPdf(url, name) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Convert response to arrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Optionally, save the arrayBuffer to a file (conversion to buffer needed)
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(`${name}.pdf`, buffer);

    console.log("PDF fetched and saved successfully");
  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}

export default fetchPdf;
