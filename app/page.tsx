"use client"

import TextEditor from "@/components/text-editor";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");

  const onChange = (content: string) => {
    setContent(content);
    console.log(content);
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <TextEditor content={content} onChange={onChange} />
    </div>
  );
}
