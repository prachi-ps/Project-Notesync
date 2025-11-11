/*"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from 'sonner';

export const Navbar = () => {
    //const { user } = useUser();
    const scrolled = useScrollTop();
    return(
        <div className={cn(
            "z-50 bg-background fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm" 
        )}> 
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <ClerkProvider>
                    <>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>    
                                toast.success("User added to Room successfully!");
                            </SignInButton>  
                        </SignedOut>
                    </>
                    <SignedIn>
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/doc">
                                    Enter NoteSync
                                </Link>
                            </Button>
                            <UserButton
                                afterSignOutUrl="/"
                            />
                        </>
                    </SignedIn>
                </ClerkProvider>
            </div>
        </div>
    )
}

*/


"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const scrolled = useScrollTop();
    
    return (
        <div className={cn(
            "z-50 bg-background fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm" 
        )}> 
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <ClerkProvider>
                    <AuthContent />
                </ClerkProvider>
            </div>
        </div>
    );
}

// Inner component that has access to auth hooks
function AuthContent() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            toast.success("Logged in successfully!");
            // Redirect to /doc after successful login
            router.push("/doc");
        }
    }, [isSignedIn, router]);

    return (
        <>
            <SignedOut>
                <SignInButton mode="modal" redirectUrl="/doc">
                    <Button size="sm">
                        Log in
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/doc">
                        Enter NoteSync
                    </Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </>
    );
}