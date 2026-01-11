"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
    sectionOneSchema,
    SectionOneValues,
} from "@/types/section-1/sectionOneSchema";
import { useRouter } from "next/navigation";

export default function SectionOneForm({
    onSuccess,
}: {
    onSuccess: (caseId: string) => void;
}) {
    const form = useForm<SectionOneValues>({
        resolver: zodResolver(sectionOneSchema),
        defaultValues: {
            branchCaseNumber: "",
            officerId: "",
            policeStationId: "",
            policeCaseNumber: "",
            reportType: "",
            status: "DRAFT",
            comments: "",
        },
    });
    const router = useRouter();
    const onSubmit = async (values: SectionOneValues) => {
        // const res = await fetch("/api/cases", {
        //     method: "POST",
        //     body: JSON.stringify(values),
        // });

        // const data = await res.json();
        const caseId = "5";
        router.push(`/reports/section-1/${caseId}`)
    };

    return (
        <div className="w-full flex items-center justify-center">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="md:w-full min-w-md rounded-lg dark:border dark:border-accent px-10 py-10"
            >
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Section-1 Form</FieldLegend>
                        <FieldDescription>
                            Enter the details of Police Station
                        </FieldDescription>

                        <FieldGroup>
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    control={form.control}
                                    name="branchCaseNumber"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Branch Case Number</FieldLabel>
                                            <Input {...field} placeholder="1234" />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="officerId"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Officer Id</FieldLabel>
                                            <Input {...field} placeholder="1234" />
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    control={form.control}
                                    name="policeStationId"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Police Station Id</FieldLabel>
                                            <Input {...field} />
                                            <FieldDescription>
                                                Enter Police Station Id
                                            </FieldDescription>
                                        </Field>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="policeCaseNumber"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Police Case Number</FieldLabel>
                                            <Input {...field} />
                                            <FieldDescription>
                                                Enter Police case number
                                            </FieldDescription>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    control={form.control}
                                    name="reportType"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Report Type</FieldLabel>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="section-1" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="01">01</SelectItem>
                                                    <SelectItem value="02">02</SelectItem>
                                                    <SelectItem value="03">03</SelectItem>
                                                    <SelectItem value="04">04</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />

                                <Controller
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Status</FieldLabel>
                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Draft" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <Controller
                            control={form.control}
                            name="comments"
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Comments</FieldLabel>
                                    <Textarea {...field} className="resize-none" />
                                </Field>
                            )}
                        />
                    </FieldSet>

                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
