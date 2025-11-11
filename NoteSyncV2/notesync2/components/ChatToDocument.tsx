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
import { inviteUserToDocument } from '@/actions/actions';
import { Input } from './ui/input';
import { toast } from 'sonner';
import * as Y from "yjs";
import { MessageCircleCode } from 'lucide-react';
import { LanguagesIcon, BotIcon } from "lucide-react";
import Markdown from "react-markdown";


function ChatToDocument({ doc }: { doc: Y.Doc }) {
    const [ isOpen , setIsOpen ] = useState(false);
    const [input, setInput] = useState("");
    const [ isPending, startTransition ] = useTransition();
    const [summary, setSummary] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const pathname = usePathname();       
    const router = useRouter();

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault();
        setQuestion(input);
        startTransition(async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787";
                const normalizedBackendUrl = backendUrl.replace(/\/$/, '');
                // Send a serialized version of the Y.Doc so the backend receives a string
                const documentData = JSON.stringify(doc.toJSON());
                const res = await fetch(`${normalizedBackendUrl}/chatToDocument`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        documentData,
                        question: input,
                    }),
                });
                if (!res.ok) {
                    const errText = await res.text().catch(() => '');
                    throw new Error(errText || `Request failed: ${res.status} ${res.statusText}`);
                }
                const { message } = await res.json();
                setInput("");
                setSummary(message || "");
                toast.success("Question answered successfully!");
            } catch (err) {
                console.error("Chat error:", err);
                toast.error(err instanceof Error ? err.message : "Failed to ask question");
            }
        })

    };

  return (
    <Dialog open = {isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
        <DialogTrigger>
            <MessageCircleCode className="mr-2"/> 
            Chat to the Document!
        </DialogTrigger>
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Chat to the Document!</DialogTitle>
        <DialogDescription>
            Ask a question about the document.
        </DialogDescription>

        <hr className='my-4' />
        {question &&  <p className='text-sm text-gray-500'>Question: {question}</p>}

        </DialogHeader>

        {
            summary && (
                <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100 rounded">
                    <div className="flex items-center gap-2">
                        <BotIcon className="w-5 h-5 shrink-0" />
                        <span className="font-bold">
                            GPT {isPending ? "Thinking..." : "Answered"}
                            </span>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap w-full">
                        {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
                    </div>
                </div>
            )
        }

        <form className='flex gap-2' onSubmit={handleAskQuestion}>
            <Input 
                type="text"
                placeholder='i.e. what is this about?'
                className='w-full'
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" disabled={!input || isPending}>
                {isPending ? "Asking..." : "Ask"}
            </Button>
        </form>
    </DialogContent>
    </Dialog>
  )
}

export default ChatToDocument;