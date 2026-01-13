// sectionOneApplicantSchema.ts
import { z } from "zod";

export const applicantSchema = z.object({
  Name: z.string().min(1),
  age: z.string().min(1),
  gender: z.string().min(1),
  mobile: z.string().min(1),
  address: z.string().min(10),
  role: z.literal("APPLICANT"),
  signature: z.instanceof(File),
  photo: z.instanceof(File),
  document: z.instanceof(File),
});

export const sectionOneApplicantSchema = z.object({
  caseId: z.string().min(1),
  applicant: applicantSchema,
});

export type SectionOneApplicantValues = z.infer<
  typeof sectionOneApplicantSchema
>;
