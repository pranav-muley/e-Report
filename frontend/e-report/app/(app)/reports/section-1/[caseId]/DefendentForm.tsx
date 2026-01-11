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
    sectionOneDefendantsSchema,
    SectionOneDefendantsValues,
} from "@/types/section-1/sectionOneDefendantSchema";

import { createEmptyDefendant } from "@/utils/emptyDefendant";

export default function DefendantsForm({ caseId }: { caseId: string }) {
    const form = useForm<SectionOneDefendantsValues>({
        resolver: zodResolver(sectionOneDefendantsSchema),
        defaultValues: {
            caseId,
            defendants: [createEmptyDefendant()],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "defendants",
    });

    const onSubmit = (values: SectionOneDefendantsValues) => {
        console.log(values.defendants);
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border p-6"
        >
            <FieldGroup>
                <h3 className="font-semibold mb-4">Defendant Details</h3>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border-b pb-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <Input
                                    {...form.register(`defendants.${index}.Name`)}
                                    placeholder="John Doe"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Age</FieldLabel>
                                <Input
                                    {...form.register(`defendants.${index}.age`)}
                                    placeholder="25"
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name={`defendants.${index}.gender`}
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
                                    {...form.register(`defendants.${index}.mobile`)}
                                    placeholder="8888888888"
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Address</FieldLabel>
                            <Input
                                {...form.register(`defendants.${index}.address`)}
                                placeholder="Full address"
                            />
                        </Field>

                        {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => remove(index)}
                            >
                                Remove Defendant
                            </Button>
                        )}
                    </div>
                ))}


                <div className="flex gap-4 items-center">

                    <Button type="submit" className="w-fit">
                        Save Defendants
                    </Button>

                    <Button
                        type="button"
                        onClick={() => append(createEmptyDefendant())}
                        className="w-fit"
                    >
                        + Add Defendant
                    </Button>
                </div>

            </FieldGroup>
        </form>
    );
}
