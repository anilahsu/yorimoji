"use client";

import React from "react";
import FuriganaText from "./FuriganaText";

interface WordDetailsProps {
  word: string;
  reading: string;
  meanings: string[];
  partOfSpeech: string[];
  jlpt?: string;
  showFurigana: boolean;
  onClose: () => void;
  readingStyle: "hiragana" | "katakana" | "romaji";
}

const WordDetails: React.FC<WordDetailsProps> = ({
  word,
  reading,
  meanings,
  partOfSpeech,
  jlpt,
  showFurigana,
  onClose,
  readingStyle,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <FuriganaText
              text={word}
              reading={reading}
              showFurigana={showFurigana}
              readingStyle={readingStyle}
            />
            {jlpt && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {jlpt}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              Part of Speech
            </h3>
            <p className="text-gray-700">{partOfSpeech.join(", ")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              Meanings
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {meanings.map((meaning, index) => (
                <li key={index} className="text-gray-700">
                  {meaning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetails;
