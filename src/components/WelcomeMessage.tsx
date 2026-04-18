import { Heart, MessageCircle, Shield, Sparkles } from "lucide-react";

const WelcomeMessage = () => {
  return (
    <div className="text-center max-w-2xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-warm flex items-center justify-center shadow-soft">
        <Heart className="w-10 h-10 text-primary-foreground" />
      </div>
      
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
        Bonjour, je suis NAFY 💕
      </h1>
      
      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
        Je t'accompagne avec douceur sur le cancer du col de l'utérus et le cancer des ovaires.
        Tu peux m'écrire ou cliquer sur le micro pour me parler. 🌸
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5 shadow-message border border-border/30">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3 mx-auto">
            <MessageCircle className="w-5 h-5 text-secondary-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Écoute bienveillante</h3>
          <p className="text-sm text-muted-foreground">Un espace sans jugement pour exprimer tes émotions</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-message border border-border/30">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-3 mx-auto">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Soutien quotidien</h3>
          <p className="text-sm text-muted-foreground">Des encouragements et de la chaleur humaine</p>
        </div>

        <div className="bg-card rounded-2xl p-5 shadow-message border border-border/30">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3 mx-auto">
            <Shield className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Espace sécurisé</h3>
          <p className="text-sm text-muted-foreground">Tes échanges restent confidentiels et privés</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground italic">
        Commence quand tu te sens prête. Je suis là, disponible pour toi. 💕
      </p>
    </div>
  );
};

export default WelcomeMessage;
