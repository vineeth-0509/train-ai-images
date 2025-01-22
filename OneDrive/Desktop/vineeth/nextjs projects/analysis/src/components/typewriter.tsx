"use client";

import Link from "next/link";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { Button } from "./ui/button";

export function TypewriterEffectDemo() {
  const words = [
    {
      text: "Analyze",
    },
    {
      text: "summarize",
    },
    {
      text: "optimize",
    },
    {
      text: "collaborate",
    },
    {
      text: "with Analysis..",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex h-[40rem] flex-col items-center justify-center">
      <p className="mb-10 text-base text-neutral-600 dark:text-neutral-200">
        Empower your projects with AI-driven insights
      </p>
      <TypewriterEffect words={words} />
      <div className="mt-10 flex flex-col space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Button asChild>
          <Link href="/dashboard"> Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
