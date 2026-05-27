'use client';

import { useState, useMemo } from 'react';
import { PostForm } from '@/components/PostForm';
import { PostList } from '@/components/PostList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Post, PostInsert } from '@/types/post';
import { supabase } from '@/lib/supabase';

interface HomeContentProps {
  initialPosts: Post[];
}

const sortPostsByCreatedAt = (items: Post[]): Post[] =>
  [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

export function HomeContent({ initialPosts }: HomeContentProps) {
  console.log('=== HomeContent コンポーネント初期化 ===');
  console.log('初期投稿数:', initialPosts.length);
  console.log('初期投稿の最新タイトル:', initialPosts[0]?.title || 'なし');
  console.log('初期投稿の最新作成日時:', initialPosts[0]?.created_at || 'なし');
  
  const [posts, setPosts] = useState<Post[]>(sortPostsByCreatedAt(initialPosts));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PostInsert['category'] | 'all'>('all');

  const refetchPosts = async (): Promise<void> => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Client-side refetchPosts 実行開始 ===');
      console.log('リクエスト時刻:', new Date().toISOString());
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('再取得した投稿数:', data?.length || 0);
      console.log('最新投稿のタイトル:', data?.[0]?.title || 'なし');
      console.log('最新投稿の作成日時:', data?.[0]?.created_at || 'なし');
      console.log('=== Client-side refetchPosts 実行終了 ===');
      
      setPosts(sortPostsByCreatedAt(data || []));
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError(`投稿の取得に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSuccess = async (newPost?: Post): Promise<void> => {
    if (newPost) {
      setPosts((prevPosts) =>
        sortPostsByCreatedAt([
          newPost,
          ...prevPosts.filter((post) => post.id !== newPost.id),
        ])
      );
    }

    await refetchPosts();
  };

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleLike = async (postId: string) => {
    try {
      const target = posts.find((p) => p.id === postId);
      if (!target) return;

      const { error } = await supabase
        .from('posts')
        .update({ likes: target.likes + 1 })
        .eq('id', postId);

      if (error) throw error;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (err) {
      console.error('いいねの更新に失敗しました:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mb-4 shadow-lg">
            <span className="text-white text-2xl">💌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">匿名目安箱</h1>
          <p className="text-gray-600">みんなの声を聞かせてください</p>
        </header>

        <div className="mb-12">
          <PostForm onPostSuccess={handlePostSuccess} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-pink-400 mr-2">🌸</span>
            みんなの投稿
          </h2>

          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <PostList posts={filteredPosts} loading={loading} onLike={handleLike} />
        </div>
      </div>
    </div>
  );
}
