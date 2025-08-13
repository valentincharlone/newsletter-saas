"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { RadioGroup, Radio } from "@heroui/radio";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  {
    id: "technology",
    name: "Technology",
    description: "Latest tech news and innovations",
  },
  {
    id: "business",
    name: "Business",
    description: "Business trends and market updates",
  },
  { id: "sports", name: "Sports", description: "Sports news and highlights" },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Movies, TV, and celebrity news",
  },
  {
    id: "science",
    name: "Science",
    description: "Scientific discoveries and research",
  },
  { id: "health", name: "Health", description: "Health and wellness updates" },
  {
    id: "politics",
    name: "Politics",
    description: "Political news and current events",
  },
  {
    id: "environment",
    name: "Environment",
    description: "Climate and environmental news",
  },
];

const frequencyOptions = [
  { id: "daily", name: "Daily", description: "Every day" },
  { id: "weekly", name: "Weekly", description: "Once a week" },
  { id: "biweekly", name: "Bi-weekly", description: "Twice a week" },
];

export default function SelectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("weekly");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setError("Please select at least one category");
      return;
    }

    if (!user) {
      setError("Please sign in to continue");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selectedCategories,
          frequency: selectedFrequency,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Customize Your Newsletter</h1>
          <p className="text-gray-600">
            Select your interests and delivery frequency
          </p>
        </div>

        <Card>
          <CardBody className="p-6">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✓ Your newsletter preferences have been saved! You'll start
                  receiving newsletters according to your schedule.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Choose Categories
                </h2>
                <CheckboxGroup
                  value={selectedCategories}
                  onValueChange={setSelectedCategories}
                  className="gap-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        value={category.id}
                        className="max-w-full"
                      >
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">
                            {category.description}
                          </div>
                        </div>
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>
                <p className="text-sm text-gray-500 mt-3">
                  {selectedCategories.length} categor
                  {selectedCategories.length !== 1 ? "ies" : "y"} selected
                </p>
              </div>

              <Divider />

              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Delivery Frequency
                </h2>
                <RadioGroup
                  value={selectedFrequency}
                  onValueChange={setSelectedFrequency}
                  className="gap-3"
                >
                  {frequencyOptions.map((frequency) => (
                    <Radio key={frequency.id} value={frequency.id}>
                      <div>
                        <div className="font-medium">{frequency.name}</div>
                        <div className="text-sm text-gray-500">
                          {frequency.description}
                        </div>
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {selectedCategories.length} categor
                  {selectedCategories.length !== 1 ? "ies" : "y"} selected •{" "}
                  {selectedFrequency} delivery
                </div>
                <Button
                  type="submit"
                  color="primary"
                  isDisabled={selectedCategories.length === 0 || success}
                  isLoading={isSaving}
                >
                  {success ? "Saved!" : "Save Preferences"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
