"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Page() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Profile</h1>
      <div className="flex justify-between">
        <Link href="/candidate/123/profile">
          <Button>Set up Profile</Button>
        </Link>
      </div>
    </div>
  );
}
