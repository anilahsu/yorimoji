"use client";

import { useEffect, useState } from "react";
import TextInput from "@/components/TextInput";
import AnalysisResult from "@/components/AnalysisResult";
import {
  initializeKuromoji,
  analyzeText,
  formatTokens,
  Token,
} from "@/lib/kuromoji";

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showFurigana, setShowFurigana] = useState(true);
  const [readingStyle, setReadingStyle] = useState<
    "hiragana" | "katakana" | "romaji"
  >("hiragana");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeKuromoji();
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error("Failed to initialize Kuromoji:", error);
        setError(
          "Failed to initialize the Japanese analyzer. Please refresh the page."
        );
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleTextChange = (text: string) => {
    if (!text.trim()) {
      setTokens([]);
      return;
    }

    try {
      const analyzedTokens = analyzeText(text);
      setTokens(formatTokens(analyzedTokens));
      setError(null);
    } catch (error) {
      console.error("Analysis error:", error);
      setError("Error analyzing text. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading Japanese analyzer...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Japanese Text Analyzer
        </h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-end items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFurigana}
              onChange={(e) => setShowFurigana(e.target.checked)}
              className="form-checkbox"
            />
            <span>Show Furigana</span>
          </label>
          <label className="flex items-center space-x-2">
            <span>Furigana Style:</span>
            <select
              value={readingStyle}
              onChange={(e) =>
                setReadingStyle(
                  e.target.value as "hiragana" | "katakana" | "romaji"
                )
              }
              className="border rounded px-2 py-1"
            >
              <option value="hiragana">Hiragana</option>
              <option value="katakana">Katakana</option>
              <option value="romaji">Romaji</option>
            </select>
          </label>
        </div>

        <TextInput onTextChange={handleTextChange} />

        {tokens.length > 0 && (
          <AnalysisResult
            tokens={tokens}
            showFurigana={showFurigana}
            readingStyle={readingStyle}
          />
        )}
      </div>
    </main>
  );
}
