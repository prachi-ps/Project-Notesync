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

const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

export const Navbar = () => {
    const scrolled = useScrollTop();
    
    return (
        <nav className={cn(
            "z-50 fixed top-0 left-0 right-0 transition-all duration-300",
            "bg-gray-200/80 backdrop-blur-2x1 backdrop-saturate-150",
            scrolled ? "bg-gray-200/90 shadow-sm border-b border-gray-300/50" : "bg-gray-200/80"
        )}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Logo />
                
                {/* Navigation Links - Apple Style */}
                <div className="hidden md:flex items-center gap-16">
                    <button
                        onClick={() => scrollToSection('preview')}
                        className="text-base text-black hover:text-black transition-colors duration-200 font-medium"
                    >
                        Preview
                    </button>
                    <button
                        onClick={() => scrollToSection('about')}
                        className="text-base text-black hover:text-black transition-colors duration-200 font-medium"
                    >
                        About Us
                    </button>
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="text-base text-black hover:text-black transition-colors duration-200 font-medium"
                    >
                        Contact
                    </button>
                </div>
                
                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <ClerkProvider>
                        <AuthContent />
                    </ClerkProvider>
                </div>
            </div>
        </nav>
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
                <SignInButton mode="modal" fallbackRedirectUrl="/doc">
                    <Button 
                        size="sm" 
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-200"
                    >
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="text-sm font-medium text-black hover:text-black transition-colors duration-200"
                >
                    <Link href="/doc">
                        Enter NoteSync
                    </Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </>
    );
}