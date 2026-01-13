import { z } from "zod";

export const defendantSchema = z.object({
  Name: z.string().min(1),
  age: z.string().min(1),
  gender: z.string().min(1),
  mobile: z.string().min(1),
  address: z.string().min(10),
  role: z.literal("DEFENDANT"),
  signature: z.instanceof(File),
  photo: z.instanceof(File),
  document: z.instanceof(File),
});

export const sectionOneDefendantsSchema = z.object({
  caseId: z.string().min(1),
  defendants: z.array(defendantSchema).min(1),
});

export type SectionOneDefendantsValues = z.infer<
  typeof sectionOneDefendantsSchema
>;
