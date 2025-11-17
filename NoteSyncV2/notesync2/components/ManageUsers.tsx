'use client';
import React, { useMemo, useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { removeUserFromDocument } from '@/actions/actions';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import useOwner from '@/lib/useOwner';
import { useRoom } from '@liveblocks/react/suspense';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/firebase';

interface RoomUser {
  id: string;
  userId: string;
  role: "owner" | "editor";
  createdAt?: string;
  roomId: string;
}

function ManageUsers() {
    const { user } = useUser();
    const room = useRoom()
    const isOwner = useOwner();
    const [ isOpen , setIsOpen ] = useState(false);
    const [ isPending, startTransition ] = useTransition();
    const roomId = room?.id;

    const [membersSnapshot, membersLoading, membersError] = useCollection(
      roomId ? collection(db, "documents", roomId, "members") : null,
      {
        snapshotListenOptions: { includeMetadataChanges: false },
      }
    );

    const usersInRoom = useMemo<RoomUser[]>(() => {
      if (!membersSnapshot) {
        return [];
      }

      return membersSnapshot.docs
        .map((docSnapshot) => {
          const data = docSnapshot.data() as {
            email?: string;
            role?: "owner" | "editor";
            addedAt?: any;
          };

          let createdAt: string | undefined;
          const timestamp = data?.addedAt;

          if (timestamp) {
            if (timestamp.toDate && typeof timestamp.toDate === 'function') {
              createdAt = timestamp.toDate().toISOString();
            } else if (timestamp instanceof Date) {
              createdAt = timestamp.toISOString();
            } else if (typeof timestamp === 'string') {
              createdAt = timestamp;
            } else if (timestamp._seconds) {
              const date = new Date(
                timestamp._seconds * 1000 +
                  (timestamp._nanoseconds || 0) / 1000000
              );
              createdAt = date.toISOString();
            }
          }

          return {
            id: docSnapshot.id,
            userId: data?.email || docSnapshot.id,
            role: data?.role === "owner" ? "owner" : "editor",
            createdAt,
            roomId: roomId!,
          };
        })
        .sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
    }, [membersSnapshot, roomId]);

    const handleDelete = (userId: string) => {
        startTransition(async () => {
            if(!user || !roomId) return;

            const result = await removeUserFromDocument(roomId, userId);
            if(result?.success){
                toast.success("User removed from room successfully!");
            } else{
                toast.error("Failed to remove user from room.")
            }
        })
    };

  return (
    <Dialog open = {isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
        <DialogTrigger>Users ({usersInRoom.length})</DialogTrigger> 
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Users with Access</DialogTitle>
        <DialogDescription>
            Below is a list of users who have access to this document.
        </DialogDescription>
        </DialogHeader>
        <hr className='my-2' />

        {/*below div that maps through users in the room*/}
        <div className='flex flex-col space-y-2'>
            {membersLoading && <p className='text-sm text-gray-500'>Loading users...</p>}
            {membersError && (
              <p className='text-sm text-red-500'>
                Error loading users. Please try again.
              </p>
            )}
            {!membersLoading && !membersError && usersInRoom.length === 0 && (
              <p className='text-sm text-gray-500'>No users found in this room.</p>
            )}
            {/* UsersInRoom */}
            {usersInRoom.map((roomUser) => (
                <div key={roomUser.userId}
                className='flex items-center justify-between gap-2'>
                    <p className='font-light'>
                        {/* display all users who have access to document */}
                        {roomUser.userId === user?.emailAddresses[0]?.emailAddress 
                        ? `You (${roomUser.userId})`
                        : roomUser.userId}
                    </p>

                    <div className='flex items-center gap-2 '>
                        <Button variant="outline">{roomUser.role}</Button>

                        {isOwner &&
                            roomUser.userId !== user?.emailAddresses[0]?.emailAddress && (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(roomUser.userId)}
                                    disabled={isPending}
                                    size="sm"
                                >
                                    {isPending ? "Removing..." : "X"}
                                </Button>
                            )}
                    </div>
                </div>
            ))}
        </div>
    </DialogContent>
    </Dialog>
  )
}

export default ManageUsers