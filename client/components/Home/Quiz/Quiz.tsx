"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ShowResult from "./ShowResult";
import useAnalyseResult from "@/hooks/useAnalyseResult";

export interface Question {
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
  user_response_time?: number; // Store user response time
  selected_option?: string; // Store user's selected option

}

const Quiz: React.FC<{ onReview: () => void, questionWidth?: string }> = ({ onReview, questionWidth = 'w-full' }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selected_option, setSelected_option] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selected_option: string }[]

  >([]);
  const [startTime, setStartTime] = useState<number>(0);
  
  const [{isLoading, error}, analyseResult] = useAnalyseResult()

  const router = useRouter();
  const searchParams = useSearchParams();
  const index = Number(searchParams.get("index"));

  // Load questions from localStorage once
  useEffect(() => {
    const storedData = localStorage.getItem("user-plans");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const questions = parsedData[index]?.questions || [];
        if (questions.length > 0) {
          setQuestions(questions);
          setStartTime(Date.now()); // Initialize timer for the first question
        } else {
          console.error("No questions found in 'user-plans'.");
        }
      } catch (error) {
        console.error("Error parsing 'user-plans':", error);
      }
    } else {
      console.error("'user-plans' not found in localStorage.");
    }
  }, [index]);

  const handleOptionClick = (option: string) => {

    if (selected_option === null) setSelected_option(option);
  };

  const handleNextQuestion = useCallback(() => {
    if (selected_option === null) return;

    const responseTime = Math.round((Date.now() - startTime) / 1000);

    // Update the current question with the user's response time and selected option
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion].user_response_time = responseTime;
    updatedQuestions[currentQuestion].selected_option = selected_option;

    setQuestions(updatedQuestions);

    // Store selected answer
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { questionId: questions[currentQuestion]._id, selected_option },
    ]);

    // Move to the next question or finish the quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);

      setSelected_option(null);

      setStartTime(Date.now()); // Reset timer for the new question
    } else {
      setQuizFinished(true);
      console.log(questions)
      setShowResult(true);
    }
  }, [selected_option, startTime, questions, currentQuestion]);


  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);

      setSelected_option(
        userAnswers[currentQuestion - 1]?.selected_option || null

      );
    }
  };

  const handleStartOver = () => {
    setCurrentQuestion(0);
    setQuizFinished(false);
    setUserAnswers([]);
    setSelected_option(null);
    setShowResult(false);
  };

  const handleReviewResult = () => {
    const storedData = localStorage.getItem("user-plans");
    if (!storedData) return;
    const parsedData = JSON.parse(storedData);
    const planId = parsedData[index]?._id || "";

    const userAnswersQuery = encodeURIComponent(JSON.stringify(userAnswers));
    analyseResult(questions, planId)
    console.log(questions)
    router.push(`/review-result?answers=${userAnswersQuery}&index=${index}`);

    onReview();
  };

  const calculateScore = () => {
    return userAnswers.filter(
      (ans) =>

        ans.selected_option ===

        questions.find((q) => q._id === ans.questionId)?.correct_option
    ).length;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        handleNextQuestion();
      } else if (e.key === "ArrowUp") {
        handlePreviousQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };

  }, [handleNextQuestion, currentQuestion, selected_option]);


  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const question = questions[currentQuestion];
  const questionNumber = currentQuestion + 1;
  const totalQuestions = questions.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-6 text-custom-green-dark">
        Biology Assessment
      </h1>
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl flex flex-col md:flex-row">
        <div className="flex-1 mb-6 md:mb-0">
          <div className="mb-4 text-lg text-gray-700">
            Question {questionNumber} of {totalQuestions}
          </div>
          <p className="text-xl font-semibold mb-4">{question.question_text}</p>
        </div>
        <div className={`flex-1 space-y-2 ${questionWidth}`}>
          {Object.entries(question.answer_options).map(([key, option]) => (
            <button
              key={key}
              onClick={() => handleOptionClick(key)}
              className={`w-full px-4 py-2 text-left border rounded-md ${

                selected_option === key

                  ? "bg-custom-green-dark text-white"
                  : "bg-white text-gray-800"
              } border-custom-green-dark hover:bg-custom-green-dark hover:text-white transition-colors duration-300`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-custom-green-dark text-white rounded-md shadow-md hover:bg-custom-green transition-colors duration-300 flex items-center justify-center"
        >
          <FaArrowLeft />
          <span className="ml-2">Previous Question</span>
        </button>
        {quizFinished ? (
          <button
            onClick={handleReviewResult}
            className="px-4 py-2 bg-custom-green-dark text-white rounded-md shadow-md hover:bg-custom-green transition-colors duration-300"
          >
            Show Results
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            disabled={selected_option === null}
            className="px-4 py-2 bg-custom-green-dark text-white rounded-md shadow-md hover:bg-custom-green transition-colors duration-300 flex items-center justify-center"
          >
            <span className="mr-2">Next Question</span>
            <FaArrowRight />
          </button>
        )}
      </div>
      {showResult && (
        <ShowResult
          score={calculateScore()}
          onClose={handleStartOver}
          onReview={handleReviewResult}
        />
      )}
    </div>
  );
};

export default Quiz;