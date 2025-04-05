// components/callout-component.tsx
import React, { useEffect, useRef } from 'react'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Info, AlertTriangle, XCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { Toggle } from './ui/toggle'
import { CalloutType } from './extensions/callout'
import { NodeViewContent } from '@tiptap/react'

const CalloutComponent: React.FC<NodeViewProps> = ({
    node,
    editor,
    getPos,
    updateAttributes
}) => {
    const type = node.attrs.type as CalloutType;
    const wrapperRef = useRef<HTMLDivElement>(null);

    const calloutTypes: { value: CalloutType; icon: React.ReactNode; label: string }[] = [
        { value: 'info', icon: <Info className="size-4" />, label: 'Information' },
        { value: 'warning', icon: <AlertTriangle className="size-4" />, label: 'Warning' },
        { value: 'error', icon: <XCircle className="size-4" />, label: 'Error' },
        { value: 'bestPractice', icon: <CheckCircle2 className="size-4" />, label: 'Best Practice' },
    ]

    const getCalloutColor = (type: CalloutType) => {
        switch (type) {
            case 'info':
                return 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
            case 'warning':
                return 'border-amber-500 bg-amber-50 dark:bg-amber-950/50'
            case 'error':
                return 'border-red-500 bg-red-50 dark:bg-red-950/50'
            case 'bestPractice':
                return 'border-green-500 bg-green-50 dark:bg-green-950/50'
            default:
                return 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
        }
    }

    const getIconColor = (type: CalloutType) => {
        switch (type) {
            case 'info':
                return 'text-blue-500'
            case 'warning':
                return 'text-amber-500'
            case 'error':
                return 'text-red-500'
            case 'bestPractice':
                return 'text-green-500'
            default:
                return 'text-blue-500'
        }
    }

    const currentType = calloutTypes.find(ct => ct.value === type) || calloutTypes[0]

    return (
        <NodeViewWrapper as="div" ref={wrapperRef}>
            <div className={`callout rounded-md border-l-4 p-4 mb-4 ${getCalloutColor(type)}`}>
                <div className="flex items-center gap-2 mb-2">
                    <span className={getIconColor(type)}>
                        {currentType.icon}
                    </span>
                    <span className="font-medium">{currentType.label}</span>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="flex border rounded-md overflow-hidden">
                            {calloutTypes.map((calloutType) => (
                                <Toggle
                                    key={calloutType.value}
                                    size="sm"
                                    pressed={type === calloutType.value}
                                    onPressedChange={() => {
                                        updateAttributes({ type: calloutType.value })
                                    }}
                                    className="rounded-none data-[state=on]:bg-muted"
                                >
                                    <span className={type === calloutType.value ? getIconColor(calloutType.value) : ''}>
                                        {calloutType.icon}
                                    </span>
                                </Toggle>
                            ))}
                        </div>

                        {/* 🗑️ Delete Button */}
                        <button
                            onClick={() => editor.chain().focus().unsetCallout().run()}
                            className="text-red-500 hover:text-red-600 p-1"
                            title="Delete callout"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>

                </div>
                <div className="callout-content" data-callout-content>
                    <NodeViewContent />
                </div>

            </div>
        </NodeViewWrapper>
    )
}

export default CalloutComponent