"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Heading2, Heading3, Quote, AlignLeft, AlignCenter, AlignRight, Upload, X
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const[showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const formatText = (e: React.MouseEvent, command: string, commandValue: string = '') => {
    e.preventDefault();
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl) {
      editorRef.current?.focus();
      document.execCommand('createLink', false, linkUrl);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
      setLinkUrl("");
      setShowLinkModal(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop grande (Max 2 Mo).");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();

      if (data.success) {
        setImageUrl(data.url);
      } else {
        alert("Erreur d'upload : " + data.error);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Échec de l'upload.");
    }
  };

  const handleImageInsert = () => {
    if (imageUrl) {
      editorRef.current?.focus();
      document.execCommand('insertImage', false, imageUrl);
      if (editorRef.current) onChange(editorRef.current.innerHTML);
      setImageUrl("");
      setShowImageModal(false);
    }
  };

  const ToolbarButton = ({ onClick, children, title }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onMouseDown={onClick}
      title={title}
      className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-slate-300 mx-1" />;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-[#001f5f] transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
        <ToolbarButton onClick={(e) => formatText(e, 'formatBlock', 'H2')} title="Titre 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'formatBlock', 'H3')} title="Titre 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        
        <Divider />
        
        <ToolbarButton onClick={(e) => formatText(e, 'bold')} title="Gras">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'italic')} title="Italique">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'underline')} title="Souligné">
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        
        <Divider />

        <ToolbarButton onClick={(e) => formatText(e, 'justifyLeft')} title="Aligner à gauche">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'justifyCenter')} title="Centrer">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'justifyRight')} title="Aligner à droite">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <Divider />
        
        <ToolbarButton onClick={(e) => formatText(e, 'insertUnorderedList')} title="Liste à puces">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'insertOrderedList')} title="Liste numérotée">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => formatText(e, 'formatBlock', 'BLOCKQUOTE')} title="Citation">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        
        <Divider />
        
        <ToolbarButton onClick={(e) => { e.preventDefault(); setShowLinkModal(true); }} title="Insérer un lien">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={(e) => { e.preventDefault(); setShowImageModal(true); }} title="Insérer une image">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="w-full min-h-[400px] p-6 focus:outline-none prose prose-slate max-w-none editor-content"
        style={{ minHeight: "400px" }}
        data-placeholder={placeholder || "Écrivez votre article ici..."}
      />

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Insérer un lien</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://exemple.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:border-[#001f5f] outline-none"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowLinkModal(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                Annuler
              </button>
              <button onClick={handleLinkInsert} className="px-5 py-2.5 bg-[#001f5f] text-white rounded-xl font-medium hover:bg-[#001a4d] transition-colors">
                Insérer
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Insérer une image</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Depuis votre ordinateur</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-[#001f5f] text-[#001f5f] rounded-xl hover:bg-blue-50 transition-colors font-medium">
                    <Upload className="w-5 h-5" /> Importer une image
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-xs text-slate-400 font-medium uppercase">OU</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Depuis une URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-[#001f5f] outline-none"
                />
              </div>

              {imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 relative">
                  <img src={imageUrl} alt="Aperçu" className="w-full h-32 object-cover" />
                  <button 
                    onClick={() => setImageUrl("")} 
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => {setShowImageModal(false); setImageUrl("");}} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                Annuler
              </button>
              <button onClick={handleImageInsert} disabled={!imageUrl} className="px-5 py-2.5 bg-[#001f5f] text-white rounded-xl font-medium hover:bg-[#001a4d] transition-colors disabled:opacity-50">
                Insérer
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .editor-content[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          display: block;
        }
        .editor-content h2 { font-size: 1.8em; font-weight: 700; margin-top: 1.2em; margin-bottom: 0.5em; color: #0f172a; }
        .editor-content h3 { font-size: 1.4em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.5em; color: #0f172a; }
        .editor-content blockquote { 
          border-left: 4px solid #001f5f; 
          padding-left: 1rem; 
          margin: 1rem 0; 
          color: #475569; 
          font-style: italic; 
          background: #f8fafc; 
          padding: 1rem; 
          border-radius: 0 0.5rem 0.5rem 0; 
        }
        .editor-content ul { padding-left: 1.5rem; list-style-type: disc; margin-bottom: 1rem; }
        .editor-content ol { padding-left: 1.5rem; list-style-type: decimal; margin-bottom: 1rem; }
        .editor-content a { color: #ff5f00; text-decoration: underline; font-weight: 500; }
        .editor-content img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .editor-content p { margin-bottom: 1rem; line-height: 1.7; color: #334155; }
      `}</style>
    </div>
  );
}
