"use client";

import React, { useEffect, useState } from "react";
import { toFuriganaHTML, isKuroshiroReady } from "@/lib/kuroshiro";

interface FuriganaTextProps {
  text: string;
  reading?: string;
  showFurigana: boolean;
  readingStyle: "hiragana" | "katakana" | "romaji";
}

const FuriganaText: React.FC<FuriganaTextProps> = ({
  text,
  showFurigana,
  readingStyle,
}) => {
  const [furiganaHtml, setFuriganaHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const generateFurigana = async () => {
      if (showFurigana && isKuroshiroReady() && text) {
        setIsGenerating(true);
        try {
          const html = await toFuriganaHTML(text, readingStyle);
          if (isMounted) {
            setFuriganaHtml(html);
          }
        } catch (error) {
          console.error("Failed to generate furigana:", error);
          if (isMounted) {
            setFuriganaHtml(null);
          }
        } finally {
          if (isMounted) {
            setIsGenerating(false);
          }
        }
      } else {
        setFuriganaHtml(null);
        setIsGenerating(false);
      }
    };
    generateFurigana();
    return () => {
      isMounted = false;
    };
  }, [text, showFurigana, readingStyle]);


  if (isGenerating) {
    return <span className="opacity-50">{text}</span>;
  }

  if (!showFurigana || !isKuroshiroReady() || furiganaHtml === null) {
    return <span>{text}</span>;
  }

  return (
    <span
      className="inline-block"
      dangerouslySetInnerHTML={{ __html: furiganaHtml }}
    />
  );
};

export default FuriganaText;
