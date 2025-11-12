"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Newsletters
            </div>
            <h1 className="text-4xl font-bold text-foreground text-balance">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isSignUp
                ? "Start receiving personalized AI newsletters"
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}
            {message && (
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-accent font-medium">{message}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  classNames={{
                    input: "pl-11",
                    inputWrapper: "h-12 bg-card border border-border",
                  }}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                  classNames={{
                    input: "pl-11",
                    inputWrapper: "h-12 bg-card border border-border",
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
              isLoading={isLoading}
              isDisabled={isLoading}
              endContent={!isLoading && <ArrowRight className="w-5 h-5" />}
            >
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          {/* Toggle sign up/sign in */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <span className="text-primary font-semibold">Sign in</span>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <span className="text-primary font-semibold">Sign up</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-card border-l border-border items-center justify-center p-12">
        <div className="max-w-lg space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>
            <h2 className="text-4xl font-bold text-foreground text-balance">
              Your personalized AI newsletter, delivered daily
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get curated content tailored to your interests. Our AI analyzes
              thousands of sources to bring you the most relevant news and
              insights.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4 pt-4">
            {[
              {
                title: "AI-Powered Curation",
                description: "Smart algorithms learn your preferences",
              },
              {
                title: "Daily Digest",
                description: "Receive updates at your preferred time",
              },
              {
                title: "Multi-Source Analysis",
                description: "Content from trusted sources worldwide",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
