'use client'

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Geist } from "next/font/google";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

const geistSans = Geist({
  subsets: ["latin"],
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export default function Login() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <section
      className={`${geistSans.className} flex items-center justify-center h-screen w-screen`}
    >
      <form
        action={formAction}
        className="w-full max-w-xl shadow-lg border border-neutral-400/20 p-8 rounded-lg"
      >
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                name="email"
                type="email"
                placeholder="officer@ereport.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </Field>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <SubmitButton />
          </FieldGroup>
        </FieldSet>
      </form>
    </section>
  );
}
