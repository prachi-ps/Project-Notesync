'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { UserAvatars } from "./user-avatars";

export const Heading = () => {
    return(
        <div className="max-w-5xl space-y-6 w-full">
            <UserAvatars />
            
            <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                    One workspace.
                    <span className="block mt-2">Zero busywork.</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    NoteSync is where your teams capture knowledge, find answers, and automate projects. 
                    <span className="block mt-2">Now a team of 7 feels like 70.</span>
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <SignedOut>
                    <SignInButton mode="modal" redirectUrl="/doc">
                        <Button size="lg" className="text-base px-8 py-6">
                            Get NoteSync free
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Button size="lg" className="text-base px-8 py-6" asChild>
                        <Link href="/doc">
                            Enter NoteSync
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </SignedIn>
                <Button size="lg" variant="outline" className="text-base px-8 py-6">
                    Request a demo
                </Button>
            </div>
        </div>
    )
}