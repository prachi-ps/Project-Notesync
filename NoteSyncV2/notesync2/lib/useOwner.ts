
import { db } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react/suspense';
import { collectionGroup, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';

function useOwner() {
  const { user } = useUser();
  const room = useRoom();
  const [ isOwner, setIsOwner ] = useState(false);
  const [ usersInRoom ] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  useEffect(() => {
    if(usersInRoom?.docs && usersInRoom.docs.length > 0){
        //filter to get owners of the room
        const owners = usersInRoom.docs.filter(
            (doc) => doc.data().role === "owner"
        );

        if(
            owners.some(
                (owner) => owner.data().userId === user?.emailAddresses[0].toString()
            )
        ) {
            setIsOwner(true);
        }
    }

  },[usersInRoom, user]);

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