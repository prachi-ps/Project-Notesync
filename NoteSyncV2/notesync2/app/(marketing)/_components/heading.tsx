'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {
    return(
        <div className="max-w-3xl space-y-4"> {/* max-w-3xl - how wide heading/header will be */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">Your Ideas, Documents, & Plans. Unified. Welcome to <span className="underline">NoteSync.</span></h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">NoteSync is the connected workspace where <br />
            better, faster work happens.</h3>
            <Button>
                <Link href="/doc">
                Enter NoteSync
                </Link>
                <ArrowRight className="" /> {/* classname="h-4 w-4 ml-2" */}
            </Button>
        </div>
    )
}