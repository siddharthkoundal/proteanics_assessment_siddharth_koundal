"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Hello, this is your Tiptap editor!</p>",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]"
            }
        }
    });

    if (!editor) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="w-full p-2">
                <h2>Editor</h2>
                <EditorContent editor={editor} className="border rounded-lg p-2" />
            </div>
        </div>
    );
}
