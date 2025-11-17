'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export const Heading = () => {
    return(
        <div className="max-w-7xl w-full">
            {/* Video Background */}
            <div className="w-full max-w-4xl mx-auto mb-0 rounded-lg overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-auto rounded-lg shadow-lg"
                >
                    <source src="/homepage-hero-animation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mt-8">
                {/* Left Side - Illustration with decorative elements */}
                <div className="relative flex-1 w-full lg:w-auto flex items-center justify-center">
                    <div className="relative w-full max-w-md lg:max-w-lg">
                        {/* Decorative background shape */}
                        <div className="absolute inset-0 bg-gray-100 rounded-[40px] -z-10 transform rotate-3" />
                        
                        {/* Main illustration */}
                        <div className="relative z-10">
                            <div className="relative w-full aspect-square">
                                <Image 
                                    src="/heading_image.png"
                                    fill
                                    className="object-contain"
                                    alt="NoteSync workspace"
                                />
                            </div>
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                        <div className="absolute top-8 left-8 w-2 h-2 bg-orange-500 rounded-full" />
                        <div className="absolute top-12 left-12 w-2.5 h-2.5 bg-blue-400 rounded-full" />
                        
                        {/* Orange starburst */}
                        <div className="absolute top-1/4 right-8 w-8 h-8 bg-orange-400 rounded-full blur-sm opacity-80" />
                        
                        {/* Planet with ring */}
                        <div className="absolute top-1/3 right-4">
                            <div className="w-6 h-6 bg-orange-300 rounded-full relative">
                                <div className="absolute inset-0 border-2 border-orange-400 rounded-full -rotate-12" />
                            </div>
                        </div>
                        
                        {/* Stars */}
                        <div className="absolute top-1/2 left-4 w-2 h-2 bg-white rounded-full" />
                        <div className="absolute bottom-1/4 right-12 w-1.5 h-1.5 bg-blue-300 rounded-full" />
                        <div className="absolute bottom-1/3 left-8 w-2 h-2 bg-white rounded-full" />
                        
                        {/* Circular line with dots */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                            <circle 
                                cx="200" 
                                cy="200" 
                                r="180" 
                                fill="none" 
                                stroke="#e5e7eb" 
                                strokeWidth="1"
                                strokeDasharray="4,4"
                            />
                            <circle cx="200" cy="20" r="3" fill="#ef4444" />
                            <circle cx="380" cy="200" r="3" fill="#ef4444" />
                            <circle cx="200" cy="380" r="3" fill="#ef4444" />
                            <circle cx="20" cy="200" r="3" fill="#ef4444" />
                        </svg>
                    </div>
                </div>
                
                {/* Right Side - Content */}
                <div className="flex-1 w-full lg:w-auto space-y-6 text-left">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black">
                            One workspace.
                            <span className="block mt-2">
                                <span className="px-3 py-1 rounded-md">Zero busywork.</span>
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-black">
                            A workspace based in New York, US.
                        </p>
                        <p className="text-sm sm:text-base text-black leading-relaxed max-w-lg">
                            NoteSync is where your teams capture knowledge, find answers, and automate projects. 
                            Solutions of design in modern era. Now a team of 7 feels like 70.
                        </p>
                    </div>
                    
                    {/* Email Input and Subscribe */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Input 
                            type="email" 
                            placeholder="Enter your email"
                            className="flex-1 bg-orange-50/50 border-orange-200 focus:border-orange-400"
                        />
                        <SignedOut>
                            <SignInButton mode="modal" fallbackRedirectUrl="/doc">
                                <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-6 rounded-md">
                                    SUBSCRIBE
                                </Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-6 rounded-md" asChild>
                                <Link href="/doc">
                                    SUBSCRIBE
                                </Link>
                            </Button>
                        </SignedIn>
                    </div>
                    
                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white p-0"
                        >
                            <Facebook className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white p-0"
                        >
                            <Instagram className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white p-0"
                        >
                            <Twitter className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}