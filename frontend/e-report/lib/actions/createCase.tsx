import { serverFetch } from "../api/server-api";

export async function createCase(caseData: {
    branchCaseNumber: string;
    policeStationCaseNumber: string;
    sections: string[];
    policeStationId: string;
}) {
    try {
        const result = await serverFetch<{ caseId: string; status: string }>("/cases", {
            method: "POST",
            body: {
                branchCaseNumber: caseData.branchCaseNumber,
                policeStationCaseNumber: caseData.policeStationCaseNumber,
                sections: caseData.sections,
                policeStationId: caseData.policeStationId,
            },
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("Error creating case:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create case",
        };
    }
}