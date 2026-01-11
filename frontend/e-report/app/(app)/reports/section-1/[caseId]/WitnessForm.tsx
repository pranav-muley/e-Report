"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    sectionOneWitnessSchema,
    SectionOneWitenessValues,
} from "@/types/section-1/sectionOneWitnessSchema";

import { createEmptyWitness } from "@/utils/emptyWiteness";

export default function WitnessForm({ caseId }: { caseId: string }) {
    const form = useForm<SectionOneWitenessValues>({
        resolver: zodResolver(sectionOneWitnessSchema),
        defaultValues: {
            caseId,
            witnesses: [createEmptyWitness()], // ✅ same pattern
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "witnesses",
    });

    const onSubmit = (values: SectionOneWitenessValues) => {
        console.log(values.witnesses);
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border p-6"
        >
            <FieldGroup>
                <h3 className="font-semibold mb-4">Witness Details</h3>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border-b pb-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <Input
                                    {...form.register(`witnesses.${index}.Name`)}
                                    placeholder="John Doe"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Age</FieldLabel>
                                <Input
                                    {...form.register(`witnesses.${index}.age`)}
                                    placeholder="25"
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name={`witnesses.${index}.gender`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Gender</FieldLabel>
                                        <Select
                                            value={field.value ?? ""}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">Male</SelectItem>
                                                <SelectItem value="FEMALE">Female</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />

                            <Field>
                                <FieldLabel>Mobile</FieldLabel>
                                <Input
                                    {...form.register(`witnesses.${index}.mobile`)}
                                    placeholder="8888888888"
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Address</FieldLabel>
                            <Input
                                {...form.register(`witnesses.${index}.address`)}
                                placeholder="Full address"
                            />
                        </Field>

                        {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => remove(index)}
                            >
                                Remove Witness
                            </Button>
                        )}
                    </div>
                ))}

                <div className="flex gap-4 items-center">
                    <Button type="submit" className="w-fit">
                        Save Witnesses
                    </Button>

                    <Button
                        type="button"
                        onClick={() => append(createEmptyWitness())}
                        className="w-fit"
                    >
                        + Add Witness
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
