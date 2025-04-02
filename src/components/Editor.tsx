"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Hello, this is your Tiptap editor!</p>",
        immediatelyRender: false,
    });

    if (!editor) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 border rounded-lg">
            <EditorContent editor={editor} className="prose max-w-full" />
        </div>
    );
}
