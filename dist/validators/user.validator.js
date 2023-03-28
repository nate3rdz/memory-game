import { z } from 'zod';
export const validator = z.object({
    nickname: z.string()
});
export const updateValidator = z.object({
    nickname: z.string().optional(),
    bestTiming: z.number().optional()
});
export const searchByIdValidator = z.object({
    id: z.string()
});
export const searchFilterValidator = z.object({
    nickname: z.string().optional()
}).nullable().optional();
//# sourceMappingURL=user.validator.js.map