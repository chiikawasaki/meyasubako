"use client";

import { useState } from "react";
import { Post, PostInsert } from "@/types/post";
import { supabase } from "@/lib/supabase";

interface CategoryDropdownProps {
  value: PostInsert["category"];
  onChange: (value: PostInsert["category"]) => void;
}

function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { value: "企画案", emoji: "🎯", label: "企画案" },
    { value: "改善案", emoji: "💡", label: "改善案" },
    { value: "質問", emoji: "❓", label: "質問" },
    { value: "その他", emoji: "💭", label: "その他" },
  ] as const;

  const selectedCategory = categories.find((cat) => cat.value === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        カテゴリ <span className="text-pink-500">*</span>
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex w-full justify-between gap-x-1.5 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-pink-300 transition-colors"
        >
          <span className="flex items-center">
            <span className="mr-2">{selectedCategory?.emoji}</span>
            {selectedCategory?.label}
          </span>
          <svg
            className={`-mr-1 h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            {/* オーバーレイ */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            {/* ドロップダウンメニュー */}
            <div className="absolute right-0 z-20 mt-2 w-full origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition transition-opacity">
              <div className="py-1">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => {
                      onChange(category.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2 text-sm text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                      value === category.value
                        ? "bg-pink-50 text-pink-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface PostFormProps {
  onPostSuccess: (newPost?: Post) => Promise<void>;
}

export function PostForm({ onPostSuccess }: PostFormProps) {
  const [formData, setFormData] = useState<PostInsert>({
    category: "企画案",
    title: "",
    body: "",
    mood: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.body.trim()) {
      setError("本文は必須です");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: insertedPost, error } = await supabase
        .from("posts")
        .insert([formData])
        .select("*")
        .single();

      if (error) throw error;

      setFormData({
        category: "企画案",
        title: "",
        body: "",
        mood: null,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      await onPostSuccess(insertedPost);
    } catch (err) {
      console.error("投稿に失敗しました:", err);
      setError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = <K extends keyof PostInsert>(
    field: K,
    value: PostInsert[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">✉️</span>
        <h2 className="text-xl font-semibold text-gray-800">投稿フォーム</h2>
      </div>

      {showSuccess && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 text-pink-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <span className="mr-2">🌸</span>
          投稿ありがとう！みんなで素敵な活動にしていきましょう
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* カテゴリ選択 */}
        <CategoryDropdown
          value={formData.category}
          onChange={(value) => handleChange("category", value)}
        />

        {/* 気持ちタグ選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            気持ちタグ
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                {
                  value: "やってみたい",
                  emoji: "",
                  color: "bg-yellow-50 border-yellow-200 text-yellow-700",
                },
                {
                  value: "困ってる",
                  emoji: "",
                  color: "bg-blue-50 border-blue-200 text-blue-700",
                },
                {
                  value: "相談したい",
                  emoji: "",
                  color: "bg-green-50 border-green-200 text-green-700",
                },
                {
                  value: "ありがとう",
                  emoji: "",
                  color: "bg-pink-50 border-pink-200 text-pink-700",
                },
              ] as const
            ).map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() =>
                  handleChange(
                    "mood",
                    formData.mood === mood.value ? null : mood.value,
                  )
                }
                className={`p-3 border rounded-lg text-sm font-medium transition-all hover:shadow-sm ${
                  formData.mood === mood.value
                    ? `${mood.color} shadow-sm`
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-1">{mood.emoji}</span>
                {mood.value}
              </button>
            ))}
          </div>
        </div>


        {/* 本文 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            本文 <span className="text-pink-500">*</span>
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => handleChange("body", e.target.value)}
            placeholder="詳しい内容を入力してください"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-colors resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.body.length}/1000文字
          </p>
        </div>

        {/* 注意書き */}
        <div className="bg-pink-50 border border-pink-100 rounded-lg p-4">
          <div className="flex items-center">
            <p className="text-pink-400 mr-2">🌼</p>
            <p className="text-sm text-pink-700">
              みんなが楽しめるように誰かを傷つける内容や個人を責める投稿は控えてください。
            </p>
          </div>
        </div>

        {/* 投稿ボタン */}
        <button
          type="submit"
          disabled={
            isSubmitting || !formData.body.trim()
          }
          className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-medium py-3 px-6 rounded-lg 
                     hover:from-pink-500 hover:to-rose-500 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              投稿中...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">💌</span>
              投稿する
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
