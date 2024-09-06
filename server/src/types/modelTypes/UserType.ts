import { UserTypes } from "../allTypes";

interface plansType {
    _id: string;
    name: string[];
    questions: object[];
    notes: object[];
    createdAt?: Date;
    completedAt?: Date;
}
export interface IUser extends UserTypes {
    _id?: any;
    current_level: number;
    points: number;
    completed_questions: string[];
    avg_response_time: number;
    avg_intensity: number;
    plans: plansType[];
    createdAt: Date;
    updatedAt: Date;
}

