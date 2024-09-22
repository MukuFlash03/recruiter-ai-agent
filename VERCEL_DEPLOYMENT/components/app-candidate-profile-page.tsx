"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [linkedIn, setLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("file", file);
    formData.append("linkedIn", linkedIn);
    formData.append("github", github);
    formData.append("portfolio", portfolio);

    try {
      const response = await fetch("/api/save-candidate-profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/candidate/123/interview");
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Profile</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="test123@abc.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            type="text"
            placeholder="1234567890"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
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
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            type="url"
            placeholder="https://www.github/user.com"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <Input
            id="portfolio"
            type="url"
            placeholder="https://www.yourportfolio.com"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <Button type="submit">Next: Video Interview</Button>
        </div>
      </form>
    </div>
  );
}
