"use client";

import { useState, useEffect } from "react";
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  Send, 
  Link as LinkIcon, 
  Check,
  Share2
} from "lucide-react";

interface BlogShareProps {
  title: string;
}

export default function BlogShare({ title }: BlogShareProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <Send className="w-5 h-5" />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + currentUrl)}`,
      color: "hover:bg-green-500 hover:text-white text-green-600 bg-green-50"
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-blue-600 hover:text-white text-blue-600 bg-blue-50"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-blue-700 hover:text-white text-blue-700 bg-blue-50"
    },
    {
      name: "X",
      icon: <Twitter className="w-5 h-5" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-black hover:text-white text-gray-800 bg-gray-100"
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 border-t border-gray-100 mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#001f5f] font-bold">
          <Share2 className="w-5 h-5" />
          <span>Partager cet article</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${link.color}`}
              title={`Partager sur ${link.name}`}
            >
              {link.icon}
            </a>
          ))}
          
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              copied 
              ? "bg-green-500 text-white" 
              : "bg-orange-50 text-[#ff5f00] hover:bg-[#ff5f00] hover:text-white"
            }`}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copié !</>
            ) : (
              <><LinkIcon className="w-4 h-4" /> Copier le lien</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
