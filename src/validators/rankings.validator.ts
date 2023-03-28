import {z} from 'zod';
import mongoose from "mongoose";

export const updateTimingValidator = z.object({
    _id: z.string(),
}).refine((value) => mongoose.isValidObjectId(value._id), {message: "An invalid id was given."});

export const searchByIdValidator = z.object({
    id: z.string()
}).refine((value) => mongoose.isValidObjectId(value.id), {message: "An invalid id was given."});