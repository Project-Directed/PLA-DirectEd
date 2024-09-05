import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004", // 768 dimensions
});

// Function to generate embeddings
async function generateEmbeddings() {
  // Read the JSON file
  const filePath = path.join(process.cwd(), 'q2.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Iterate through each question and generate embeddings for the explanation
  for (let question of data) {
    const explanation = question.explanation;
    const embedding = await embeddings.embedQuery(explanation);
    question.embedding = embedding;
  }

  // Write the updated data to a new JSON file
  const outputFilePath = path.join(process.cwd(), 'question_with_embeddings2.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Embeddings generated and saved to question_with_embeddings2.json');
}

// Run the function
generateEmbeddings().catch(console.error);