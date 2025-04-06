# AI-Enabled Inline Edit Feature — Design Document

## Goal

To implement an AI-powered **inline edit feature** in a Tiptap-based editor, enabling users to:

- Select text in the editor
- Press a keyboard shortcut (e.g., `Cmd+Shift+Q` or `Ctrl+Shift+Q`)
- Enter instructions to edit the selected text
- See suggested changes via a **diff view**
- Accept or reject the AI-generated edit
- Ensure output is compatible with existing editor schema (including custom nodes like `callout`)

---

## Feature Flow

1. **User Interaction**
   - User highlights content inside the editor
   - Presses a defined keyboard shortcut (e.g., `Cmd+Shift+Q`)
   - A floating input box appears asking: _"Ask AI?"_

2. **LLM Request**
   - Selected content and user instruction are sent as payload to backend that wraps a call to an LLM (e.g., OpenAI)
   - Prompt structure:  
     ```
     Modify the following text based on the user's instruction. Output only the modified version.

     Instruction: <user_input>
     Text: <selected_text>
     ```

3. **LLM Response**
   - The modified version of the text is returned
   - A **side-by-side diff view** is rendered:
     - Original on left
     - Suggested edit on right
     - Highlighted changes using diffing algorithm (e.g., `diff-match-patch` or `fast-diff`)

4. **User Decision**
   - User can either **accept** (apply changes) or **reject** (discard them)
   - If accepted:
     - The original selection is replaced with LLM-modified text
     - Content is validated and inserted using Tiptap commands
   - If rejected:
     - Selection remains unchanged

---

## Technical Design

### Editor Extension

A custom extension will handle:

- Keyboard shortcut registration
- Managing floating input UI
- Integrating with a ProseMirror `plugin` to:
  - Track selection
  - Manage transaction metadata
  - Handle decorations for diff view

### Floating UI Component

- Rendered using `ReactPortal` inside the editor container
- Position: Above or below the selected text
- Form:
  - Instruction input field
  - "Ask" button
  - Spinner/loading state
  - "Cancel" button

### LLM API Backend

```ts

POST {
  instruction: string;
  content: string;
}
→
Response: {
  modifiedText: string;
}
```

### Diff View Implementation

Use a diffing algorithm like `diff-match-patch`:

- Wrap additions in green container
- Wrap deletions in red container
- Display both versions in a modal or inline

### Applying the Edit

- Use Tiptap’s `editor.commands.insertContentAt(range, content)` to replace the selection
- Validate content using schema
- Handle nested nodes or marks (e.g., if editing inside a `callout`)

---

## Considerations for Custom Nodes

### Custom Nodes (e.g., `callout`)
- If the user selects text inside a custom node:
  - Ensure modified text respects the internal structure (`content` → `inline*`)
  - Do not allow structural breakage (e.g., turning text into a block-level node)
- Validate against schema using `schema.nodeFromJSON` before applying

### Marks (bold, italic, links)
- Preserve active marks when applying LLM response if applicable
- Reapply stored marks to LLM-modified text

---

## Edge Cases & Robustness

| Scenario | Handling |
|---------|----------|
| No text selected | Disable shortcut or show helpful toast |
| Multi-node selection | Apply only if selection is of `inline` content; otherwise, show warning |
| Invalid LLM output | Validate content, fallback to diff rejection |
| Nested within callout or list | Maintain structure, only replace text content |
| Editor out of focus | Do not activate floating UI |
| API failure | Show error message, retry option |
| Large text selection | Limit input size to prevent long LLM prompts |

---

## UX Enhancements

- Keyboard accessible floating input
- Escape key closes input or diff box

---

## Key Libraries & Tools

- `diff-match-patch` or `fast-diff` for diffing
- `react-dom` portal for floating UI
- Tiptap commands & ProseMirror plugins
- `zod` for response validation

---

## Conclusion

This design outlines **inline edit feature**. It uses ProseMirror's core APIs for decorations and transactions, keeps the user in control, and guarantees content validity through schema checks.

