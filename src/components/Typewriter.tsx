import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export default function Typewriter({
  words = ["I build beautiful interfaces", "I craft clean codebases"],
  typingSpeed = 80,
  deletingSpeed = 45,
  delayBetweenWords = 2000,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex % words.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    // Handles state Transitions
    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), delayBetweenWords);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => prev + 1);
    }

    return () => clearTimeout(timer);
  }, [currentWordIndex, currentText, isDeleting, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span id="typewriter-container" className="inline-block font-mono font-medium min-h-[1.5em]">
      <span>{currentText}</span>
      <span
        id="typewriter-cursor"
        className="inline-block ml-1 animate-[pulse_1s_infinite] font-sans font-light text-brand text-opacity-100"
      >
        |
      </span>
    </span>
  );
}
