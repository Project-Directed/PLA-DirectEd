import mongoose from "mongoose";
import { IPlan } from "../types/modelTypes/PlanTypes";

interface IPlanSchema extends IPlan, Document {}

const PlanSchema = new mongoose.Schema<IPlanSchema>({
  name: {
    type: [String],
    required: true,
  },
  questions: {
    type: [Object],
    required: true,
  },
  notes: {
    type: [Object],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  completedAt: {
    type: Date,
  },
});

const Plan = mongoose.model<IPlanSchema>("Plan", PlanSchema);

export default Plan;