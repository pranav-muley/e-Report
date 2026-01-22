"use server";

import { serverFetchMultipart } from "@/lib/api/server-api"; // Adjust path

export async function createApplicant(formData: FormData) {
    try {
        // Extract data from FormData
        const caseId = formData.get("caseId") as string;
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const age = formData.get("age") as string;
        const gender = formData.get("gender") as string;
        const mobile = formData.get("mobile") as string;
        const address = formData.get("address") as string;
        const photo = formData.get("photo") as File | null;
        const signature = formData.get("signature") as File | null;
        const document = formData.get("document") as File | null;

        // Map gender to API format
        const genderMap: Record<string, string> = {
            MALE: "M",
            FEMALE: "F",
            OTHER: "O",
        };
        const apiGender = genderMap[gender] || gender;

        // Create new FormData for API - reconstruct properly
        const apiFormData = new FormData();
        apiFormData.append("name", name);
        apiFormData.append("role", role);
        apiFormData.append("age", age);
        apiFormData.append("gender", apiGender);
        apiFormData.append("mobile", mobile);
        apiFormData.append("address", address);

        // Append files only if they exist and have size
        if (photo instanceof File && photo.size > 0) {
            apiFormData.append("photo", photo, photo.name);
        }
        if (signature instanceof File && signature.size > 0) {
            apiFormData.append("signature", signature, signature.name);
        }
        if (document instanceof File && document.size > 0) {
            apiFormData.append("document", document, document.name);
        }

        const result = await serverFetchMultipart<{ 
            success: boolean;
            personId: string;
            files: {
                photo?: string;
                signature?: string;
                document?: string;
            };
        }>(`/cases/${caseId}/persons`, apiFormData);

        return { success: true, data: result };
    } catch (error) {
        console.error("Error creating applicant:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create applicant",
        };
    }
}