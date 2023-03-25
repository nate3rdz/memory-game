import {z} from 'zod';

export const validator = z.object({
    nickname: z.string()
});

export const searchByIdValidator = z.object({
    id: z.string()
});

export const searchFilterValidator = z.object({
    test: z.string().optional()
}).nullable().optional()