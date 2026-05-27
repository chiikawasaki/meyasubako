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

export function HomeContent({ initialPosts }: HomeContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PostInsert['category'] | 'all'>('all');

  const refetchPosts = async (): Promise<void> => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError(`投稿の取得に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
    } finally {
      setLoading(false);
    }
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
          <PostForm onPostSuccess={refetchPosts} />
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
