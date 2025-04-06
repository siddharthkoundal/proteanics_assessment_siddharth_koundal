// components/menu-bar.tsx
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    CheckCircle2,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Info,
    Italic,
    List,
    ListOrdered,
    MessageSquare,
    Strikethrough,
    AlertTriangle,
    XCircle
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { Editor } from "@tiptap/react";
import { CalloutType } from "../extensions/callout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
        return null
    }

    const Options = [
        {
            icon: <Heading1 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            pressed: editor.isActive("heading", { level: 1 }),
        },
        {
            icon: <Heading2 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            pressed: editor.isActive("heading", { level: 2 }),
        },
        {
            icon: <Heading3 className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            pressed: editor.isActive("heading", { level: 3 }),
        },
        {
            icon: <Bold className="size-4" />,
            onClick: () => editor.chain().focus().toggleBold().run(),
            pressed: editor.isActive("bold"),
        },
        {
            icon: <Italic className="size-4" />,
            onClick: () => editor.chain().focus().toggleItalic().run(),
            pressed: editor.isActive("italic"),
        },
        {
            icon: <Strikethrough className="size-4" />,
            onClick: () => editor.chain().focus().toggleStrike().run(),
            pressed: editor.isActive("strike"),
        },
        {
            icon: <AlignLeft className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            pressed: editor.isActive({ textAlign: "left" }),
        },
        {
            icon: <AlignCenter className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            pressed: editor.isActive({ textAlign: "center" }),
        },
        {
            icon: <AlignRight className="size-4" />,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            pressed: editor.isActive({ textAlign: "right" }),
        },
        {
            icon: <List className="size-4" />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            pressed: editor.isActive("bulletList"),
        },
        {
            icon: <ListOrdered className="size-4" />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            pressed: editor.isActive("orderedList"),
        },
        {
            icon: <Highlighter className="size-4" />,
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            pressed: editor.isActive("highlight"),
        },
    ];

    const calloutTypes: { value: CalloutType; icon: React.ReactNode; label: string; shortcut: string }[] = [
        { value: 'info', icon: <Info className="size-4" />, label: 'Information', shortcut: 'Mod+Alt+I' },
        { value: 'warning', icon: <AlertTriangle className="size-4" />, label: 'Warning', shortcut: 'Mod+Alt+W' },
        { value: 'error', icon: <XCircle className="size-4" />, label: 'Error', shortcut: 'Mod+Alt+E' },
        { value: 'bestPractice', icon: <CheckCircle2 className="size-4" />, label: 'Best Practice', shortcut: 'Mod+Alt+B' },
    ];

    const toggleCallout = (type: CalloutType) => {
        if (editor.isActive('callout', { type })) {
            // If we're already in a callout of the same type, create a nested one
            editor.chain().focus().createNestedCallout({ type }).run();
        } else if (editor.isActive('callout')) {
            // If we're in a different type of callout, change the type
            editor.chain().focus().changeCalloutType(type).run();
        } else {
            // If we're not in a callout, create a new one
            editor.chain().focus().toggleCallout({ type }).run();
        }
    };

    return (
        <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50 flex flex-wrap">
            {Options.map((option, index) => (
                <Toggle key={index} pressed={option.pressed} onPressedChange={option.onClick}>
                    {option.icon}
                </Toggle>
            ))}

            <div className="h-6 w-px bg-border mx-1"></div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Toggle
                        pressed={editor.isActive('callout')}
                        onPressedChange={() => editor.chain().focus().toggleCallout().run()}
                    >
                        <MessageSquare className="size-4" />
                    </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {calloutTypes.map((type) => (
                        <DropdownMenuItem
                            key={type.value}
                            onClick={() => toggleCallout(type.value)}
                            className="flex items-center gap-2"
                        >
                            {type.icon}
                            <span>{type.label}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{type.shortcut}</span>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().unsetCallout().run()}
                        disabled={!editor.isActive('callout')}
                        className="text-destructive"
                    >
                        Remove Callout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}