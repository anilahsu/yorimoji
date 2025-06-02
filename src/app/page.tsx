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
import { initializeKuroshiro } from "@/lib/kuroshiro";

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
        await Promise.all([initializeKuromoji(), initializeKuroshiro()]);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error("Failed to initialize Japanese analyzers:", error);
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
    <main className="min-h-screen p-8 bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[var(--color-foreground)]">
          Japanese Text Analyzer
        </h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-end items-center">
          <label className="flex items-center space-x-2 text-[var(--color-foreground)]">
            <input
              type="checkbox"
              checked={showFurigana}
              onChange={(e) => setShowFurigana(e.target.checked)}
              className="form-checkbox rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)] dark:bg-gray-700 dark:border-gray-600"
            />
            <span>Show Furigana</span>
          </label>
          <label className="flex items-center space-x-2 text-[var(--color-foreground)]">
            <span>Furigana Style:</span>
            <select
              value={readingStyle}
              onChange={(e) =>
                setReadingStyle(
                  e.target.value as "hiragana" | "katakana" | "romaji"
                )
              }
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
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
