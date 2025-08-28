import { z } from "zod";

export const age_gender_schema = z.object({
    age:z.number().min(1, {message: "Age must be at least 1"}).max(120, {message: "Age must be at most 120"}),
    gender:z.enum(["male", "female", "other"])
}); 