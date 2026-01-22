import { Heart } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="gradient-message-bot rounded-2xl rounded-tl-sm px-5 py-4 shadow-message">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full gradient-warm flex items-center justify-center">
            <Heart className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Accompagnante
          </span>
        </div>
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-typing-1" />
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-typing-2" />
          <div className="w-2 h-2 rounded-full bg-primary/50 animate-typing-3" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
