'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";


function Header () {
    const { user } = useUser();


    return (
    <div className="flex items-center justify-between p-5">
        {user && (
            <h1 className="text-2xl">
                {user?.firstName}{`'s`} Space
            </h1>
        )}

        

        {/* Breadcrumbs , it shows where we are? like home -> document -> to do list, like it displays on page*/}
        <Breadcrumbs />
        <div className="flex items-center gap-3">
            {/* 
            <SignedOut>
                <SignInButton />   UPDATE- maybe remove this 
            </SignedOut>
            */}

            <SignedIn>
                <UserButton /> 
            </SignedIn>
            
        </div>
    </div>  
    );
}

export default Header