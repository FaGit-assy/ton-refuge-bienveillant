import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ content, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in-up",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-message",
          isBot
            ? "gradient-message-bot rounded-tl-sm"
            : "gradient-message-user text-primary-foreground rounded-tr-sm"
        )}
      >
        {isBot && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full gradient-warm flex items-center justify-center">
              <Heart className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Accompagnante
            </span>
          </div>
        )}
        <p className={cn(
          "text-sm md:text-base leading-relaxed whitespace-pre-wrap",
          isBot ? "text-foreground" : "text-primary-foreground"
        )}>
          {content}
        </p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-2",
            isBot ? "text-muted-foreground" : "text-primary-foreground/70"
          )}>
            {timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
