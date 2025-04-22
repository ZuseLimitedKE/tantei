import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import type { Message } from "./chat-drawer";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAI = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex items-start space-x-2",
        isAI ? "flex-row" : "flex-row-reverse space-x-reverse",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
          isAI ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isAI ? "bg-muted" : "bg-primary text-primary-foreground",
        )}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
