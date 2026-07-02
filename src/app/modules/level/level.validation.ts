import z from "zod";

export const createLevelZod = z.object({
  name: z.string().min(1, "Name is required"),
  index: z.coerce.number().int().min(1, "Index is required"),
});

export const updateLevelZod = z.object({
  name: z.string().optional(),
  index: z.coerce.number().optional(),
});

export type CreateLevelZod = z.infer<typeof createLevelZod> & { image: string };
export type UpdateLevelZod = z.infer<typeof updateLevelZod> & {
  image?: string;
};
