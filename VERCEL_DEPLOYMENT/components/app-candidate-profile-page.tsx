"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import { useState } from "react";

export function CandidateProfileForm({ candidate_id }: { candidate_id: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [fileResume, setFileResume] = useState<File | null>(null);
  const [fileLiProfile, setFileLiProfile] = useState<File | null>(null);
  const [linkedIn, setLinkedIn] = useState("");
  const [location, setLocation] = useState("");
  const [workPreference, setWorkPreference] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleFileResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFileResume(uploadedFile);
    }
  };

  const handleFileLiProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFileLiProfile(uploadedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!fileResume) {
      alert("Please upload a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("fileResume", fileResume);
    formData.append("fileLiProfile", fileLiProfile);
    formData.append("linkedIn", linkedIn);
    formData.append("location", location);
    formData.append("workPreference", workPreference);
    formData.append("salaryExpectation", salaryExpectation);
    formData.append("additionalInfo", additionalInfo);

    try {
      const response = await fetch("/api/update-candidate-profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Profile saved successfully");

      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Candidate Profile</CardTitle>
        <CardDescription>Please fill out the following information to complete your candidate profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="test123@abc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              type="text"
              placeholder="1234567890"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume</Label>
            <Input id="resume" type="file" onChange={handleFileResumeUpload} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="liprofile">LinkedIn Profile</Label>
            <Input id="liprofile" type="file" onChange={handleFileLiProfileUpload} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://www.linkedin.com/in/yourprofile"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="work-preference">Preferred Work Environment</Label>
            <Select onValueChange={(value) => setWorkPreference(value)}>
              <SelectTrigger id="work-preference">
                <SelectValue placeholder="Select your preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="office">In-office</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary-expectation">Salary Expectation (Annual)</Label>
            <Input
              id="salary-expectation"
              type="text"
              placeholder="Enter amount in USD"
              value={salaryExpectation}
              onChange={(e) => setSalaryExpectation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea
              id="additional-info"
              placeholder="Tell us more about yourself and your career goals"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button type="submit">Save Profile</Button> */}
        <Link href={`/candidate/${candidate_id}/interview`}>
          <Button variant="outline">Continue to Interview</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
