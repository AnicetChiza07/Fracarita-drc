'use client';

import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, List, ListOrdered, Link as LinkIcon,
    Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, 
    Undo, Redo, Quote, X, Loader2, UploadCloud
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { useUploadThing } from '@/lib/uploadthing';

interface EditorProps {
    value: JSONContent | null;
    onChange: (content: JSONContent | null) => void;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ElementType;
    title: string;
}

function ToolbarButton({ onClick, isActive, icon: Icon, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-lime/20 text-lime-dark' : 'text-gray-500 hover:bg-cream hover:text-dark'
            }`}
        >
            <Icon size={18} />
        </button>
    );
}

export default function Editor({ value, onChange }: EditorProps) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toastIdRef = useRef<string | number | null>(null);

    const editor = useEditor({
        immediatelyRender: true,
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
            Underline,
            Link.configure({ 
                openOnClick: false, 
                HTMLAttributes: { class: 'tiptap-link', rel: 'noopener noreferrer', target: '_blank' }, 
                autolink: true,
            }),
            Image.configure({ HTMLAttributes: { class: 'tiptap-image' }, allowBase64: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: `Commencez à rédiger votre article ici...` }),
        ],
        content: value || undefined,
        onUpdate: ({ editor }) => { onChange(editor.getJSON()); },
        editorProps: {
            attributes: { class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-6' },
            // Handler personnalisé pour le copier-coller d'URL
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain');
                if (text && /^https?:\/\/\S+$/i.test(text.trim())) {
                    const url = text.trim();
                    const { from, to } = view.state.selection;
                    view.dispatch(
                        view.state.tr
                            .insertText(url, from, to)
                            .addMark(from, from + url.length, view.state.schema.marks.link.create({ href: url }))
                    );
                    return true;
                }
                return false;
            },
        },
    });

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onUploadBegin: () => {
            toastIdRef.current = toast.loading('Upload de l\'image en cours...');
        },
        onClientUploadComplete: (res) => {
            if (res && res[0]) {
                editor.chain().focus().setImage({ src: res[0].url }).run();
                if (toastIdRef.current) {
                    toast.success('Image insérée dans l\'article', { id: toastIdRef.current });
                } else {
                    toast.success('Image insérée dans l\'article');
                }
            }
            setIsImageModalOpen(false);
        },
        onUploadError: (error) => {
            if (toastIdRef.current) {
                toast.error(`Erreur: ${error.message}`, { id: toastIdRef.current });
            } else {
                toast.error(`Erreur: ${error.message}`);
            }
            setIsImageModalOpen(false);
        },
    });

    const handleEditorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            startUpload([file]);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    useEffect(() => {
        if (editor && value) {
            const currentContent = editor.getJSON();
            if (JSON.stringify(currentContent) !== JSON.stringify(value)) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-lime/50 focus-within:border-lime transition-all duration-300">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-cream/30">
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={editor.can().undo()} icon={Undo} title="Annuler" />
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={editor.can().redo()} icon={Redo} title="Rétablir" />
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Gras" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italique" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Souligné" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Barré" />
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Titre 1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Titre 2" />
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Liste à puces" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Liste numérotée" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Citation" />
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <ToolbarButton onClick={() => {
                    const previousUrl = editor.getAttributes('link').href;
                    const url = window.prompt('Entrez l\'URL du lien (ou laissez vide pour supprimer) :', previousUrl || 'https://');
                    if (url === null) return;
                    if (url === '' || url === 'https://') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                    } else {
                        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                    }
                }} isActive={editor.isActive('link')} icon={LinkIcon} title="Insérer/Modifier un lien" />
                <ToolbarButton onClick={() => setIsImageModalOpen(true)} icon={ImageIcon} title="Uploader une image" />
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Aligner à gauche" />
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Centrer" />
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Aligner à droite" />
            </div>

            <EditorContent editor={editor} className="tiptap-editor-content" />
            
            <style jsx global>{`
                .tiptap-editor-content .ProseMirror { outline: none; min-height: 300px; color: #1a1a1a; line-height: 1.7; }
                .tiptap-editor-content .ProseMirror p { margin-bottom: 1em; }
                .tiptap-editor-content .ProseMirror h1 { font-size: 2em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
                .tiptap-editor-content .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #222; }
                .tiptap-editor-content .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
                .tiptap-editor-content .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
                .tiptap-editor-content .ProseMirror li { margin-bottom: 0.5em; }
                .tiptap-editor-content .ProseMirror img.tiptap-image { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5em 0; display: block; }
                .tiptap-editor-content .ProseMirror a.tiptap-link { 
                    color: #2563eb !important; 
                    text-decoration: underline !important;
                    text-decoration-color: #2563eb !important;
                    text-decoration-thickness: 1px !important;
                    font-weight: 500;
                    cursor: pointer;
                    background-color: rgba(37, 99, 235, 0.05) !important;
                    padding: 0 2px;
                    border-radius: 2px;
                }
                .tiptap-editor-content .ProseMirror a.tiptap-link:hover { 
                    color: #1d4ed8 !important;
                    background-color: rgba(37, 99, 235, 0.1) !important;
                }
                .tiptap-editor-content .ProseMirror blockquote { border-left: 4px solid #d9f99d; padding: 1em 1.5em; font-style: italic; color: #555; margin: 1.5em 0; background: #f9fafb; border-radius: 0 0.5rem 0.5rem 0; }
            `}</style>

            {isImageModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-dark">Uploader une image</h3>
                            <button onClick={() => setIsImageModalOpen(false)} className="p-2 hover:bg-cream rounded-lg"><X size={20} /></button>
                        </div>
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl bg-cream/50 hover:bg-cream hover:border-lime/50 transition-all duration-300 cursor-pointer group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading ? (
                                    <Loader2 size={32} className="text-lime-dark animate-spin mb-3" />
                                ) : (
                                    <UploadCloud size={32} className="text-text-light/50 mb-3 group-hover:text-lime-dark transition-colors" />
                                )}
                                <p className="mb-2 text-sm text-text-light"><span className="font-semibold text-dark">Cliquez pour choisir</span></p>
                                <p className="text-xs text-text-light/60">PNG, JPG ou WEBP (MAX. 4MB)</p>
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleEditorFileChange} disabled={isUploading} />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}