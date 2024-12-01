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
import { toast } from "react-toastify";
import { login } from "@/app/actions/auth";

export default function LoginPageComponent() {
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const res = await login(formData);
      if (res?.success) {
        toast.success("Login successful!");
        console.log(res);
        if (res.role === "staff") {
          router.push("/dashboard/my-account");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(res.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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

              <Button
                type="submit"
                className="w-full bg-sky-500 text-lg font-semibold hover:bg-sky-600"
                disabled={!agreed || isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
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
              Welcome to the Barangay Health Profiling System. By using this
              system, you agree to the following terms and conditions:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                The Barangay Health Profiling System is designed to collect,
                store, and manage health-related information of residents within
                the barangay.
              </li>
              <li>
                All users must maintain the confidentiality of their login
                credentials and are responsible for all activities that occur
                under their account.
              </li>
              <li>
                The health information collected through this system will be
                used solely for the purpose of improving health services and
                interventions within the barangay.
              </li>
              <li>
                Users agree to input accurate and up-to-date information to the
                best of their knowledge.
              </li>
              <li>
                The system administrators will take reasonable measures to
                protect the privacy and security of the health information
                stored in the system.
              </li>
              <li>
                Access to the system and its data is restricted to authorized
                personnel only, such as barangay health workers, medical
                professionals, and designated government officials.
              </li>
              <li>
                Users are prohibited from sharing, distributing, or using the
                health information for any purpose other than official barangay
                health initiatives.
              </li>
              <li>
                The barangay reserves the right to modify, suspend, or terminate
                access to the system at any time without prior notice.
              </li>
              <li>
                Users acknowledge that the system may undergo periodic updates
                and maintenance, which may result in temporary unavailability.
              </li>
              <li>
                By using this system, users consent to the collection and use of
                their health information for the purposes stated above, in
                compliance with relevant data privacy laws and regulations.
              </li>
            </ol>
            <p>
              By clicking &apos;I Agree,&apos; you acknowledge that you have
              read, understood, and agree to abide by these terms and
              conditions.
            </p>
          </div>
          <DialogFooter className="flex justify-between">
            <Button onClick={() => setShowTerms(false)} variant="outline">
              Close
            </Button>
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
