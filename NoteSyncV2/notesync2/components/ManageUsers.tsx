'use client';
import React, { FormEvent, useState, useTransition, useEffect } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';  
import { inviteUserToDocument, removeUserFromDocument, getUsersInRoom } from '@/actions/actions';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import useOwner from '@/lib/useOwner';
import { useRoom } from '@liveblocks/react/suspense';

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
    const [usersInRoom, setUsersInRoom] = useState<RoomUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Fetch users when dialog opens or room changes
    useEffect(() => {
      if (room?.id && isOpen) {
        setLoading(true);
        setError(null);
        getUsersInRoom(room.id)
          .then((result) => {
            if (result.success) {
              setUsersInRoom(result.users);
            } else {
              setError(new Error('Failed to load users'));
            }
          })
          .catch((err) => {
            console.error('Error loading users in room:', err);
            setError(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [room?.id, isOpen]);

    const handleDelete = (userId: string) => {
        startTransition(async () => {
            if(!user) return;

            const result = await removeUserFromDocument(room.id, userId);
            if(result?.success){
                toast.success("User removed from room successfully!");
                // Refresh the users list
                const refreshResult = await getUsersInRoom(room.id);
                if (refreshResult.success) {
                  setUsersInRoom(refreshResult.users);
                }
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
            {loading && <p className='text-sm text-gray-500'>Loading users...</p>}
            {error && (
              <p className='text-sm text-red-500'>
                Error loading users. Please try again.
              </p>
            )}
            {!loading && !error && usersInRoom.length === 0 && (
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