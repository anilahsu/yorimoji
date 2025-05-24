import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

type KuroshiroInstance = ReturnType<typeof Kuroshiro>;

let kuroshiro: KuroshiroInstance | null = null;
let initializationPromise: Promise<KuroshiroInstance> | null = null;

export const initializeKuroshiro = async (): Promise<KuroshiroInstance> => {
  if (kuroshiro) return kuroshiro;

  // If already initializing, return the existing promise
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      kuroshiro = new Kuroshiro();
      await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict/" }));
      return kuroshiro;
    } catch (error) {
      // Reset on error so we can try again
      initializationPromise = null;
      kuroshiro = null;
      throw error;
    }
  })();

  return initializationPromise;
};

export const isKuroshiroReady = (): boolean => {
  return kuroshiro !== null;
};

export const toFuriganaHTML = async (
  text: string,
  readingStyle: "hiragana" | "katakana" | "romaji"
) => {
  if (!kuroshiro) {
    await initializeKuroshiro();
  }
  return kuroshiro!.convert(text, {
    to: readingStyle,
    mode: "furigana",
    romajiSystem: "passport",
  });
};
