
import { db } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react/suspense';
import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore';

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [ isOwner, setIsOwner ] = useState(false);
  
  // Get user email - Clerk stores it in emailAddresses[0].emailAddress
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  
  // Use direct document path instead of collectionGroup query to avoid index requirement
  // Path: users/{userEmail}/rooms/{roomId}
  const [roomDoc, loading, error] = useDocumentData(
    userEmail && room?.id
      ? doc(db, "users", userEmail, "rooms", room.id)
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: false },
    }
  );

  // Handle errors gracefully
  if (error) {
    console.error('Error loading room document:', error);
  }

  useEffect(() => {
    if (roomDoc) {
      // Check if the user is the owner of this room
      setIsOwner(roomDoc.role === "owner" && roomDoc.userId === userEmail);
    } else if (!loading && userEmail && room?.id) {
      // If document doesn't exist and we're not loading, user is not an owner
      setIsOwner(false);
    }
  }, [roomDoc, loading, userEmail, room?.id]);

  return isOwner;
}

export default useOwner






/*

// lib/useOwner.ts
import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react/suspense';

// Simple version that checks ownership synchronously
function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  
  console.log("🔄 useOwner running");
  console.log("User:", user?.emailAddresses[0]?.emailAddress);
  console.log("Room:", room?.id);

  // For now, let's return true if we have both user and room
  // This is a temporary fix until we figure out why effects aren't running
  const hasUserAndRoom = user && room?.id;
  
  console.log("✅ Temporary: returning", hasUserAndRoom);
  return hasUserAndRoom; // This will be true when user is logged in and has a room
}

export default useOwner;

*/