import { HomeContent } from './HomeContent';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('初期投稿の取得に失敗しました:', error);
  }

  const initialPosts: Post[] = data ?? [];

  return <HomeContent initialPosts={initialPosts} />;
}
