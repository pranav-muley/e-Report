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

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { UploadIcon } from "lucide-react";
import { createEmptyWitness } from "@/utils/emptyWiteness";

export default function witnessesForm({ caseId }: { caseId: string }) {
    const [document, setDocument] = useState<File[] | undefined>();
    const [photo, setPhoto] = useState<File[] | undefined>();
    const [signature, setSignature] = useState<File[] | undefined>();


    const handleDocument = (files: File[]) => {
        setDocument(files);
    };

    const handlePhoto = (files: File[]) => {
        setPhoto(files);
    }

    const handleSignature = (files: File[]) => {
        setSignature(files);
    }

    const form = useForm<SectionOneWitenessValues>({
        resolver: zodResolver(sectionOneWitnessSchema),
        defaultValues: {
            caseId,
            witnesses: [createEmptyWitness()],
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
            className="rounded-lg border border-accent p-6 shadow-2xs bg-white/50 backdrop-blur-sm dark:bg-accent/20"
        >
            <FieldGroup>
                <p className="font-normal text-2xl mb-4">Witness Details <span className="text-neutral-400">(optional)</span> </p>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border-b pb-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name={`witnesses.${index}.Name`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Witness Name</FieldLabel>
                                        <Input {...field} placeholder="John" />
                                        <FieldDescription>
                                            Enter Witness's Name
                                        </FieldDescription>
                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name={`witnesses.${index}.age`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Witness Age</FieldLabel>
                                        <Input {...field} placeholder="25" />
                                        <FieldDescription>
                                            Enter Witness's Age
                                        </FieldDescription>
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name={`witnesses.${index}.gender`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Witness Gender</FieldLabel>
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
                                <FieldLabel>Witness Phone Number</FieldLabel>
                                <Input
                                    {...form.register(`witnesses.${index}.mobile`)}
                                    placeholder="8888888888"
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Witness Address</FieldLabel>
                            <Textarea {...field} placeholder="New Delhi" />
                            <FieldDescription>
                                Enter Witness Address
                            </FieldDescription>
                        </Field>

                        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">

                            <Controller
                                control={form.control ?? ""}
                                name={`witnesses.${index}.document`}
                                render={({ field }) => (
                                    <Field>
                                        <Dropzone maxFiles={1} onDrop={handleDocument} src={document}>
                                            <DropzoneEmptyState>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                        <UploadIcon size={16} />
                                                    </div>
                                                    <p className="font-medium text-sm">Upload Witness Document</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        PDF only
                                                    </p>
                                                </div>
                                            </DropzoneEmptyState>
                                            <DropzoneContent />
                                        </Dropzone>
                                    </Field>
                                )}
                            />


                            <Controller
                                control={form.control ?? ""}
                                name={`witnesses.${index}.photo`}
                                render={({ field }) => (
                                    <Field>
                                        <Dropzone maxFiles={1} onDrop={handlePhoto} src={photo}>
                                            <DropzoneEmptyState>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                        <UploadIcon size={16} />
                                                    </div>
                                                    <p className="font-medium truncate text-sm">Upload Witness Photo</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        JPG / PNG only
                                                    </p>
                                                </div>
                                            </DropzoneEmptyState>

                                            <DropzoneContent />
                                        </Dropzone>

                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control ?? ""}
                                name={`witnesses.${index}.signature`}
                                render={({ field }) => (
                                    <Field>
                                        <Dropzone maxFiles={1} onDrop={handleSignature} src={signature}>
                                            <DropzoneEmptyState>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                        <UploadIcon size={16} />
                                                    </div>
                                                    <p className="font-medium truncate text-sm">Upload Witness Signature</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        JPG / PNG only
                                                    </p>
                                                </div>
                                            </DropzoneEmptyState>

                                            <DropzoneContent />
                                        </Dropzone>
                                    </Field>
                                )}
                            />

                        </div>

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
                        Save witnesses
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
