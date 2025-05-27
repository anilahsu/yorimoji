"use client";

import React, { useState } from "react";
import FuriganaText from "./FuriganaText";
import WordDetails from "./WordDetails";
import { searchWord } from "@/lib/dictionary";
import { containsKanji } from "@/lib/utils";
import { DictionaryEntry } from "@/lib/dictionary";

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
  const [selectedWord, setSelectedWord] = useState<DictionaryEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleWordClick = async (token: Token) => {
    setIsLoading(true);
    try {
      let wordDetails = await searchWord(token.base_form, token.pos);
      if (!wordDetails && token.base_form !== token.surface_form) {
        wordDetails = await searchWord(token.surface_form, token.pos);
      }
      if (wordDetails) {
        setSelectedWord(wordDetails);
      }
    } catch (error) {
      console.error("Error fetching word details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        {tokens.map((token, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleWordClick(token)}
                className="hover:bg-gray-100 rounded px-2 py-1 transition-colors"
              >
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
              </button>
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

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4">
            Loading dictionary details...
          </div>
        </div>
      )}

      {selectedWord && (
        <WordDetails
          word={selectedWord.word}
          reading={selectedWord.reading}
          meanings={selectedWord.meanings}
          partOfSpeech={selectedWord.partOfSpeech}
          jlpt={selectedWord.jlpt}
          showFurigana={showFurigana}
          onClose={() => setSelectedWord(null)}
          readingStyle={readingStyle}
        />
      )}
    </div>
  );
};

export default AnalysisResult;
