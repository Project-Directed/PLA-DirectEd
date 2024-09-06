export interface IPlan {
    name: string[];
    questions: object[];
    notes: object[];
    createdAt?: Date;
    completedAt?: Date;
}