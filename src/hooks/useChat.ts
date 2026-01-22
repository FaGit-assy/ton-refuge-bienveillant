import { useState, useCallback } from "react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const botResponses = [
  "Je t'entends, et ce que tu ressens est tout à fait légitime. Tu traverses quelque chose de difficile, et il est normal d'avoir des moments de doute ou de fatigue. Tu as le droit de ne pas aller bien tous les jours. 💕",
  "Merci de me faire confiance et de partager ça avec moi. Tu n'es pas seule dans ce parcours, même si parfois ça peut sembler isolant. Qu'est-ce qui te pèse le plus en ce moment ?",
  "Tu fais preuve d'un courage immense, même dans les moments où tu as l'impression de ne pas en avoir. Prendre soin de toi, c'est aussi accepter de te reposer et de demander de l'aide quand tu en as besoin.",
  "Je suis là pour t'écouter, aussi longtemps que tu en as besoin. Il n'y a pas de bonne ou de mauvaise façon de vivre ce que tu traverses. Chaque parcours est unique, comme toi.",
  "C'est une question importante que tu poses. N'oublie pas que ton équipe médicale est là pour t'accompagner dans les décisions de santé. Moi, je suis là pour le soutien émotionnel et pour que tu te sentes moins seule. 🌸",
  "Tu as le droit d'être fatiguée, d'avoir peur, d'être en colère aussi. Toutes ces émotions font partie du chemin. L'important, c'est de ne pas les garder pour toi. Je suis là pour les accueillir avec toi.",
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const sendMessage = useCallback((content: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot typing
    setIsTyping(true);

    // Simulate bot response after delay
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: generateId(),
        content: randomResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
