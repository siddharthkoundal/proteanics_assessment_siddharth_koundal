import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CalloutComponent from "../callout-component";
import { TextSelection } from "prosemirror-state";

export type CalloutType = "info" | "warning" | "error" | "bestPractice";

export interface CalloutOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      /**
       * Create a nested callout
       */
      createNestedCallout: (attributes?: { type?: CalloutType }) => ReturnType;
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

          if (!type || typeof type !== "string") {
            return { type: this.options.defaultType };
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

      // Modified toggleCallout command to better handle nesting
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          // Check if we're already in a callout of the same type
          const isInCallout = this.editor.isActive(this.name, attributes);

          // If we're already in the same type of callout, try to create a nested one
          if (isInCallout) {
            return commands.createNestedCallout(attributes);
          }

          // Otherwise use the standard toggle behavior
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

      // New command to create a nested callout
      createNestedCallout:
        (attributes) =>
        ({ commands, dispatch, state }) => {
          if (!dispatch) return true;

          const { selection, schema } = state;
          const { $to } = selection;

          // Create a new paragraph after current selection
          const paragraph = schema.nodes.paragraph.create();
          const tr = state.tr.insert($to.after(), paragraph);

          // Move selection into that new paragraph
          tr.setSelection(TextSelection.near(tr.doc.resolve($to.after() + 1)));

          // Apply transaction
          dispatch(tr);

          // Now wrap that new paragraph in a callout
          return commands.wrapIn("callout", attributes);
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