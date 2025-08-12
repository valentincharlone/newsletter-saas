"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 ">
        <div className="text-center">
          <h1 className=" text-gray-900 mb-2 text-2xl">
            Personalized AI Newsletter
          </h1>
          <p className="text-xl text-gray-600">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg  shadow-md">
          <form onSubmit={handleAuth} className="space-y-4 ">
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            {message && (
              <div className="text-sm text-green-600 text-center">
                {message}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              size="sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />

            <Input
              type="password"
              label="Password"
              size="sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />

            <Button
              type="submit"
              color="secondary"
              className="w-full rounded-md"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4 ">
            <Link
              as="button"
              className="cursor-pointer"
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
            >
              {isSignUp ? "Already have an account?" : "Need an account?"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
