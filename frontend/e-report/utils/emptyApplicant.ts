// utils/emptyApplicant.ts
export const createEmptyApplicant = () => ({
    Name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    role: "APPLICANT" as const,
    signature: undefined as unknown as File,
    photo: undefined as unknown as File,
    document: undefined as unknown as File,
  });
  