"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/utils/supabase/client";
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect('/login');
      }

      console.log(user);

      setUser(user);
    };
    fetchUser();
  }, [])

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

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    router.push(`/candidate/${candidate_id}/`);
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
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          router.push(`/candidate/${candidate_id}/`);
        }, 3000);
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
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-xl transform transition-all max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Success!</h3>
                <p className="text-sm text-gray-500 mb-4">Your profile has been saved successfully.</p>
                <button
                  onClick={handleCloseConfirmation}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <Link href={`/candidate/${candidate_id}/interview`}>
          <Button variant="outline">Continue to Interview</Button>
        </Link>
      </CardFooter> */}
    </Card>
  );
}
