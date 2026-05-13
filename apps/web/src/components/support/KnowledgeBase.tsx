"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, ThumbsUp, ThumbsDown, Eye, ChevronRight, Home } from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  helpful_count: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  article_count: number;
}

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [votedArticles, setVotedArticles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCategories();
    fetchPopularArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchArticlesByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      searchArticles();
    } else if (searchQuery.length === 0) {
      if (selectedCategory) {
        fetchArticlesByCategory(selectedCategory);
      } else {
        fetchPopularArticles();
      }
    }
  }, [searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/v1/support/knowledge-base/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPopularArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/support/knowledge-base/articles?sort=popular&limit=10");
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/support/knowledge-base/articles?category=${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/support/knowledge-base/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Failed to search articles");
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error searching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewArticle = async (article: Article) => {
    setSelectedArticle(article);

    // Track view
    try {
      await fetch(`/api/v1/support/knowledge-base/articles/${article.id}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  const voteHelpful = async (articleId: string, helpful: boolean) => {
    try {
      await fetch(`/api/v1/support/knowledge-base/articles/${articleId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful }),
      });

      setVotedArticles({ ...votedArticles, [articleId]: helpful });

      // Update article helpful count
      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle({
          ...selectedArticle,
          helpful_count: selectedArticle.helpful_count + (helpful ? 1 : 0),
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getRelatedArticles = () => {
    if (!selectedArticle) return [];
    return articles
      .filter((a) => a.id !== selectedArticle.id && a.category === selectedArticle.category)
      .slice(0, 3);
  };

  // Article View
  if (selectedArticle) {
    const relatedArticles = getRelatedArticles();

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => {
              setSelectedArticle(null);
              setSelectedCategory(null);
            }}
            className="hover:text-blue-600 flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Knowledge Base
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="capitalize">{selectedArticle.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{selectedArticle.title}</span>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {selectedArticle.views} views
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {selectedArticle.helpful_count} found helpful
            </div>
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
          </div>

          {/* Was this helpful? */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center font-medium mb-4">Was this article helpful?</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => voteHelpful(selectedArticle.id, true)}
                disabled={votedArticles[selectedArticle.id] !== undefined}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  votedArticles[selectedArticle.id] === true
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp className="w-5 h-5" />
                Yes
              </button>
              <button
                onClick={() => voteHelpful(selectedArticle.id, false)}
                disabled={votedArticles[selectedArticle.id] !== undefined}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  votedArticles[selectedArticle.id] === false
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsDown className="w-5 h-5" />
                No
              </button>
            </div>
            {votedArticles[selectedArticle.id] !== undefined && (
              <p className="text-center text-sm text-gray-600 mt-4">
                Thank you for your feedback!
              </p>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">Related Articles</h3>
            <div className="space-y-3">
              {relatedArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => viewArticle(article)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-blue-600 hover:text-blue-700">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {article.views} views • {article.helpful_count} helpful
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Category & Article List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Knowledge Base</h2>
        <p className="text-gray-600">Find answers to common questions</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedCategory === category.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">
                {category.article_count} article{category.article_count !== 1 ? "s" : ""}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Articles */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : "Popular Articles"}
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {articles.map((article) => (
              <button
                key={article.id}
                onClick={() => viewArticle(article)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-medium text-blue-600 hover:text-blue-700 mb-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="capitalize">{article.category}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {article.helpful_count}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
