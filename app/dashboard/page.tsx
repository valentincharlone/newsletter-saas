"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";

interface UserPreferences {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/user-preferences")
      .then((response) => {
        if (response && response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setPreferences(data);
        }
      })
      .catch(() => {
        router.replace("/select");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleUpdatePreferences = () => {
    router.push("/select");
  };

  const handleDeactivateNewsletter = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: false }),
      });

      if (response.ok) {
        setPreferences((prev) => (prev ? { ...prev, is_active: false } : null));
        setMessage({ type: "success", text: "Newsletter paused successfully" });
      }
    } catch (error) {
      console.error("Error deactivating newsletter:", error);
      setMessage({ type: "error", text: "Failed to pause newsletter" });
    }
  };

  const handleActivateNewsletter = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: true }),
      });

      if (response.ok) {
        setPreferences((prev) => (prev ? { ...prev, is_active: true } : null));
        setMessage({
          type: "success",
          text: "Newsletter resumed successfully",
        });
      }
    } catch (error) {
      console.error("Error activating newsletter:", error);
      setMessage({ type: "error", text: "Failed to resume newsletter" });
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Newsletter Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your personalized newsletter preferences
          </p>
        </div>

        {message && (
          <Card
            className={
              message.type === "error"
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50"
            }
          >
            <CardBody className="p-4">
              <p
                className={
                  message.type === "error" ? "text-red-600" : "text-green-600"
                }
              >
                {message.text}
              </p>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Preferences */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Current Preferences</h2>
            </CardHeader>
            <CardBody>
              {preferences ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {preferences.categories.map((category) => (
                        <Chip key={category} color="primary" variant="flat">
                          {category}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Frequency
                    </h3>
                    <p className="text-gray-600 capitalize">
                      {preferences.frequency}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">{preferences.email}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                    <Chip
                      color={preferences.is_active ? "success" : "danger"}
                      variant="flat"
                    >
                      {preferences.is_active ? "Active" : "Inactive"}
                    </Chip>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Created</h3>
                    <p className="text-gray-600">
                      {new Date(preferences.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No preferences set yet</p>
                  <Button as={Link} href="/select" color="primary">
                    Set Up Newsletter
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Button
                  onClick={handleUpdatePreferences}
                  color="primary"
                  className="w-full"
                >
                  Update Preferences
                </Button>

                {preferences && (
                  <>
                    {preferences.is_active ? (
                      <Button
                        onClick={handleDeactivateNewsletter}
                        color="danger"
                        variant="flat"
                        className="w-full"
                      >
                        Pause Newsletter
                      </Button>
                    ) : (
                      <Button
                        onClick={handleActivateNewsletter}
                        color="success"
                        variant="flat"
                        className="w-full"
                      >
                        Resume Newsletter
                      </Button>
                    )}
                  </>
                )}

                <Button
                  as={Link}
                  href="/select"
                  variant="bordered"
                  className="w-full"
                >
                  Manage Subscription
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Information */}
        <Card>
          <CardBody>
            <h3 className="font-medium text-gray-900 mb-4">How it works</h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                • Your newsletter is automatically generated based on your
                selected categories
              </li>
              <li>
                • Newsletters are delivered to your email at 9 AM according to
                your chosen frequency
              </li>
              <li>• You can pause or resume your newsletter at any time</li>
              <li>
                • Update your preferences anytime to change categories or
                frequency
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
