export type Post = {
  id: string;
  category: "企画案" | "改善案" | "質問" | "その他";
  title: string;
  body: string;
  mood: "やってみたい" | "困ってる" | "相談したい" | "ありがとう" | null;
  likes: number;
  created_at: string;
};

export type PostInsert = Omit<Post, 'id' | 'likes' | 'created_at'>;