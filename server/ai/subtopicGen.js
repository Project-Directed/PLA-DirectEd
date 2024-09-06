const fs = require('fs');
const path = require('path');

// Define the input and output file paths
const inputFilePath = path.join(__dirname, 'question_with_embeddings.json');
const outputFilePath = path.join(__dirname, 'subtopics.json');

// Read the JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const questions = JSON.parse(data);

    // Extract the subtopic keys
    const subtopics = questions.map(question => question.subtopic);

    // Create a new JSON object with the extracted subtopics
    const result = { subtopics };

    // Write the result to a new JSON file
    fs.writeFile(outputFilePath, JSON.stringify(result, null, 2), 'utf8', err => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('Subtopics extracted and saved to', outputFilePath);
    });
  } catch (err) {
    console.error('Error parsing JSON data:', err);
  }
});