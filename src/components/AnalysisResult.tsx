"use client";

import React from "react";
import FuriganaText from "./FuriganaText";
import { containsKanji } from "@/lib/utils";

interface Token {
  surface_form: string;
  reading: string;
  pos: string;
  base_form: string;
}

interface AnalysisResultProps {
  tokens: Token[];
  showFurigana: boolean;
  readingStyle: "hiragana" | "katakana" | "romaji";
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({
  tokens,
  showFurigana,
  readingStyle,
}) => {

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        {tokens.map((token, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            <div className="flex items-center space-x-4">

                {containsKanji(token.surface_form) ? (
                  <FuriganaText
                    text={token.surface_form}
                    reading={token.reading}
                    showFurigana={showFurigana}
                    readingStyle={readingStyle}
                  />
                ) : (
                  <span>{token.surface_form}</span>
                )}

              <span className="text-sm text-gray-500">({token.pos})</span>
              {token.base_form !== token.surface_form && (
                <span className="text-sm text-gray-600">
                  基本形: {token.base_form}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>



    </div>
  );
};

export default AnalysisResult;
