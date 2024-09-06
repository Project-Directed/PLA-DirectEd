import {Request, Response} from "express"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { config } from "../config";
import Question from "../models/Questions";
import Note from "../models/Notes";
import { IPlan } from "../types/modelTypes/PlanTypes";
import User from "../models/User";
import { AuthRequested } from "../middlewares/authToken";


const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: config.api.google.key,
    model: "text-embedding-004",
})
const createAssessment = async(req:AuthRequested, res:Response) => {
    const {topics} = req.body
    const strTopic = topics.join(" ")
    const user = req.user
    console.log("creating assessment...")

    try {
        console.log("making request....")
        const genEmbedding = await embeddings.embedQuery(strTopic)
        console.log("request  successfully!")
        const questionResults = await Question.aggregate([
            {
                "$vectorSearch": {
                  "index": "vector_index",
                  "path": "embedding",
                  "queryVector": genEmbedding,
                  "numCandidates": 100,
                  "limit": 10,
                }
              },
              {
                "$project": {
                "embedding": 0,
              }
            }
        ])
        const noteResults = await Note.aggregate([
            {
                "$vectorSearch": {
                  "index": "vector_index_notes",
                  "path": "embedding",
                  "queryVector": genEmbedding,
                  "numCandidates": 100,
                  "limit": 3,
                }
              },
              {
                "$project": {
                "embedding": 0,
              }
            }
        ])
        const plan: IPlan = {
          name: topics,
          questions: questionResults,
          notes: noteResults,
        }
        const newPlan = await User.updateOne({_id: user?._id}, {$push: {plans: plan}})
        console.log("new plan created!")
        res.status(200).json(newPlan)
    } catch (error: any) {
        res.status(500).json({message: "Internal Server Error"})
        console.log(error)
    }
}



export {createAssessment}