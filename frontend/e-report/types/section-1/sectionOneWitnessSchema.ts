import { z } from "zod";

export const witnessSchema = z.object({
  Name: z.string().min(1),
  age: z.string().min(1),
  gender: z.string().min(1),
  mobile: z.string().min(1),
  address: z.string().min(10),
  role: z.literal("WITNESS"),
  signature: z.instanceof(File),
  photo: z.instanceof(File),
  document: z.instanceof(File),
});

export const sectionOneWitnessSchema = z.object({
  caseId: z.string().min(1),
  witnesses: z.array(witnessSchema).min(1),
});

export type SectionOneWitenessValues = z.infer<
  typeof sectionOneWitnessSchema
>;
