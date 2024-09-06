export interface IPlan {
    name: string[];
    questions: object[];
    createdAt: Date;
    completedAt?: Date;
}