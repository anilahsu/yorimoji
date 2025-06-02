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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <FuriganaText
              text={word}
              reading={reading}
              showFurigana={showFurigana}
              readingStyle={readingStyle}
            />
            {jlpt && (
              <span className="ml-2 px-2 py-1 bg-[var(--color-accent)] bg-opacity-20 text-[var(--color-accent)] dark:text-opacity-90 rounded text-sm font-medium">
                {jlpt}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Part of Speech
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {partOfSpeech.join(", ")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Meanings
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {meanings.map((meaning, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
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
