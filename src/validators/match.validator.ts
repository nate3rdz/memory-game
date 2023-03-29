import {z} from 'zod';

export const postValidator = z.object({
    user: z.string()
});

export const editValidator = z.object({
    closedAt: z.number()
}).refine((match) => match.closedAt <= Date.now());

export const searchFilterValidator = z.object({
    user: z.string().optional()
}).nullable().optional()