"use client";

import React, { useEffect, useState } from "react";
import { initializeKuroshiro, toFuriganaHTML } from "@/lib/kuroshiro";

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

  useEffect(() => {
    let isMounted = true;
    if (showFurigana) {
      (async () => {
        await initializeKuroshiro();
        const html = await toFuriganaHTML(text, readingStyle);
        if (isMounted) setFuriganaHtml(html);
      })();
    } else {
      setFuriganaHtml(null);
    }
    return () => {
      isMounted = false;
    };
  }, [text, showFurigana, readingStyle]);

  if (!showFurigana || !furiganaHtml) {
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
