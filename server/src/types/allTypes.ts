import { IPlan } from "./modelTypes/PlanTypes";

export interface UserTypes {
    full_name: string;
    phone_number: string;
    email: string;
    password: string;
    username: string;
}

export interface loginTypes {
    email: string;
    password: string;
}


export interface Answer {
    correct_option: string;
    selected_option: string;
    intensity: number;
    user_response_time: number;
    [key: string]: any; // This allows for additional properties
  }
  
    export interface UserResponsePlan extends Answer {
        _id?: string
        questions?: object[]
    }