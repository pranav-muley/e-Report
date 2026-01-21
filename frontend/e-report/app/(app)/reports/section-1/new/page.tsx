"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { createCase } from "@/lib/actions/createCase";
import { fetchPoliceStations } from "@/lib/api/policeStation";
import {
    sectionOneSchema,
    SectionOneValues,
} from "@/types/section-1/sectionOneSchema";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export default function SectionOneForm() {
    const {
        data: stations = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["policeStations"],
        queryFn: fetchPoliceStations,
        staleTime: 5 * 60 * 1000,
    });

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<SectionOneValues>({
        resolver: zodResolver(sectionOneSchema),
        defaultValues: {
            branchCaseNumber: "",
            policeStationId: "",
            policeCaseNumber: "",
            sections: "",
            status: "DRAFT",
        },
    });

    const onSubmit = async (values: SectionOneValues) => {
        startTransition(async () => {
            try {
                const sectionList = values.sections.split(",");
                console.log(sectionList)
                const result = await createCase({
                    branchCaseNumber: values.branchCaseNumber,
                    policeStationCaseNumber: values.policeCaseNumber,
                    policeStationId: values.policeStationId,
                    sections: sectionList,
                });

                if (result.success) {
                    console.log("Case created successfully:", result.data);
                    router.push(`/reports/section-1/${result.data?.caseId}`);
                    form.reset();
                } else {
                    console.error("Error creating case:", result.error);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        });
    };

    return (
        <div className="w-full flex items-center justify-center">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="md:w-full min-w-md border border-accent rounded-lg shadow-md bg-white/50 dark:bg-accent/10 dark:border px-10 py-10"
            >
                <FieldGroup>
                    <FieldSet>
                        <div className="mb-4">
                            <p className="font-normal text-2xl mb-1">Case Form</p>
                            <FieldDescription>
                                Enter the details of Police Station
                            </FieldDescription>
                        </div>

                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="branchCaseNumber"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Branch Case Number</FieldLabel>
                                        <Input className="border border-neutral-400/50 dark:border-accent" {...field} placeholder="1234" />
                                    </Field>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    control={form.control}
                                    name="policeStationId"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Police Station</FieldLabel>

                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="border border-neutral-400/50 dark:border-accent">
                                                    <SelectValue
                                                        placeholder={
                                                            isLoading
                                                                ? "Loading police stations..."
                                                                : "Select police station"
                                                        }
                                                    />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {stations.map((station: any) => (
                                                        <SelectItem
                                                            key={station._id}
                                                            value={station._id}
                                                        >
                                                            {station.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FieldDescription>
                                                Select Police Station
                                            </FieldDescription>
                                        </Field>
                                    )}
                                />


                                <Controller
                                    control={form.control}
                                    name="policeCaseNumber"
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Police Station Case No.</FieldLabel>
                                            <Input className="border border-neutral-400/50 dark:border-accent" {...field} placeholder="Enter Police Station Case No." />
                                            <FieldDescription>
                                                Enter Police case number
                                            </FieldDescription>
                                        </Field>
                                    )}
                                />
                            </div>

                            <Controller
                                control={form.control}
                                name="sections"
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Sections</FieldLabel>
                                        <Input className="border border-neutral-400/50 dark:border-accent" {...field} placeholder="Enter Case Sections, separated by commas" />
                                        <FieldDescription>
                                            Enter Case Sections
                                        </FieldDescription>
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
                                            <SelectTrigger className="border border-neutral-400/50 dark:border-accent">
                                                <SelectValue placeholder="Draft" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem key="DRAFT" value="DRAFT">Draft</SelectItem>
                                                <SelectItem key="PENDING" value="PENDING">Pending</SelectItem>
                                                <SelectItem key="REJECTED" value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    <Field orientation="horizontal">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Submitting..." : "Submit"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}