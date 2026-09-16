"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List } from "lucide-react";

export default function RichTextEditor({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your story here..." }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-stone font-serif text-foreground/80 focus:outline-none min-h-[200px] p-4 bg-secondary/10 border border-border mt-2",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 border transition-colors ${editor.isActive("bold") ? "bg-primary text-background border-primary" : "border-border text-foreground/60 hover:border-primary/50"}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 border transition-colors ${editor.isActive("italic") ? "bg-primary text-background border-primary" : "border-border text-foreground/60 hover:border-primary/50"}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 border transition-colors ${editor.isActive("bulletList") ? "bg-primary text-background border-primary" : "border-border text-foreground/60 hover:border-primary/50"}`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
