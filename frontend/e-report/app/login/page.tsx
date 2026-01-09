'use client'


import { Geist } from "next/font/google";
import {
  Field,
  FieldLabel,
  FieldSet,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Login() {
  const handleNavigation = () => {
    redirect("/dashboard");
  };

  return (
    <section
      className={`${geistSans.className} altialiased flex items-center justify-center h-screen w-screen`}
    >
      <div className="w-full max-w-xl shadow-lg border border-neutral-400/20 p-8 rounded-lg">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username" className="text-md">
                Username
              </FieldLabel>
              <Input id="username" type="text" placeholder="Max Leiter" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password" className="text-md">
                Password
              </FieldLabel>
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              <Input id="password" type="password" placeholder="••••••••" />
            </Field>
            <Button onClick={handleNavigation} className="cursor-pointer">
              Login
            </Button>
          </FieldGroup>
        </FieldSet>
      </div>
    </section>
  );
}
