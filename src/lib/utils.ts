// Regular expression to match kanji characters
const KANJI_REGEX = /[\u4E00-\u9FFF]/g;

export const containsKanji = (text: string): boolean => {
  return KANJI_REGEX.test(text);
};
