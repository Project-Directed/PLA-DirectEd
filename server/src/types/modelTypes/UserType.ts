import { UserTypes } from "../allTypes";

export interface IUser extends UserTypes {
    _id?: any;
    current_level: number;
    points: number;
    completed_questions: string[];
    avg_response_time: number;
    avg_intensity: number;
    plans: object[];
    createdAt: Date;
    updatedAt: Date;
}

