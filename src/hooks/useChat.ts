import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export const useChat = (onBotReply?: (text: string) => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const conversationHistory = useRef<ConversationMessage[]>([]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: generateId(),
      content,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Call the RAG edge function
      const { data, error } = await supabase.functions.invoke("chat-rag", {
        body: {
          message: content,
          conversationHistory: conversationHistory.current,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Erreur de connexion");
      }

      const botResponse = data?.response || "Désolée, je n'ai pas pu répondre. Peux-tu reformuler ? 💕";

      // Update conversation history
      conversationHistory.current = [
        ...conversationHistory.current,
        { role: "user" as const, content },
        { role: "assistant" as const, content: botResponse },
      ].slice(-10); // Keep last 10 messages

      // Add bot message
      const botMessage: Message = {
        id: generateId(),
        content: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      onBotReply?.(botResponse);

    } catch (error) {
      console.error("Chat error:", error);
      
      // Show error toast
      toast.error("Erreur de connexion. Réessaie dans quelques instants.");

      // Add fallback message
      const errorMessage: Message = {
        id: generateId(),
        content: "Désolée, j'ai rencontré un petit souci technique. Peux-tu réessayer ? 🌸",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [onBotReply]);

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
