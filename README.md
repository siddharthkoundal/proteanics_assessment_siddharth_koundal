# Text Editor 

This project implements a text editor using Tiptap and ProseMirror, featuring a customizable callout component.

## Implementation Details

The editor is built using:
- Next.js
- Tiptap editor framework
- TailwindCSS for styling
- shadCn library

## Features

- Rich text editing with standard formatting options
- Text alignment controls
- Ordered and unordered lists
- Text highlighting
- Custom callout component with multiple types (info, warning, error, best practice)

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open http://localhost:3000 in your browser

## Usage

### Callout Component

The callout component allows you to create highlighted information blocks in your document with different types:

- Information (blue)
- Warning (amber)
- Error (red)
- Best Practice (green)

#### Keyboard Shortcuts

- **Alt+I**: Toggle Information callout
- **Alt+W**: Toggle Warning callout
- **Alt+E**: Toggle Error callout
- **Alt+B**: Toggle Best Practice callout

#### Using Callouts

1. Position your cursor where you want to add a callout
2. Press one of the keyboard shortcuts or use the callout button in the toolbar
3. Type your content inside the callout
4. Use the type buttons in the callout header to change the callout type
5. Use the trash icon to remove the callout

#### Nested Callouts

You can create nested callouts by:
1. Placing your cursor inside an existing callout
2. Using the callout button or keyboard shortcut again

## Demo

[Demonstration video](https://drive.google.com/file/d/16S4nAhPnRXNCsga5FjC6pOD1qKWpY1hz/view?usp=sharing)

The callout component is implemented as a custom Tiptap node with React NodeView rendering.