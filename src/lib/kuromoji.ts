import * as kuromoji from "kuromoji";

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

export const initializeKuromoji = async (): Promise<void> => {
  if (tokenizer) return;

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "/dict/" }).build((err, _tokenizer) => {
      if (err) {
        reject(err);
        return;
      }
      tokenizer = _tokenizer;
      resolve();
    });
  });
};

export const analyzeText = (text: string) => {
  if (!tokenizer) {
    throw new Error("Kuromoji tokenizer not initialized");
  }

  return tokenizer.tokenize(text);
};

export interface Token {
  surface_form: string;
  reading: string;
  pos: string;
  base_form: string;
}

export const formatTokens = (tokens: kuromoji.IpadicFeatures[]): Token[] => {
  return tokens.map((token) => ({
    surface_form: token.surface_form,
    reading: token.reading || "",
    pos: token.pos,
    base_form: token.basic_form || token.surface_form,
  }));
};
