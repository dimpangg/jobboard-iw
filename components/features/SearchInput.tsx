"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Input } from "../ui/input";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spSearch = searchParams.get("q") || "";
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    setSearch(spSearch);
  }, [spSearch]);

  return (
    <>
      <div className="relative">
        <Input
          value={search}
          type="text"
          placeholder="Search by job title or company"
          className="w-full pr-10"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const queryParams = new URLSearchParams();
              const spWithoutSearch = searchParams.entries();
              for (const [key, value] of spWithoutSearch) {
                if (key === "q") continue; // Skip the search query
                if (value) {
                  queryParams.append(key, String(value));
                }
              }
              if (search) {
                queryParams.append("q", search);
              } else {
                queryParams.delete("q");
              }
              const queryString = queryParams.toString();
              router.replace(`/?${queryString}`, {
                scroll: false,
              });
            }
          }}
        />
        <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-4" />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Press <span className="font-semibold">Enter</span> to search
      </div>
    </>
  );
};

export default SearchInput;
