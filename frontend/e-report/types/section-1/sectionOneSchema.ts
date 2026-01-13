import { z } from "zod";

export const sectionOneSchema = z.object({
  branchCaseNumber: z.string().min(1),
  officerId: z.string().min(1),
  policeStationId: z.string().min(1),
  policeCaseNumber: z.string().min(1),
  reportType: z.string(),
  status: z.enum(["DRAFT", "PENDING", "REJECTED"]),
  comments: z.string().optional(),
});

export type SectionOneValues = z.infer<typeof sectionOneSchema>;
