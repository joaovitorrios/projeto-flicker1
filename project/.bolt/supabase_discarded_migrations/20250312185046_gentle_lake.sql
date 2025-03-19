-- Criar tabela de perfis
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  cover_url text,
  bio text,
  private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de posts
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de curtidas
CREATE TABLE likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Criar tabela de comentários
CREATE TABLE comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de seguidores
CREATE TABLE follows (
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Perfis públicos são visíveis para todos"
  ON profiles FOR SELECT
  USING (NOT private OR auth.uid() = id);

CREATE POLICY "Usuários podem editar próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para posts
CREATE POLICY "Posts são visíveis para todos"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = posts.user_id
      AND (NOT private OR auth.uid() = posts.user_id)
    )
  );

CREATE POLICY "Usuários podem criar posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para likes
CREATE POLICY "Likes são visíveis para todos"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem curtir"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover próprias curtidas"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para comments
CREATE POLICY "Comentários são visíveis para todos"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem comentar"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios comentários"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para follows
CREATE POLICY "Seguidores são visíveis para todos"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem seguir"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Usuários podem deixar de seguir"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();