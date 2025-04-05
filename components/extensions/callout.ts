// components/extensions/callout.ts
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CalloutComponent from "../callout-component";

export type CalloutType = "info" | "warning" | "error" | "bestPractice";

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>;
  types: CalloutType[];
  defaultType: CalloutType;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      /**
       * Set a callout
       */
      setCallout: (attributes?: { type?: CalloutType }) => ReturnType;
      /**
       * Toggle a callout
       */
      toggleCallout: (attributes?: { type?: CalloutType }) => ReturnType;
      /**
       * Unset a callout
       */
      unsetCallout: () => ReturnType;
      /**
       * Change the type of the callout
       */
      changeCalloutType: (type: CalloutType) => ReturnType;
    };
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: "callout",

  addOptions() {
    return {
      HTMLAttributes: {},
      types: ["info", "warning", "error", "bestPractice"],
      defaultType: "info",
    };
  },

  group: "block",

  content: "block+",

  defining: true,

  addAttributes() {
    return {
      type: {
        default: this.options.defaultType,
        parseHTML: (element) =>
          element.getAttribute("data-type") || this.options.defaultType,
        renderHTML: (attributes) => {
          return {
            "data-type": attributes.type,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-callout]",
        getAttrs: (element) => {
          if (typeof element === "string") return {};

          const type = element.getAttribute("data-type");

          if (!type || !this.options.types.includes(type as CalloutType)) {
            return false;
          }

          return { type };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-callout": "",
        class: `callout callout-${HTMLAttributes.type}`,
      }),
      ["div", { class: "callout-content" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes);
        },
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes);
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
      changeCalloutType:
        (type) =>
        ({ commands, editor }) => {
          if (!editor.isActive(this.name)) {
            return false;
          }

          return commands.updateAttributes(this.name, { type });
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Alt-i": () => this.editor.commands.toggleCallout({ type: "info" }),
      "Alt-w": () => this.editor.commands.toggleCallout({ type: "warning" }),
      "Alt-e": () => this.editor.commands.toggleCallout({ type: "error" }),
      "Alt-b": () =>
        this.editor.commands.toggleCallout({ type: "bestPractice" }),

      // Backspace: () => {
      //   const { state, view } = this.editor;
      //   const { selection } = state;
      //   const { $from } = selection;

      //   const parent = $from.node(-1);

      //   // If we're inside a callout and at the very beginning of it
      //   if (parent.type.name === this.name && $from.parentOffset === 0) {
      //     // Prevent backspace from lifting callout unless explicitly selected
      //     return true; // returning true prevents the default behavior
      //   }

      //   return false;
      // },
    };
  },
});

export default Callout;
