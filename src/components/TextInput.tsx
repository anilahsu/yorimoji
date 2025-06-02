"use client";

import React, { useState } from "react";

interface TextInputProps {
  onTextChange: (text: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextChange }) => {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <textarea
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        placeholder="日本語のテキストを入力してください"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextInput;
