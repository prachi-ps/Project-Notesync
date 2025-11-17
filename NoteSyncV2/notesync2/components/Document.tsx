


"use client";

import React, { FormEvent, useEffect, useRef, useState, useTransition } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Document({id}: {id: string}) {
    const router = useRouter();
    const { user } = useUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const [data, loading, error] = useDocumentData(
      id ? doc(db, "documents", id) : null,
      {
        snapshotListenOptions: { includeMetadataChanges: false },
      }
    );
    const [membership, membershipLoading] = useDocumentData(
      userEmail && id ? doc(db, "users", userEmail, "rooms", id) : null,
      {
        snapshotListenOptions: { includeMetadataChanges: false },
      }
    );
    const[input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    const isOwner = useOwner();
    const hasHandledAccessRevocation = useRef(false);

    // Handle errors gracefully
    if (error) {
      console.error('Error loading document:', error);
    }

    useEffect(() => {
        if(data){
            setInput(data.title);
        }
    }, [data])

    useEffect(() => {
        if (
            hasHandledAccessRevocation.current ||
            membershipLoading ||
            !userEmail
        ) {
            return;
        }

        if (!membership) {
            hasHandledAccessRevocation.current = true;
            toast.error("Your access to this document has been revoked.");
            router.replace("/");
        }
    }, [membership, membershipLoading, router, userEmail]);

    const updateTitle = (e: FormEvent) => {
        e.preventDefault();

        if (input.trim()) { 
            startTransition(async () => {
                await updateDoc(doc(db, "documents", id), {
                    title: input,
                })
            })
        }
    }

    return (
    <div className="flex-1 h-full bg-white p-5">
        <div className="flex justify-center items-center w-full max-w-3xl mx-auto gap-4 py-2">  {/* this div? the update box needs to be a bit in center */}
            <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
                {/* Update title... */}
                <Input value={input} onChange={(e) => setInput(e.target.value)}/>
                <Button disabled={isUpdating} type="submit">
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
            

                {/* If */}
                { isOwner && (
                    <>
                    {/* Invite users */}
                    <InviteUser />
                    {/* Delete document */}
                    <DeleteDocument />

                    </>
                )}
            </form>
        </div>
       
        <div className='flex max-w-6xl mx-auto justify-between items-center mb-5 gap-4'>
            <div className="ml-27 px-4 py-2">
                {/* ManageUsers */}
                <ManageUsers />
            </div>

           {/* Avatars */}
            <Avatars />
        </div>

        <hr className='pb-10' />        {/* add this in classname to adjust the hr line to the update box - flex justify-center items-center w-full max-w-3xl mx-auto gap-4.    earlier it was pb-10 */}

        {/* Collaborative Editor */}
        <Editor />
  </div>
)}

export default Document