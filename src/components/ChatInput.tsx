import { useState, KeyboardEvent } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isListening?: boolean;
  voiceSupported?: boolean;
  onToggleVoice?: () => void;
  liveTranscript?: string;
}

const ChatInput = ({
  onSend,
  disabled,
  isListening,
  voiceSupported,
  onToggleVoice,
  liveTranscript,
}: ChatInputProps) => {
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

  const displayValue = isListening && liveTranscript ? liveTranscript : message;

  return (
    <div className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-background rounded-2xl p-2 shadow-input border border-border/50">
          <Textarea
            value={displayValue}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "🎤 Je t'écoute..."
                : "Écris-moi ou clique sur le micro pour me parler..."
            }
            className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60"
            disabled={disabled || isListening}
            rows={1}
          />
          {voiceSupported && (
            <Button
              onClick={onToggleVoice}
              disabled={disabled}
              size="icon"
              variant="ghost"
              aria-label={isListening ? "Arrêter le micro" : "Parler à NAFY"}
              className={cn(
                "h-11 w-11 rounded-xl shrink-0 transition-all",
                isListening
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20 animate-pulse"
                  : "hover:bg-muted"
              )}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled || isListening}
            size="icon"
            aria-label="Envoyer le message"
            className="h-11 w-11 rounded-xl gradient-warm border-0 hover:opacity-90 transition-opacity shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          NAFY t'accompagne sur le cancer du col de l'utérus et des ovaires. Elle ne remplace pas un avis médical.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
