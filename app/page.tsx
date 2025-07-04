import SearchInput from "@/components/features/SearchInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileX2, MapPin } from "lucide-react";
import Link from "next/link";
import * as z from "zod/v4";
import jobLists from "../public/job_listings.json";

export default async function Home({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const sp = await searchParams;
  const queryLink = (
    key: string,
    value: string,
    currentValue: string | undefined
  ) => {
    if (!currentValue) return { ...sp, [key]: value };
    const currentValues = currentValue.split(",");
    const newValue = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value).join(",")
      : [...currentValues, value].join(",");
    return {
      ...sp,
      [key]: newValue,
    };
  };

  const spSearch = z
    .string()
    .catch(() => "")
    .parse(sp.q);

  const spJobType = z
    .string()
    .optional()
    .catch(() => undefined)
    .parse(sp.type);
  const jobTypes = jobLists.reduce((acc, job) => {
    if (!acc.includes(job.type)) {
      acc.push(job.type);
    }
    return acc;
  }, [] as string[]);

  const spWorkArrangement = z
    .string()
    .optional()
    .catch(() => undefined)
    .parse(sp.wArr);
  const workArrangements = jobLists.reduce((acc, job) => {
    if (!acc.includes(job.workArrangement)) {
      acc.push(job.workArrangement);
    }
    return acc;
  }, [] as string[]);

  const spLocation = z
    .string()
    .optional()
    .catch(() => undefined)
    .parse(sp.loc);
  const locations = jobLists.reduce((acc, job) => {
    if (!acc.includes(job.location)) {
      acc.push(job.location);
    }
    return acc;
  }, [] as string[]);

  const filteredJobs = jobLists.filter((job) => {
    const matchesSearch =
      !spSearch ||
      job.title.toLowerCase().includes(spSearch.toLowerCase()) ||
      job.company.name.toLowerCase().includes(spSearch.toLowerCase());

    const jobTypeIdx = spJobType ? spJobType.split(",").map(Number) : [];
    const matchesJobType =
      jobTypeIdx.length === 0 ||
      jobTypeIdx.includes(jobTypes.indexOf(job.type));

    const workArrangementIdx = spWorkArrangement
      ? spWorkArrangement.split(",").map(Number)
      : [];
    const matchesWorkArrangement =
      workArrangementIdx.length === 0 ||
      workArrangementIdx.includes(
        workArrangements.indexOf(job.workArrangement)
      );

    const locationIdx = spLocation ? spLocation.split(",").map(Number) : [];
    const matchesLocation =
      locationIdx.length === 0 ||
      locationIdx.includes(locations.indexOf(job.location));

    return (
      matchesSearch &&
      matchesJobType &&
      matchesWorkArrangement &&
      matchesLocation
    );
  });

  return (
    <div className="container mx-auto px-2 md:px-0">
      <header>
        <h1 className="text-4xl font-bold text-center mt-10">
          Welcome to the Job Board
        </h1>
        <p className="text-center mt-4 text-lg">
          Find your dream job or post a job opening!
        </p>
      </header>

      <main className="flex flex-col md:flex-row pt-10 gap-4">
        <Card className="h-fit md:w-1/4 xl:w-1/5 flex-none md:sticky md:top-4">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Use the filters to narrow down your job search.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100vh-16px-16px-24px-24px-62px-24px-36px-24px)] overflow-y-auto">
            <Separator className="mb-4" />
            <div className="mb-4">
              <SearchInput />
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Job Type</h3>
              <div className="flex flex-col gap-2">
                {jobTypes.map((type, idx) => (
                  <Link
                    href={{
                      query: queryLink("type", String(idx), spJobType),
                    }}
                    key={type}
                    className="flex items-center"
                    replace
                    scroll={false}
                  >
                    <Checkbox
                      id={type}
                      checked={
                        spJobType ? spJobType.includes(idx.toString()) : false
                      }
                    />
                    <Label htmlFor={type} className="ml-2">
                      {type}
                    </Label>
                  </Link>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Work Arrangement</h3>
              <div className="flex flex-col gap-2">
                {workArrangements.map((arrangement, idx) => (
                  <Link
                    href={{
                      query: queryLink("wArr", String(idx), spWorkArrangement),
                    }}
                    key={arrangement}
                    className="flex items-center"
                    replace
                    scroll={false}
                  >
                    <Checkbox
                      id={arrangement}
                      checked={
                        spWorkArrangement
                          ? spWorkArrangement.includes(idx.toString())
                          : false
                      }
                    />
                    <Label htmlFor={arrangement} className="ml-2">
                      {arrangement}
                    </Label>
                  </Link>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Location</h3>
              <div className="flex flex-col gap-2">
                {locations.map((locs, idx) => (
                  <Link
                    href={{
                      query: queryLink("loc", String(idx), spLocation),
                    }}
                    key={locs}
                    className="flex items-center"
                    replace
                    scroll={false}
                  >
                    <Checkbox
                      id={locs}
                      checked={
                        spLocation ? spLocation.includes(idx.toString()) : false
                      }
                    />
                    <Label htmlFor={locs} className="ml-2">
                      {locs}
                    </Label>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="">
            <Button asChild className="w-full">
              <Link href="/" replace scroll={false}>
                Clear Filters
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
          {!filteredJobs.length && (
            <div className="lg:col-span-3 text-center w-full flex flex-col items-center justify-center h-full">
              <FileX2 className="size-16 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Jobs Found</h2>
              <p className="text-lg text-gray-500">
                No jobs found matching your criteria.
              </p>
            </div>
          )}
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              href={`/job/${job.id}`}
              className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 focus-visible:outline-none"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company.name}</CardDescription>
                  <CardAction className="text-sm text-gray-500">
                    {job.salary ? job.salary : "Salary not disclosed"}
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p>{job.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-start">
                  <div className="inline-flex gap-1 flex-wrap">
                    <Badge>
                      <MapPin /> {job.location}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {job.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      {job.workArrangement}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Posted on: {job.posted_date}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
