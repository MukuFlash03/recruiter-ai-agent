"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function Page() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log("File uploaded:", event.target.files?.[0]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Profile</h1>
      <form className="space-y-6">
        <div>
          <Label htmlFor="resume">Resume</Label>
          <Input id="resume" type="file" onChange={handleFileUpload} />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://www.linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <Input
            id="portfolio"
            type="url"
            placeholder="https://www.yourportfolio.com"
          />
        </div>
        <div>
          <Label htmlFor="bio">Short Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself..." />
        </div>
        <div className="flex justify-between">
          <Button type="submit">Save Profile</Button>
          <Link href="/candidate/interview">
            <Button>Next: Video Interview</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
