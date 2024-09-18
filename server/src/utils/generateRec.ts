import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

const genAI = new GoogleGenerativeAI(config.api.google.key);


async function generateRecommendation(score: number, answerEval: any[]): Promise<any> {
    //This creates a prompt that will be sent to the AI model
    const prompt = `
    <Instructions>
    - Use the provided JSON data in the Question as your only source of information to create a performance summary.
    - Return a JSON format of the performance summary, as shown in the example below.
    </Instructions>
    <Suggestions>
    - The JSON is about an answer evaluation result of 10 questions to the subject "Biology".
    - Pay CLOSE ATTENTION to the question_text, answer_options, correct_option, explanation, intensity, and expected_response_time of each question in the answerEval list and compare them with selected_option, user_response_time and is_correct values in the answerEval list.
    - Based on your comparison provide a JSON output that looks like this:
    {
    "performance_summary": "detailed performance summary",
    "improvement_topics": ["topic1", "topic2", "topic3"],
    "suggested_intensity_level": [0.5,0.6,0.7]
    }
    </Suggestions>
  
    <Question>
      ${JSON.stringify(answerEval, null, 2)}
      </<Question>>
  
      <ExampleJSONOutput>
{
"performance_summary": "Your performance is intermediate level. We suggest you practice more on the [topic list] to improve your performance",
"improvement_topics": ["The Endoplasmic Reticulum", "The Golgi Apparatus"],
"suggested_intensity_level": [0.5,0.6,0.7]
}


</ExampleJSONOutput>
    `;
    //selects ai model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const response = result.response.text();



    const editedResponse = response.replace("```json\n", "").replace("\n```", "").replace("\n", "").replace(/\\/g, '')


  
    return {
      score: score,
      generated_recommendation: editedResponse
    };
  }

export default generateRecommendation