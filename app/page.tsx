"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoginPic from "@/public/loginPic.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .required();

type FormFields = z.infer<typeof schema>;
export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    const { username, password } = data;
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(response);

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
    return true;
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block">
        <Image
          src={LoginPic}
          alt="Health Profiling"
          height={0}
          width={0}
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="h-full w-full object-fill"
        />
      </div>
      <div className="flex items-center justify-center bg-background px-4 py-12 md:px-6">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Barangay Health Profiling</h1>
            <p className="text-muted-foreground font-awesome">
              Sign in to your account to access the health profiling
              application.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <div className="bg-red-300 py-1 px-2 text-sm">
                {errors.root?.message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                {...register("username")}
                id="username"
                type="text"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-medium underline underline-offset-4"
                  prefetch={false}
                >
                  terms and policies
                </Link>
              </Label>
            </div>
            <Link href="/dashboard">
              <Button disabled={isSubmitting} type="submit" className="w-full">
                Sign In
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
