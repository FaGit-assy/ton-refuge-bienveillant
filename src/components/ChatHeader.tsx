import { Heart, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ChatHeader = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 py-4 md:px-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center shadow-soft">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Mon Accompagnante
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-soft" />
              Disponible pour toi
            </p>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-9 h-9 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs text-center">
            <p className="text-sm">
              Je suis une accompagnante virtuelle. Pour toute question médicale, 
              consulte ton équipe soignante.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default ChatHeader;
