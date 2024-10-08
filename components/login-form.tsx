"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useForm,
  FieldError,
  UseFormRegister,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loginAction } from "@/app/actions/auth";

// Define the schema for form validation
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [agreed, setAgreed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const result = await loginAction(data);
      if (result && result.success) {
        // Handle successful login (e.g., redirect to dashboard)
        window.location.href = "/dashboard";
      } else {
        setServerError(result?.error || "An error occurred during login.");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 relative">
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        quality={100}
        className="blur-sm object-cover"
        priority
      />

      <div className="w-full max-w-[500px] bg-white p-8 rounded-lg shadow-lg relative z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Barangay Health Profiling
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Access your health profiling account
        </p>

        {serverError && (
          <p className="text-sm text-red-500 mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Username"
            name="username"
            register={register}
            error={errors.username}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked: boolean) => setAgreed(checked)}
            />
            <label htmlFor="terms" className="text-sm font-medium">
              I agree to the <TermsDialog />
            </label>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            type="submit"
            disabled={!agreed}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: keyof LoginFormValues;
  type?: string;
  register: UseFormRegister<LoginFormValues>;
  error?: FieldError;
}

function FormField({
  label,
  name,
  type = "text",
  register,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input id={name} type={type} {...register(name)} />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-sm font-medium text-blue-600"
        >
          terms and conditions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Here you can include your terms and conditions text. This is a
            placeholder for the actual content.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
