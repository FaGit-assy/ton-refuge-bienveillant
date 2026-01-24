-- Créer la table pour stocker la base de connaissances
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS pour lecture publique (pas besoin d'auth pour lire les connaissances)
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge base is publicly readable" 
ON public.knowledge_base 
FOR SELECT 
USING (true);

-- Index pour recherche textuelle
CREATE INDEX idx_knowledge_base_keywords ON public.knowledge_base USING GIN(keywords);
CREATE INDEX idx_knowledge_base_question ON public.knowledge_base USING GIN(to_tsvector('french', question));
CREATE INDEX idx_knowledge_base_answer ON public.knowledge_base USING GIN(to_tsvector('french', answer));