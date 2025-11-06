"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { useEffect } from "react";

import React from 'react'

function LiveBlocksProvider({children}: {
    children: React.ReactNode
}) {
    if(!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
        throw new Error("NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY is not set.");
    }

  return <LiveblocksProvider throttle={16} authEndpoint={"/auth-endpoint"} //need to create auth-endpoint
  >{children}</LiveblocksProvider>;
}

export default LiveBlocksProvider