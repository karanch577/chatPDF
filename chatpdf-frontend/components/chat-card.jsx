import { User, Bot } from "lucide-react";
import React from "react";
import TypingEffect from "./typing-effect";
import { Skeleton } from "./ui/skeleton";

function ChatCard({ isUser, content, showTypingEffect }) {
  return (
    <div className="flex gap-2 mt-2">
      <div className="icon">
        <div className="border rounded-full p-1.5">
          {isUser ? (
            <User className="w-3.5 h-3.5" />
          ) : (
            <Bot className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
      <div className={`content ${!isUser ? "text-streamer" : ""}`}>
        <h4 className="text-semibold">{isUser ? "You" : "ChatPDF"}</h4>
        <div>
          {/* if the content is empty string show the shimmer effect */}
          {!isUser && !content && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          )}
          {!isUser && showTypingEffect && content ? (
            <TypingEffect content={content} />
          ) : (
            <p className={`${content === "failed" ? "text-red-500" : ""}`}>
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
