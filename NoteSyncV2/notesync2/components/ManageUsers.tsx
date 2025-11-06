'use client';
import React, { FormEvent, useState, useTransition } from 'react'
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
import { inviteUserToDocument, removeUserFromDocument } from '@/actions/actions';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import useOwner from '@/lib/useOwner';
import { useRoom } from '@liveblocks/react/suspense';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collectionGroup, query, where } from 'firebase/firestore';
import { db } from '@/firebase';


function ManageUsers() {
    const { user } = useUser();
    const room = useRoom()
    const isOwner = useOwner();
    const [ isOpen , setIsOpen ] = useState(false);
    const [ isPending, startTransition ] = useTransition();   

    const [usersInRoom] = useCollection(
        user && query (collectionGroup(db, "rooms"), where("roomId", "==", room.id))
    );

    const handleDelete = (userId: string) => {
        startTransition(async () => {
            if(!user) return;

            const result = await removeUserFromDocument(room.id, userId);
            //console.log("API Response: ", result);
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
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger> 
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
            {/* UsersInRoom */}
            {usersInRoom?.docs.map((doc) => (
                <div key={doc.data().userId}
                className='flex items-center justify-between gap-2'>
                    <p className='font-light'>
                        {/* display all users who have access to document */}
                        {doc.data().userId === user?.emailAddresses[0].toString() 
                        ? `You (${doc.data().userId})`
                        : doc.data().userId}
                    </p>

                    <div className='flex items-center gap-2 '>
                        <Button variant="outline">{doc.data().role}</Button>

                        {isOwner &&
                            doc.data().userId !== user?.emailAddresses[0].toString() && (
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(doc.data().userId)}
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