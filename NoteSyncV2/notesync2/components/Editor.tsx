import { useRoom, useSelf } from "@liveblocks/react/suspense";
import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/stringToColor";
import { db } from "@/firebase"; // ✅ ensure this points to your Firebase config
import { doc as firestoreDoc, setDoc, getDoc } from "firebase/firestore";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

type EditorProps = {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
  roomId: string;
  userId: string;
};

// Debounced save: waits until user stops typing for 2 seconds
// Save to shared document location so all users (owner and editors) persist to the same place
function useAutoSaveEditor(roomId: string, userId: string, editor: BlockNoteEditor | null) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor || !roomId || !userId) return;

    const saveContent = async () => {
      if (!roomId || !userId) return;
      
      try {
        const blocks = editor.document;
        // Save to shared document location - all users save to the same place
        // This ensures edits persist for everyone, regardless of who made them
        await setDoc(
          firestoreDoc(db, "documents", roomId),
          { 
            content: blocks, 
            updatedAt: new Date(),
            lastUpdatedBy: userId // Track who made the last edit
          },
          { merge: true }
        );
        console.log("✅ Content saved to Firestore (shared location)");
      } catch (error) {
        console.error('Error saving content to Firestore:', error);
        // Don't throw - allow user to continue editing
      }
    };

    const handleChange = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(saveContent, 2000); // waits 2s after last change
    };

    // listen to editor changes
    const unsubscribe = editor.onChange(handleChange);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      unsubscribe?.();
    };
  }, [editor, roomId, userId]);
}

// Load previously saved content from Firestore
// Load from shared document location so all users see the same content
// This is a fallback for when Liveblocks hasn't synced yet or on initial load
function useLoadEditorContent(roomId: string, userId: string, editor: BlockNoteEditor | null) {
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const loadContent = async () => {
      if (!editor || !roomId || !userId || hasLoadedRef.current) return;

      try {
        // Load from shared document location - all users load from the same place
        const snap = await getDoc(firestoreDoc(db, "documents", roomId));
        if (snap.exists()) {
          const data = snap.data();
          if (data.content && Array.isArray(data.content) && data.content.length > 0) {
            // Only load if editor is empty (just initialized) to avoid overwriting real-time collaboration
            // Liveblocks handles real-time sync, this is just for initial load when no one else is online
            const isEmpty = editor.document.length === 0 || 
                           (editor.document.length === 1 && 
                            editor.document[0].type === "paragraph" && 
                            (!editor.document[0].content || editor.document[0].content.length === 0));
            
            if (isEmpty) {
              editor.replaceBlocks(editor.document, data.content);
              hasLoadedRef.current = true;
              console.log("✅ Content loaded from Firestore (shared location)");
            }
          }
        }
      } catch (error) {
        console.error('Error loading content from Firestore:', error);
        // Don't throw - allow editor to work with empty content
      }
    };
    
    // Small delay to let Liveblocks initialize first
    const timeout = setTimeout(loadContent, 500);
    return () => clearTimeout(timeout);
  }, [editor, roomId, userId]);
}

function BlockNote({ doc, provider, darkMode, roomId, userId }: EditorProps) {
  const userInfo = useSelf((me) => me.info);

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  }) as unknown as BlockNoteEditor;

  // Auto-load + debounce save
  useLoadEditorContent(roomId, userId, editor);
  useAutoSaveEditor(roomId, userId, editor);

  return (
    <div className="relative max-6-xl mx-auto div className='flex items-center gap-2 max-w-4xl justify-end mb-10'">
      <BlockNoteView
        className="min-h-screen"
        editor={editor as any}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const self = useSelf();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) return null;

  const roomId = room.id;
  const userId = self?.info?.email || "unknown_user";

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 max-w-4xl justify-end mb-10">
        <ChatToDocument doc = {doc} />
          <TranslateDocument doc = {doc} />
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {/* Toggle dark mode */}
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <BlockNote
        doc={doc}
        provider={provider}
        darkMode={darkMode}
        roomId={roomId}
        userId={userId}
      />
    </div>
  );
}

export default Editor;
