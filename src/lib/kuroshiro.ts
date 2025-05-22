import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

type KuroshiroInstance = ReturnType<typeof Kuroshiro>;

let kuroshiro: KuroshiroInstance | null = null;
export const initializeKuroshiro = async () => {
  if (kuroshiro) return kuroshiro;
  kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict/" }));
  return kuroshiro;
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
