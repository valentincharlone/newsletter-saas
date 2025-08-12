"use client";

import { Card, CardBody } from "@heroui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody className="p-8">
            <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
            <p className="text-gray-600 ">
              Welcome, <span className="font-semibold">{user.email}</span>
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
