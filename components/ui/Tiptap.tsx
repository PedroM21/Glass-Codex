"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

type RichTextDoc = JSONContent;

type TipTapProps = {
  content: RichTextDoc;
};

const TipTap = ({ content }: TipTapProps) => {
  const safeContent =
    content?.type === "doc" ? content : { type: "doc", content: [] };

  const editor = useEditor({
    extensions: [StarterKit],
    content: safeContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "border rounded-md min-h-50 max-h-70 overflow-y-auto py-2 px-3",
      },
    },
  });

  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="flex gap-2 pb-2">
        <button
          className={
            editor?.isActive("bold") ? "bg-blue-400" : "hover:bg-gray-300"
          }
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <FormatBoldIcon />
        </button>
        <button
          className={
            editor?.isActive("italic") ? "bg-blue-400" : "hover:bg-gray-300"
          }
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <FormatItalicIcon />
        </button>
        <button
          className={
            editor?.isActive("bulletList") ? "bg-blue-400" : "hover:bg-gray-300"
          }
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <FormatListBulletedIcon />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap;
