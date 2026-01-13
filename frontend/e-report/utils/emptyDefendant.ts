// utils/emptyDefendant.ts
export const createEmptyDefendant = () => ({
    Name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    role: "DEFENDANT" as const,
    signature: undefined as unknown as File,
    photo: undefined as unknown as File,
    document: undefined as unknown as File,
  });
  