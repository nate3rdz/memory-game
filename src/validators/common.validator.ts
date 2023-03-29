import {z} from "zod";
import mongoose from "mongoose";

export const searchByIdValidator = z.object({
    id: z.string()
}).refine(value => mongoose.isValidObjectId(value.id));

export const paginationValidator = z.object({
    skip: z.string().optional(),
    limit: z.string().optional()
});