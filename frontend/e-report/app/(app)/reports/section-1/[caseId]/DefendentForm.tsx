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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { UploadIcon } from "lucide-react";

export default function DefendantsForm({ caseId }: { caseId: string }) {
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
            className="rounded-lg border border-accent p-6 shadow-2xs bg-white/50 dark:bg-accent/20"

        >
            <FieldGroup>
                <h3 className="font-normal text-2xl mb-4">Defendant Details</h3>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 border-b pb-6 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name={`defendants.${index}.Name`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Defendant Name</FieldLabel>
                                        <Input {...field} placeholder="John" />
                                        <FieldDescription>
                                            Enter Defendant Name
                                        </FieldDescription>
                                    </Field>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name={`defendants.${index}.age`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Defendant Age</FieldLabel>
                                        <Input {...field} placeholder="25" />
                                        <FieldDescription>
                                            Defendant Defendant Age
                                        </FieldDescription>
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                control={form.control}
                                name={`defendants.${index}.gender`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Defendant Gender</FieldLabel>
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

                            <Controller
                                control={form.control}
                                name={`defendants.${index}.mobile`}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Defendant Phone Number</FieldLabel>
                                        <Input {...field} placeholder="8888888888" />
                                    </Field>
                                )}
                            />
                        </div>

                        <Field>
                            <FieldLabel>Defendant Address</FieldLabel>
                            <Textarea {...field} placeholder="New Delhi" />
                            <FieldDescription>
                                Enter Defendant Address
                            </FieldDescription>
                        </Field>

                        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">

                            <Controller
                                control={form.control ?? ""}
                                name={`defendants.${index}.document`}
                                render={({ field }) => (
                                    <Field>
                                        <Dropzone maxFiles={1} onDrop={handleDocument} src={document}>
                                            <DropzoneEmptyState>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                        <UploadIcon size={16} />
                                                    </div>
                                                    <p className="font-medium text-sm">Upload Defendant Document</p>
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
                                name={`defendants.${index}.photo`}
                                render={({ field }) => (
                                    <Field>
                                        <Dropzone maxFiles={1} onDrop={handlePhoto} src={photo}>
                                            <DropzoneEmptyState>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                        <UploadIcon size={16} />
                                                    </div>
                                                    <p className="font-medium truncate text-sm">Upload Defendant Photo</p>
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
                                name={`defendants.${index}.signature`}
                                render={({ field }) => (
                                    <Field>
                                        <Dropzone maxFiles={1} onDrop={handleSignature} src={signature}>
                                            <DropzoneEmptyState>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                        <UploadIcon size={16} />
                                                    </div>
                                                    <p className="font-medium truncate text-sm">Upload Defendant Signature</p>
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
