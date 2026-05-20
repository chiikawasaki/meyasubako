-- postsテーブルを作成（既に作成済みの場合はスキップ）
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  mood text,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS（Row Level Security）を無効化して匿名アクセスを許可
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- または、RLSを有効化しつつ匿名ユーザーにも読み書き権限を付与する場合：
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーが投稿を読み取れるようにするポリシー
-- CREATE POLICY "投稿は誰でも読み取り可能" ON posts
--   FOR SELECT 
--   USING (true);

-- 匿名ユーザーが新規投稿できるようにするポリシー
-- CREATE POLICY "誰でも投稿可能" ON posts
--   FOR INSERT 
--   WITH CHECK (true);

-- 匿名ユーザーがいいね数を更新できるようにするポリシー
-- CREATE POLICY "誰でもいいね更新可能" ON posts
--   FOR UPDATE 
--   USING (true)
--   WITH CHECK (true);