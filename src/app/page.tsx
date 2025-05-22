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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeKuromoji();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize Kuromoji:", error);
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
    } catch (error) {
      console.error("Analysis error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Japanese Text Analyzer
        </h1>

        <div className="mb-4 flex justify-end">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFurigana}
              onChange={(e) => setShowFurigana(e.target.checked)}
              className="form-checkbox"
            />
            <span>Show Furigana</span>
          </label>
        </div>

        <TextInput onTextChange={handleTextChange} />

        {tokens.length > 0 && (
          <AnalysisResult tokens={tokens} showFurigana={showFurigana} />
        )}
      </div>
    </main>
  );
}
