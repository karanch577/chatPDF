import React, { useState, useEffect, useRef } from "react";

const TypingEffect = ({ content }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      if (index < content.length) {
        const timeoutId = setTimeout(() => {
          setDisplayedText((prev) => prev + content.charAt(index));
          setIndex((prev) => prev + 1);
        }, 30); 
        return () => clearTimeout(timeoutId);
      } else {
        hasMounted.current = true;
      }
    }
  }, [index, content]);

  useEffect(() => {
    // Reset the text and index only on content change if it hasn't mounted before
    if (!hasMounted.current) {
      setDisplayedText("");
      setIndex(0);
    }
  }, [content]);

  return (
    <div className="typing-container">
      <span className="dynamic-content">{displayedText}</span>
    </div>
  );
};

export default TypingEffect;
