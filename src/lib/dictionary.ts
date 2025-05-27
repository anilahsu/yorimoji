export interface DictionaryEntry {
  word: string;
  reading: string;
  meanings: string[];
  partOfSpeech: string[];
  jlpt?: string;
}

interface JishoSense {
  english_definitions: string[];
  parts_of_speech: string[];
}

interface JishoJapanese {
  word?: string;
  reading: string;
}

interface JishoResult {
  japanese: JishoJapanese[];
  senses: JishoSense[];
  jlpt?: string[];
  is_common?: boolean;
}

interface JishoAPIResponse {
  data: JishoResult[];
}

export const searchWord = async (
  word: string,
  partOfSpeech?: string
): Promise<DictionaryEntry | null> => {
  try {
    // Using Jisho.org API
    const response = await fetch(
      `/api/jisho?keyword=${encodeURIComponent(word)}&pos=${encodeURIComponent(
        partOfSpeech || ""
      )}`
    );
    const data: JishoAPIResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    // If we have multiple results, try to find the best match
    if (data.data.length > 1) {
      console.log("data", data.data);
      console.log(
        `Debug: Found ${data.data.length} results for "${word}" with POS "${partOfSpeech}"`
      );

      // Map common Japanese POS tags to English equivalents for better matching
      const posMapping: { [key: string]: string[] } = {
        感動詞: ["interjection", "exclamation"],
        助動詞: ["auxiliary verb", "auxiliary"],
        動詞: ["verb", "godan verb", "ichidan verb"],
        形容詞: ["adjective", "i-adjective"],
        名詞: ["noun"],
        副詞: ["adverb"],
        連体詞: ["pre-noun adjectival"],
        接続詞: ["conjunction"],
        助詞: ["particle"],
        記号: ["symbol"],
        補助記号: ["auxiliary symbol"],
        接頭詞: ["prefix"],
      };

      const targetPosTypes = partOfSpeech
        ? posMapping[partOfSpeech] || [partOfSpeech.toLowerCase()]
        : [];
      console.log(`Debug: Target POS types:`, targetPosTypes);

      // Score each result based on multiple factors
      const scoredResults = data.data.map((result, index) => {
        let score = 0;
        const resultWord =
          result.japanese[0].word || result.japanese[0].reading;

        // Prefer results that are marked as common
        if (result.is_common) {
          score += 100;
        }

        // Prefer results with JLPT levels (more commonly studied words)
        if (result.jlpt && result.jlpt.length > 0) {
          score += 50;
        }

        // If searching for hiragana word, strongly prefer hiragana-only results
        const isSearchTermHiragana = /^[\u3041-\u3096]+$/.test(word);
        // If searching for a hiragana word (often a base form), strongly prefer results
        // where the primary reading matches the search word exactly.
        if (isSearchTermHiragana && result.japanese[0].reading === word) {
          score += 300; // Very high priority for exact reading match for hiragana search terms
        }

        // If we have part of speech info, prefer matching POS
        if (partOfSpeech && targetPosTypes.length > 0) {
          const allPosForResult = result.senses.flatMap(
            (sense) => sense.parts_of_speech
          );
          console.log(`Debug: All POS for "${resultWord}":`, allPosForResult);

          const hasMatchingPos = result.senses.some((sense) =>
            sense.parts_of_speech.some((pos) =>
              targetPosTypes.some(
                (targetPos) =>
                  pos.toLowerCase().includes(targetPos) ||
                  targetPos.includes(pos.toLowerCase())
              )
            )
          );
          if (hasMatchingPos) {
            score += 400; // Greatly increased priority for POS match
            console.log(`Debug: POS match found for "${resultWord}"`);
          }
        }

        // Prefer results that appear earlier in the API response (generally more relevant)
        score += (data.data.length - index) * 10;

        console.log(
          `Debug: Result ${index}: "${resultWord}" - Score: ${score}, is_common: ${result.is_common}, POS: ${result.senses[0].parts_of_speech}`
        );

        return { result, score, index };
      });
      console.log(scoredResults, "scoredResults");
      // Sort by score (highest first) and pick the best match
      scoredResults.sort((a, b) => b.score - a.score);
      const bestMatch = scoredResults[0].result;
      const bestWord =
        bestMatch.japanese[0].word || bestMatch.japanese[0].reading;
      console.log(
        `Debug: Selected "${bestWord}" with score ${scoredResults[0].score}`
      );

      // Determine the display word: prefer the original hiragana search term if it matches the reading
      let displayWord =
        bestMatch.japanese[0].word || bestMatch.japanese[0].reading;
      if (
        /^[\u3041-\u3096]+$/.test(word) &&
        bestMatch.japanese[0].reading === word
      ) {
        displayWord = bestMatch.japanese[0].reading;
      }

      return {
        word: displayWord,
        reading: bestMatch.japanese[0].reading,
        meanings: bestMatch.senses.map((sense) =>
          sense.english_definitions.join(", ")
        ),
        partOfSpeech: bestMatch.senses[0].parts_of_speech || [],
        jlpt: bestMatch.jlpt ? bestMatch.jlpt[0] : undefined,
      };
    }

    // Fall back to the first result if only one result or no specific match needed
    const result = data.data[0];
    let displayWordSingle =
      result.japanese[0].word || result.japanese[0].reading;
    if (
      /^[\u3041-\u3096]+$/.test(word) &&
      result.japanese[0].reading === word
    ) {
      displayWordSingle = result.japanese[0].reading;
    }
    return {
      word: displayWordSingle,
      reading: result.japanese[0].reading,
      meanings: result.senses.map((sense) =>
        sense.english_definitions.join(", ")
      ),
      partOfSpeech: result.senses[0].parts_of_speech || [],
      jlpt: result.jlpt ? result.jlpt[0] : undefined,
    };
  } catch (error) {
    console.error("Dictionary lookup error:", error);
    return null;
  }
};

export const getWordDetails = async (
  word: string
): Promise<DictionaryEntry[]> => {
  try {
    const response = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        word
      )}`
    );
    const data: JishoAPIResponse = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((result) => ({
      word: result.japanese[0].word || result.japanese[0].reading,
      reading: result.japanese[0].reading,
      meanings: result.senses.map((sense) =>
        sense.english_definitions.join(", ")
      ),
      partOfSpeech: result.senses[0].parts_of_speech || [],
      jlpt: result.jlpt ? result.jlpt[0] : undefined,
    }));
  } catch (error) {
    console.error("Dictionary lookup error:", error);
    return [];
  }
};
