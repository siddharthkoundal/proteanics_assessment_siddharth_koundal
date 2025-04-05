"use client"

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import MenuBar from './menu-bar'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

interface TextEditorProps {
    content: string;
    onChange: (content: string) => void
}

export default function TextEditor({ content, onChange }: TextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4'
                    }
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-4'
                    }
                }
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                defaultAlignment: 'left',
            }),
            Highlight
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[250px] border rounded-md bg-slate-50 py-2 px-3"
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    })

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
