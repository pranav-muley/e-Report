"use client";

import { useParams } from "next/navigation";
import ApplicantForm from "./ApplicantForm";
import DefendantsForm from "./DefendentForm";
import WitnessesForm from "./WitnessForm";

export default function SectionTwoPage() {
    const params = useParams();
    const caseId = params.caseId as string;
    return (
        <div className="space-y-10">
            <ApplicantForm caseId={caseId} />
            <DefendantsForm caseId={caseId} />
            <WitnessesForm caseId={caseId} />
        </div>
    );
}
