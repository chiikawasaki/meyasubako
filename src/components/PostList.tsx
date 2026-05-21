'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/post';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onLike: (postId: string) => void;
}

export function PostList({ posts, loading, onLike }: PostListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    if (!mounted) return ''; // Hydrationエラーを避けるため、マウント前は空文字
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const getCategoryColor = (category: Post['category']) => {
    switch (category) {
      case '企画案':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case '改善案':
        return 'bg-green-50 border-green-200 text-green-700';
      case '質問':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'その他':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getMoodEmoji = (mood: Post['mood']) => {
    switch (mood) {
      case 'やってみたい':
        return '✨';
      case '困ってる':
        return '😅';
      case '相談したい':
        return '🤝';
      case 'ありがとう':
        return '💕';
      default:
        return '';
    }
  };

  const getMoodColor = (mood: Post['mood']) => {
    switch (mood) {
      case 'やってみたい':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case '困ってる':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case '相談したい':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'ありがとう':
        return 'bg-pink-50 border-pink-200 text-pink-700';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">まだ投稿がありません</h3>
        <p className="text-gray-500">最初の投稿をしてみませんか？</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-shadow duration-300"
        >
          {/* ヘッダー */}
          <header className="flex flex-wrap items-center gap-3 mb-4">
            {/* カテゴリバッジ */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(post.category)}`}>
              {post.category === '企画案' && '🎯'}
              {post.category === '改善案' && '💡'}
              {post.category === '質問' && '❓'}
              {post.category === 'その他' && '💭'}
              <span className="ml-1">{post.category}</span>
            </span>

            {/* 気持ちタグ */}
            {post.mood && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(post.mood)}`}>
                <span className="mr-1">{getMoodEmoji(post.mood)}</span>
                {post.mood}
              </span>
            )}

            {/* 投稿日時 */}
            <time className="text-sm text-gray-500 ml-auto">
              {formatDate(post.created_at)}
            </time>
          </header>

          {/* タイトル */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
            {post.title}
          </h3>

          {/* 本文 */}
          <div className="text-gray-600 mb-4 whitespace-pre-line">
            {post.body.length > 200 ? (
              <div>
                <p>{post.body.substring(0, 200)}...</p>
                <details className="mt-2">
                  <summary className="text-pink-500 cursor-pointer hover:text-pink-600 text-sm">
                    続きを読む
                  </summary>
                  <p className="mt-2">{post.body}</p>
                </details>
              </div>
            ) : (
              <p>{post.body}</p>
            )}
          </div>

          {/* フッター */}
          <footer className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">💬</span>
              匿名投稿
            </div>

            {/* いいねボタン */}
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 
                         text-pink-600 px-4 py-2 rounded-full border border-pink-200 hover:border-pink-300 
                         transition-all duration-200 focus:ring-2 focus:ring-pink-300 focus:ring-offset-1 group"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">💖</span>
              <span className="font-medium">{post.likes}</span>
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}