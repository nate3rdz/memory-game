import {z} from 'zod';

export const createValidator = z.object({
    nickname: z.string()
});

export const updateValidator = z.object({
    nickname: z.string()
});

export const searchByIdValidator = z.object({
    id: z.string()
});

export const searchFilterValidator = z.object({
    nickname: z.string().optional()
}).nullable().optional()