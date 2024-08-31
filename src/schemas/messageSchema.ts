import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(10, "Feedback should be of minimum 10 characters.").max(300, "feedback should be of maximum 300 characters.")
})