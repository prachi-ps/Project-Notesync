'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export const Heading = () => {
    return(
        <div className="max-w-4xl space-y-6"> {/* max-w-3xl - how wide heading/header will be */}
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    Your Ideas, Documents, & Plans. 
                    <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Unified. Welcome to NoteSync.
                    </span>
                </h1>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto">
                    NoteSync is the connected workspace where better, faster work happens.
                </h3>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <SignedOut>
                    <SignInButton mode="modal" redirectUrl="/doc">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Button size="lg" className="text-lg px-8 py-6" asChild>
                        <Link href="/doc">
                            Enter NoteSync
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </SignedIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card border">
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Lightning Fast</h4>
                    <p className="text-sm text-muted-foreground text-center">
                        Real-time collaboration with instant updates
                    </p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card border">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Team Collaboration</h4>
                    <p className="text-sm text-muted-foreground text-center">
                        Work together seamlessly with your team
                    </p>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card border">
                    <Sparkles className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold">Smart Features</h4>
                    <p className="text-sm text-muted-foreground text-center">
                        Powerful tools to boost your productivity
                    </p>
                </div>
            </div>
        </div>
    )
}