// utils/emptyWitness.ts
export const createEmptyWitness = () => ({
    Name: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    role: "WITNESS" as const,
    signature: undefined as unknown as File,
    photo: undefined as unknown as File,
    document: undefined as unknown as File,
  });
  