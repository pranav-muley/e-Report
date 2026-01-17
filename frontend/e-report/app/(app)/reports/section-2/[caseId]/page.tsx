"use client";

import ApplicantForm from "./ApplicantForm";
import DefendantsForm from "./DefendentForm";
import WitnessesForm from "./WitnessForm";

export default function SectionTwoPage({
    caseId,
}: {
    caseId: string;
}) {
    return (
        <div className="space-y-10">
            <ApplicantForm caseId={caseId} />
            <DefendantsForm caseId={caseId} />
            <WitnessesForm caseId={caseId} />
        </div>
    );
}
