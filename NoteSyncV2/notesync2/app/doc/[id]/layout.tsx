/*
import { auth } from '@clerk/nextjs/server'
import React from 'react'

function DocLayout({children}: {children: React.ReactNode}) {
    auth().protect();
  return <div>{children}</div>;
}

export default DocLayout
*/


/*
export default function DocLayout({ 
    children,
    params: {id},
    }: {
        children: React.ReactNode;
        params: {id: string};
    }) {
  return (
    <>
      <SignedIn>
        <div>{children}</div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn /> 
      </SignedOut>
    </>
  );
}
*/

//----------------------------------------------------------------------------------



/*
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import RoomProvider from "@/components/RoomProvider";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise <{ id: string }>;
}) {

  const { id } = await params;

  return (
    <> <>
      <SignedIn>
        <RoomProvider roomId={id}>{children}</RoomProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </><ClerkProvider>
        <html lang="en">
          <body >
            <Header />

            <div className="flex min-h-screen">
              <Sidebar />

              <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide ">{children}</div>
            </div>

            <Toaster position="top-center" />
          </body>
        </html>
      </ClerkProvider></>
  );
}

*/

//----------------------------------------------------------------------------------



import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import RoomProvider from "@/components/RoomProvider";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <SignedIn>
        <RoomProvider roomId={id}>
          <Header />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
              {children}
            </div>
          </div>
          <Toaster position="top-center" />
        </RoomProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}