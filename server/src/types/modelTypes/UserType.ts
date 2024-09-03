import { User } from "../allTypes";

export interface IUser extends User {
    current_level: number;
    points: number;
    completed_questions: object[];
    avg_response_time: number;
    avg_intensity: number;
    plans: object[];
    createdAt: Date;
    updatedAt: Date;
}