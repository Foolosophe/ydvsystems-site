"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react"
import { countWords, readingTime } from "@/lib/blog/wordCount"

interface ArticleEditorProps {
  content: string
  onChange: (html: string) => void
  onSelectionChange?: (text: string) => void
  placeholder?: string
}

export default function ArticleEditor({
  content,
  onChange,
  onSelectionChange,
  placeholder = "Commencez a rediger...",
}: ArticleEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      if (onSelectionChange) {
        const { from, to } = editor.state.selection
        const text = from !== to ? editor.state.doc.textBetween(from, to, " ") : ""
        onSelectionChange(text)
      }
    },
  })

  if (!editor) return null

  function addLink() {
    const url = window.prompt("URL du lien :")
    if (url) {
      editor!.chain().focus().setLink({ href: url }).run()
    }
  }

  const TOOLBAR = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
    { icon: LinkIcon, action: addLink, active: editor.isActive("link") },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false },
  ]

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-secondary">
        {TOOLBAR.map(({ icon: Icon, action, active }, i) => (
          <button
            key={i}
            type="button"
            onClick={action}
            className={`p-2 rounded-lg transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white"
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus-within:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[280px]"
      />
      <div className="flex items-center gap-3 px-4 py-2 border-t border-border bg-secondary text-xs text-muted-foreground">
        <span>{countWords(editor.getHTML())} mots</span>
        <span className="text-border">|</span>
        <span>{readingTime(countWords(editor.getHTML()))} min de lecture</span>
      </div>
    </div>
  )
}
