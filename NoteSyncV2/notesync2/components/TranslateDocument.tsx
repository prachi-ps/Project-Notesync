'use client';

import * as Y from "yjs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { FormEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguagesIcon } from "lucide-react";

type Language =
    | "english"
    | "spanish"
    | "french"
    | "german"
    | "italian"
    | "portuguese"
    | "russian"
    | "chinese"
    | "japanese"
    | "hindi"
    | "marathi";

const languageOptions: Language[] = ["english", "spanish", "french", "german", "italian", "portuguese", "russian", "chinese", "japanese", "hindi", "marathi"];




function TranslateDocument({doc}: {doc: Y.Doc}){

    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    const [question, setQuestion] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const handleAskQuestion =  (e: FormEvent) => {
        e.preventDefault();

        startTransition(async () => {

        })
    };
    return (
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
        <DialogTrigger>
            <LanguagesIcon/>
            Translate
            </DialogTrigger>
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle> Translate Document</DialogTitle>
        <DialogDescription>
            Select the language you want to translate the document to.
        </DialogDescription>
        </DialogHeader>

        <form className='flex gap-2' onSubmit={handleAskQuestion}>
            
            <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                    {languageOptions.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button type="submit" disabled={!language || isPending}>
                {isPending ? "Translating..." : "Translate"}
            </Button>
        </form>
    </DialogContent>
    </Dialog>
    )
}

export default TranslateDocument;