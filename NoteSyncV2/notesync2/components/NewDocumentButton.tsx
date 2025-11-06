'use client';

import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { createNewDocument } from '@/actions/actions';

function NewDocumentButton() {

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewDocument = () => {
    startTransition(async () => {
      //Create a new document
      const {docId} = await createNewDocument();  //this will be a server action
      router.push(`/doc/${docId}`);
    })
  }

  return <Button onClick={handleCreateNewDocument} disabled = {isPending}>
    {isPending ? "Creating..." : "New Document"}
  </Button>
}

export default NewDocumentButton