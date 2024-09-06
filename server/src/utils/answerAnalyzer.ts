import { Answer } from "../types/allTypes";

interface AnalyzedAnswer extends Answer {
  is_correct: boolean;
}

interface AnalysisResult {
  answerEval: AnalyzedAnswer[];
  mark: string;
  user_level: number;
  point: number;
  avg_response_time: number;
  avg_intensity: number;
  answered_Questions: string[]
}

export const analyzeAnswer = (answers: Answer[]): AnalysisResult => {
  let correctCount = 0;
  let userLevelSum = 0;
  let responseTime = 0
  let intensity = 0
  const answeredQuestions:string[] = [];

  const answerEval: AnalyzedAnswer[] = answers.map((answer) => {
    responseTime += answer?.user_response_time 
    intensity += answer?.intensity
    const isCorrect =
      answer?.correct_option.toLowerCase() ===
      answer?.selected_option.toLowerCase();
    if (isCorrect) {
      correctCount++;
      userLevelSum += answer?.intensity * 0.5 + answer?.user_response_time * 0.5;
      answeredQuestions.push(answer?._id)
    }
    return { ...answer, is_correct: isCorrect };
  });

  const userLevel = correctCount > 0 ? userLevelSum / correctCount : 0;

  return {
    answerEval,
    mark: `${correctCount}/${answers.length}`,
    point: correctCount * 10,
    user_level: userLevel,
    avg_response_time: responseTime/answers.length,
    avg_intensity: intensity/answers.length,
    answered_Questions: answeredQuestions
  };
};