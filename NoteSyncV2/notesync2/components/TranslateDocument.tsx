'use client';

import * as Y from "yjs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { FormEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguagesIcon, BotIcon } from "lucide-react";
import Markdown from "react-markdown";


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




function TranslateDocument({ doc }: { doc: Y.Doc }) {
	const [isOpen, setIsOpen] = useState(false);
	const [language, setLanguage] = useState<string>('');
	const [summary, setSummary] = useState<string>('');
	const [isPending, startTransition] = useTransition();

	const handleAskQuestion = (e: FormEvent) => {
		e.preventDefault();

		if (!language) {
			console.error('Please select a language');
			return;
		}

		startTransition(async () => {
			try {
				const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787';
				const normalizedBackendUrl = backendUrl.replace(/\/$/, '');

				if (!normalizedBackendUrl) {
					throw new Error('Backend URL is not configured. Set NEXT_PUBLIC_BACKEND_URL in your environment.');
				}

				const docJSON = doc.toJSON();
				const documentData = JSON.stringify(docJSON);

				if (!documentData || documentData === '{}' || documentData === '[]') {
					throw new Error('Document is empty. Please add some content to translate.');
				}

				const res = await fetch(`${normalizedBackendUrl}/translateDocument`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						documentData,
						targetLang: language,
					}),
				});

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}));
					throw new Error(errorData.error || errorData.message || `Translation failed: ${res.statusText}`);
				}

				const result = await res.json();
				const translatedText = result.translated_text || result.text || JSON.stringify(result);

				if (!translatedText) {
					throw new Error('No translation received from server.');
				}

				setSummary(translatedText);
				setLanguage('');
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Translation failed. Please try again.';
				console.error('Translation error:', message);
				alert(message);
			}
		});
	};




    return (
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
    <Button asChild variant="outline">
        <DialogTrigger>
            <LanguagesIcon/>
            Translated summary
            </DialogTrigger>
    </Button>
    <DialogContent>
        <DialogHeader>
        <DialogTitle> Translate Document</DialogTitle>
        <DialogDescription>
            Select the language you want to translate the document to.
        </DialogDescription>
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