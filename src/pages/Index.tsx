import { useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeMessage from "@/components/WelcomeMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const { messages, isTyping, sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-screen gradient-calm">
      <ChatHeader />
      
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6">
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
        </div>
      </ScrollArea>

      <ChatInput onSend={sendMessage} disabled={isTyping} />
    </div>
  );
};

export default Index;
