import { HomeContent } from './HomeContent';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  console.log('=== Server-side page.tsx 実行開始 ===');
  console.log('リクエスト時刻:', new Date().toISOString());
  
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('初期投稿の取得に失敗しました:', error);
  }

  const initialPosts: Post[] = data ?? [];
  
  console.log('取得した投稿数:', initialPosts.length);
  console.log('最新投稿のタイトル:', initialPosts[0]?.title || 'なし');
  console.log('最新投稿の作成日時:', initialPosts[0]?.created_at || 'なし');
  console.log('=== Server-side page.tsx 実行終了 ===');

  return <HomeContent initialPosts={initialPosts} />;
}
