import { z } from "zod";

export const sectionOneSchema = z.object({
  branchCaseNumber: z.string().min(1),
  policeStationId: z.string().min(1),
  policeCaseNumber: z.string().min(1),
  status: z.enum(["DRAFT", "PENDING", "REJECTED"]),
  sections: z.string().min(1),
});

export type SectionOneValues = z.infer<typeof sectionOneSchema>;
