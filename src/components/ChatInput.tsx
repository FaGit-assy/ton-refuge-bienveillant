import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-background rounded-2xl p-2 shadow-input border border-border/50">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris-moi ce qui te pèse, je suis là pour t'écouter..."
            className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60"
            disabled={disabled}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-11 w-11 rounded-xl gradient-warm border-0 hover:opacity-90 transition-opacity shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Je suis là pour t'écouter et t'accompagner, mais je ne remplace pas un avis médical.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
