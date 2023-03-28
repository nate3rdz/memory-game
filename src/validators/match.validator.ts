import {z} from 'zod';

export const validator = z.object({
    user: z.string(),
    closed: z.boolean().optional(),
    closedAt: z.number().optional()
});

export const editValidator = z.object({
    closed: z.boolean().optional(),
    closedAt: z.number().optional()
});

export const searchByIdValidator = z.object({
    id: z.string()
});

export const searchFilterValidator = z.object({
    user: z.string().optional()
}).nullable().optional()