import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Web Speech API types (not in default TS lib)
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: { [index: number]: { transcript: string }; isFinal: boolean };
    length: number;
  };
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (e: SpeechRecognitionEvent) => void;
  onerror: (e: any) => void;
  onend: () => void;
}

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const startListening = useCallback(
    (onFinal: (text: string) => void) => {
      if (!isSupported) {
        toast.error("Ton navigateur ne supporte pas la reconnaissance vocale 🌸");
        return;
      }

      const SR =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition: SpeechRecognitionInstance = new SR();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = true;

      let finalText = "";

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interim += res[0].transcript;
        }
        setTranscript(finalText + interim);
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error:", e);
        if (e.error === "not-allowed") {
          toast.error("Autorise l'accès au micro pour me parler 💕");
        } else if (e.error !== "no-speech" && e.error !== "aborted") {
          toast.error("Petit souci avec le micro, réessaie 🌸");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (finalText.trim()) {
          onFinal(finalText.trim());
          setTranscript("");
        }
      };

      recognitionRef.current = recognition;
      setTranscript("");
      setIsListening(true);
      recognition.start();
    },
    [isSupported]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Strip emojis and markdown for cleaner reading
    const clean = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/[*_`#]/g, "")
      .trim();

    if (!clean) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Try to pick a French female voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice =
      voices.find((v) => v.lang.startsWith("fr") && /female|femme|amelie|audrey|marie/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    // Preload voices
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    isSupported: !!isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
};
