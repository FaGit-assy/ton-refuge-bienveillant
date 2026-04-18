import { useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeMessage from "@/components/WelcomeMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    startListening,
    stopListening,
    speak,
  } = useVoice();

  const { messages, isTyping, sendMessage } = useChat((reply) => speak(reply));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((finalText) => sendMessage(finalText));
    }
  };

  return (
    <div className="flex flex-col h-screen gradient-calm">
      <ChatHeader />

      <ScrollArea className="flex-1" ref={scrollRef}>
        <main className="max-w-3xl mx-auto py-6">
          {messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="flex flex-col gap-4 px-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </main>
      </ScrollArea>

      <ChatInput
        onSend={sendMessage}
        disabled={isTyping}
        isListening={isListening}
        voiceSupported={voiceSupported}
        onToggleVoice={handleToggleVoice}
        liveTranscript={transcript}
      />
    </div>
  );
};

export default Index;
