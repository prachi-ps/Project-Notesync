'use client';

import React, { useEffect, useState } from 'react'
import NewDocumentButton from './NewDocumentButton'
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { collection, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase';
import SidebarOption from './SidebarOption';


interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

function Sidebar() {
  const {user} = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
        editor: [],
  })

  // Get user email - Clerk stores it in emailAddresses[0].emailAddress
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  
  // Use direct collection query instead of collectionGroup to avoid index requirement
  // Path: users/{userEmail}/rooms - this is a direct collection, no index needed!
  // Note: Direct collection queries don't require indexes for basic queries
  const [data, loading, error] = useCollection(
    userEmail
      ? collection(db, 'users', userEmail, 'rooms')
      : null,
    {
      snapshotListenOptions: { includeMetadataChanges: false },
    }
  );

  // Log error but don't crash the app
  if (error) {
    console.error('Error loading rooms:', error);
  }

  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        
        // The document ID is the roomId (set when creating the room)
        // Use roomId from data if available, otherwise use document ID
        const roomId = roomData.roomId || curr.id;

        if(roomData.role === "owner") {
          acc.owner.push({
            id: roomId, // Use roomId for navigation
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: roomId, // Use roomId for navigation
            ...roomData,
          });
        }

        return acc;
      }, {
        owner: [],
        editor: [],
      }
    );

    // Sort by createdAt in descending order (most recent first)
    // Handle both Firestore Timestamp and Date objects
    const getTimestamp = (date: any): number => {
      if (!date) return 0;
      // Firestore Timestamp
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().getTime();
      }
      // JavaScript Date
      if (date instanceof Date) {
        return date.getTime();
      }
      // Number (already a timestamp)
      if (typeof date === 'number') {
        return date;
      }
      return 0;
    };

    grouped.owner.sort((a, b) => {
      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
    });
    
    grouped.editor.sort((a, b) => {
      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
    });

    setGroupedData(grouped);
  }, [data])

  const menuOptions = (
    <>
      <NewDocumentButton />

      <div className="flex py-4 flex-col space-y-4 md:max-w-36 md:flex-1">
  {/* My Documents */}
  {groupedData.owner.length === 0 ? (
    <h2 className="text-gray-500 font-semibold text-sm">
      No Documents Found
    </h2>
  ) : (
    <>
      <h2 className="text-gray-500 font-semibold text-sm">
        My Documents
      </h2>

      {groupedData.owner.map((doc) => (
        //<div key={doc.id}>
          //<p>{doc.roomId}</p>
          
            <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />     
        //</div>
      ))}
    </>
  )}


      {/*List...*/}


  {/*Docs which are Share with me*/}
  {groupedData.editor.length > 0 && (
    <>
      <h2 className="text-gray-500 font-semibold text-sm">
        Shared with me
      </h2>
      {groupedData.editor.map((doc) => (
        <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />     
      ))}
      
    </>
  )}
</div>

      {/*List...*/}
    </>
  );

  return (
    <aside className="p-2 md:p-5 bg-gray-200 relative h-full md:h-screen md:max-h-screen md:w-72 md:flex md:flex-col">
      <div className="md:hidden">
      <Sheet>
        <SheetTrigger>
          <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40}/>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col items-center space-y-6 pt-6 overflow-y-auto">
          <SheetHeader className="text-center">
            <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
            <div className="flex flex-col items-center space-y-3">
              {menuOptions}
            </div>
            
          </SheetHeader>
        </SheetContent>
      </Sheet>
      </div>

      <div className="hidden md:flex md:flex-1 md:flex-col md:space-y-6 md:overflow-y-auto md:pr-2">
        {menuOptions}
      </div>
    </aside>
  )
}

export default Sidebar