"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPageComponent() {
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handleAgree = () => {
    setAgreed(true);
    setShowTerms(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-400 to-sky-200 p-4 backdrop-blur-sm">
      <div className="relative mx-auto max-w-md">
        <div className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-white/20 blur-sm" />
        <div className="absolute -right-4 bottom-4 h-12 w-12 rounded-full bg-white/20 blur-sm" />
        <div className="absolute right-8 top-8 h-6 w-6 rounded-full bg-white/20 blur-sm" />

        <div className="relative mt-12 rounded-xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Barangay Health Profiling
              </h1>
              <p className="text-muted-foreground">
                Access your health profiling account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  required
                  className="transition-all hover:border-sky-400 focus:border-sky-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pr-10 transition-all hover:border-sky-400 focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={() => !agreed && setShowTerms(true)}
                  className="h-5 w-5"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    onClick={handleTermsClick}
                    className="font-medium text-sky-600 underline underline-offset-4 hover:text-sky-800"
                  >
                    terms and conditions
                  </a>
                </label>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-sky-500 text-lg font-semibold hover:bg-sky-600"
                disabled={!agreed}
              >
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <p>
              Welcome to Barangay Health Profiling. Before you proceed, please
              read and agree to our terms and conditions:
            </p>

            <h3 className="font-semibold">1. Account Usage</h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities under your account.
            </p>

            <h3 className="font-semibold">2. Privacy</h3>
            <p>
              We collect and process your personal information in accordance
              with our Privacy Policy. By using this service, you consent to
              such processing.
            </p>

            <h3 className="font-semibold">3. Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal health information.
            </p>

            <h3 className="font-semibold">4. User Obligations</h3>
            <p>
              You agree to provide accurate and complete information and to
              update such information to keep it accurate and current.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAgree}
              className="bg-sky-500 hover:bg-sky-600"
            >
              I Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
