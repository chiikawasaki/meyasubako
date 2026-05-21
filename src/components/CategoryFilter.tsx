'use client';

import { PostInsert } from '@/types/post';

interface CategoryFilterProps {
  selectedCategory: PostInsert['category'] | 'all';
  onCategoryChange: (category: PostInsert['category'] | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { value: 'all' as const, emoji: '🌸', label: 'すべて' },
    { value: '企画案' as const, emoji: '🎯', label: '企画案' },
    { value: '改善案' as const, emoji: '💡', label: '改善案' },
    { value: '質問' as const, emoji: '❓', label: '質問' },
    { value: 'その他' as const, emoji: '💭', label: 'その他' },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.value
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{category.emoji}</span>
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}