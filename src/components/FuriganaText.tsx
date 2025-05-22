"use client";

import React from "react";

interface FuriganaTextProps {
  text: string;
  reading: string;
  showFurigana: boolean;
  readingStyle?: "hiragana" | "katakana";
}

const FuriganaText: React.FC<FuriganaTextProps> = ({
  text,
  reading,
  showFurigana,
}) => {
  if (!showFurigana) {
    return <span>{text}</span>;
  }

  return (
    <span className="inline-block">
      <ruby>
        {text}
        <rt className="text-sm text-gray-600">{reading}</rt>
      </ruby>
    </span>
  );
};

export default FuriganaText;
