import { Request, Response } from "express";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { config } from "../config";
import Question from "../models/Questions";
import Note from "../models/Notes";
import { IPlan } from "../types/modelTypes/PlanTypes";
import User from "../models/User";
import { AuthRequested } from "../middlewares/authToken";
import Plan from "../models/Plans";
import { analyzeAnswer } from "../utils/answerAnalyzer";
import { UserResponsePlan, Answer } from "../types/allTypes";
import generateRecommendation from "../utils/generateRec";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: config.api.google.key,
  model: "text-embedding-004",
});

const createAssessment = async (req: AuthRequested, res: Response) => {
  const { topics } = req.body as { topics: string[] };
  const strTopic = topics.join(" ");
  const user = req.user;
  console.log("creating assessment...");

  try {
    console.log("making request....");
    const genEmbedding = await embeddings.embedQuery(strTopic);
    console.log("request successful!");
    const questionResults = await Question.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: genEmbedding,
          numCandidates: 100,
          limit: 10,
        },
      },
      {
        $project: {
          embedding: 0,
        },
      },
    ]);
    const noteResults = await Note.aggregate([
      {
        $vectorSearch: {
          index: "vector_index_notes",
          path: "embedding",
          queryVector: genEmbedding,
          numCandidates: 100,
          limit: 3,
        },
      },
      {
        $project: {
          embedding: 0,
        },
      },
    ]);

    const newPlan = await Plan.create({
      name: topics,
      questions: questionResults,
      notes: noteResults,
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const updateUser = await User.updateOne({ _id: user._id }, { $push: { plans: newPlan } });
    const allUserPlans = await User.findById(user._id).populate("plans");
    console.log("new plan created!");
    res.status(200).json({updateUser, allUserPlans});
  } catch (error: unknown) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const evaluateAssessment = async (req: AuthRequested, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  //contains responses for the assessment
  const { user_responses } = req.body as { user_responses: UserResponsePlan[] };//

  if (!user) {
    return res.status(401).json({ message: "User not authenticated" });
  }





  //filters the user response to find the plan that match the id
  const filteredPlans = user_responses.filter((user_response: UserResponsePlan) => user_response._id === id);
  const selectedPlan = filteredPlans.length > 0 ? filteredPlans[0] : undefined;
    
  if (!selectedPlan) {
    return res.status(404).json({ message: "Selected plan not found" });
  }
  //extracts the questions
  const answer = selectedPlan.questions as Answer[];


  try {
    const answerEvalResult = analyzeAnswer(answer);
    const aiPerformanceSummary = await generateRecommendation((answerEvalResult.point/10), answerEvalResult.answerEval);
    // Find the index of the plan to update
    const planIndex = user.plans.findIndex((plan) => plan._id.toString() === id);

    if (planIndex === -1) {
      return res.status(404).json({ message: "Plan not found in user's plans" });
    }

    // Prepare the update operation
    const updateOperation = {
      $set: {
        [`plans.${planIndex}.questions`]: answerEvalResult.answerEval,
        [`plans.${planIndex}.completedAt`]: new Date(),
        current_level: (user.current_level || 0) + answerEvalResult.user_level,
        avg_response_time: (user.avg_response_time || 0) + answerEvalResult.avg_response_time,
        avg_intensity: (user.avg_intensity || 0) + answerEvalResult.avg_intensity,
        points: (user.points || 0) + answerEvalResult.point,
      },
      $addToSet: {
        completed_questions: { $each: answerEvalResult.answered_Questions }
      }
    };

    // Perform the update
    const updateUser = await User.updateOne(
      { _id: user._id },
      updateOperation
    );

    if (updateUser.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update user data" });
    }



    res.status(200).json({ message: "Assessment evaluated and user data updated successfully", answerEvalResult, aiPerformanceSummary });
  } catch (error: unknown) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

export { createAssessment, evaluateAssessment };
