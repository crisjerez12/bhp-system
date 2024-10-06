"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const loginUser =
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-100">
      <div className="absolute inset-0">
        <Image
          src="/background.jpg"
          alt="Background"
          width={0}
          height={0}
          sizes="100vw"
          className=" blur-sm object-cover"
        />
      </div>
      <div className="w-full max-w-[500px] relative z-10 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Barangay Health Profiling
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Access your health profiling account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the
            </label>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium text-blue-600"
                >
                  terms and policies
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Terms and Policies</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <p>
                    Here you can include the detailed terms and policies
                    information.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
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
