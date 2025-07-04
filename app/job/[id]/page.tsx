import React from "react";
import jobLists from "../../../public/job_listings.json";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = jobLists.find((job) => String(job.id) === String(id));

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-[calc(100dvh-16px-52px)] text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-gray-600">
          The job you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-16px-52px)] flex items-center justify-center">
      <Card className="max-w-3xl max-md:shadow-none max-md:rounded-none max-md:border-0">
        <CardContent>
          <div className="mb-6 border-b pb-4">
            <Button asChild variant="outline" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800">{job.type}</Badge>
              <Badge className="bg-green-100 text-green-800">
                {job.workArrangement}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
              <span>🗓️ {job.posted_date}</span>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="text-gray-800 mb-4">{job.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Company</h2>
            <div className="mb-2 font-bold">{job.company.name}</div>
            <div className="mb-2 text-gray-700">{job.company.description}</div>
            <div className="text-sm text-gray-600">
              <div>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href={`mailto:${job.company.contactEmail}`}
                  className="text-blue-600 underline"
                >
                  {job.company.contactEmail}
                </a>
              </div>
              <div>
                <span className="font-medium">Phone:</span>{" "}
                <a
                  href={`tel:${job.company.contactPhone}`}
                  className="text-blue-600 underline"
                >
                  {job.company.contactPhone}
                </a>
              </div>
            </div>
          </section>

          <div className="flex gap-4 mt-6">
            <Button size="lg" className="w-1/2">
              Apply Now
            </Button>
            <Button variant="outline" size="lg" className="w-1/2">
              Save Job
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
