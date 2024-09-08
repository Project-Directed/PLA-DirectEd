"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter

interface Question {
  _id: string;
  question_text: string;
  answer_options: Record<string, string>;
  correct_option: string;
  explanation: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  intensity?: number;
  expected_response_time?: number;
  normalized_response_time?: number;
}

interface UserAnswer {
  questionId: string;
  selectedOption: string;
}

interface ReviewResultProps {
  onClose: () => void;
}

const ReviewResult: React.FC<ReviewResultProps> = ({ onClose }) => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showFullContent, setShowFullContent] = useState(false); // State to control content view

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/questions.json"); // Fetch questions from the public folder
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const answersParam = searchParams.get("answers");
    if (answersParam) {
      try {
        const parsedAnswers = JSON.parse(decodeURIComponent(answersParam));
        setUserAnswers(parsedAnswers);
      } catch (error) {
        console.error("Error parsing user answers:", error);
      }
    }
  }, [searchParams]);

  const fetchRecommendation = async () => {
    try {
      const response = await fetch("/Ai.json"); // Corrected path to Ai.json
      if (!response.ok) {
        throw new Error("Failed to fetch recommendation");
      }
      const data = await response.json();
      console.log("Recommendation fetched:", data); // Debug log to confirm fetching
      setRecommendation(data);
      setShowRecommendation(true); // Show the recommendation popup
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

  // Function to navigate to the Daily Study page
  const handleGetPlan = () => {
    router.push("/daily-study"); // Navigate to the Daily Study page
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-6">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full h-full overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h1 className="text-2xl font-bold mb-6 text-custom-green-dark text-center">
          Review Your Answers
        </h1>
        {questions.length > 0 ? (
          questions.map((question, index) => {
            const userAnswer = userAnswers.find(
              (ans) => ans.questionId === question._id
            );

            return (
              <div key={question._id} className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {index + 1}. {question.question_text}
                </h2>
                <ul className="list-disc ml-6 mt-2">
                  {Object.entries(question.answer_options).map(
                    ([key, option]) => (
                      <li
                        key={key}
                        className={`text-lg ${
                          key === question.correct_option
                            ? "text-custom-green-dark font-bold"
                            : userAnswer?.selectedOption === key
                            ? "text-red-500 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {key}: {option}
                      </li>
                    )
                  )}
                </ul>
                {userAnswer?.selectedOption !== question.correct_option && (
                  <p className="mt-2 text-sm text-gray-500">
                    Explanation: {question.explanation}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-600">
                  Your Answer: {userAnswer?.selectedOption || "No answer"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-700 text-center">Loading questions...</p>
        )}

        {/* AI Recommendation Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchRecommendation}
            className="bg-custom-green-dark text-white py-2 px-6 rounded-lg hover:bg-custom-green-light transition"
          >
            Get AI Recommendation
          </button>
        </div>

        {/* AI Recommendation Popup */}
        {showRecommendation && recommendation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              {/* Close Icon at the top-right corner */}
              <button
                onClick={() => setShowRecommendation(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-custom-green-dark">
                {recommendation.title}
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Topics:</h3>
                <ul className="list-disc ml-6 mt-2 text-gray-700">
                  {recommendation.topic.map((topic: string, index: number) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4 overflow-y-auto max-h-48 pr-4">
                {/* Added scrolling */}
                <h3 className="text-lg font-semibold text-gray-800">Content:</h3>
                <p className="text-gray-700">
                  {showFullContent
                    ? recommendation.content
                    : `${recommendation.content.substring(0, 150)}...`}
                </p>
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-custom-green-dark font-semibold hover:underline mt-2"
                >
                  {showFullContent ? "View Less" : "View More"}
                </button>
              </div>
              {/* Footer buttons fixed at the bottom of the modal */}
              <div className="flex justify-between mt-6 border-t pt-4">
                <button
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  onClick={() => setShowRecommendation(false)}
                >
                  Close
                </button>
                <button
                  className="bg-custom-green-dark text-white py-2 px-4 rounded-lg hover:bg-custom-green-light transition"
                  onClick={handleGetPlan} // Navigate to Daily Study page
                >
                  Get Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResult;
