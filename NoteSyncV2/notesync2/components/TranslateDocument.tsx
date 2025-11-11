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

    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();

        if (!language) {
            console.error("Please select a language");
            return;
        }

        startTransition(async () => {
            try {
                // Extract text content from Y.Doc XML fragment
                // BlockNote stores content in the "document-store" XML fragment
                const xmlFragment = doc.getXmlFragment("document-store");
                
                // Extract text from the XML fragment
                // Convert XML structure to plain text by extracting text content
                let documentText = "";
                
                // Iterate through the fragment to extract text
                const fragmentLength = xmlFragment.length;
                for (let i = 0; i < fragmentLength; i++) {
                    try {
                        const item = (xmlFragment as any)[i] || (xmlFragment as any).get?.(i);
                        if (item) {
                            // Try to get text content from the item
                            const itemString = String(item);
                            // Remove XML tags and extract text
                            const cleanText = itemString.replace(/<[^>]*>/g, ' ').trim();
                            if (cleanText) {
                                documentText += cleanText + " ";
                            }
                        }
                    } catch (err) {
                        // Continue if we can't extract from this item
                        console.warn("Could not extract text from fragment item:", err);
                    }
                }
                
                // Fallback: if no text extracted, try to get document content as string
                if (!documentText.trim()) {
                    // Try alternative method - get the XML fragment as string
                    try {
                        const docState = Y.encodeStateAsUpdate(doc);
                        documentText = "Document content"; // Placeholder if extraction fails
                    } catch (err) {
                        console.error("Error extracting document text:", err);
                    }
                }
                
                // Clean up the extracted text
                documentText = documentText.trim().replace(/\s+/g, ' ');
                
                if (!documentText || documentText.length === 0) {
                    throw new Error("Document is empty. Please add some content to translate.");
                }

                // Get backend URL
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8787";
                
                // Call backend API to translate
                const res = await fetch(`${backendUrl}/translateDocument`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentData: documentText,
                        targetLang: language,
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || errorData.message || `Translation failed: ${res.statusText}`);
                }

                // Parse successful response
                const result = await res.json();
                
                // Extract translated text from response
                // Backend returns: { translated_text: string } or the raw response
                const translatedText = result.translated_text || result.text || JSON.stringify(result);
                
                if (translatedText) {
                    setSummary(translatedText);
                    console.log("Translation successful:", translatedText);
                    
                    // Close dialog on success
                    setIsOpen(false);
                    setLanguage("");
                } else {
                    throw new Error("No translation received from server");
                }
            } catch (err) {
                console.error("Translation error:", err);
                // You can add error state display here if needed
                alert(err instanceof Error ? err.message : "Translation failed. Please try again.");
            }
        });
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