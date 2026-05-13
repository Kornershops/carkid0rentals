"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, HelpCircle, TrendingUp } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
}

interface FAQCategory {
  name: string;
  icon: string;
  faqs: FAQ[];
}

export default function FAQSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFAQs();
    fetchPopularSearches();
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/support/faqs");
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      const data = await response.json();
      
      // Group FAQs by category
      const grouped = data.faqs.reduce((acc: Record<string, FAQ[]>, faq: FAQ) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      }, {});

      const categoryIcons: Record<string, string> = {
        booking: "📅",
        payment: "💳",
        vehicle: "🚗",
        account: "👤",
        general: "📝",
      };

      const categoriesData = Object.entries(grouped).map(([name, faqs]) => ({
        name,
        icon: categoryIcons[name] || "❓",
        faqs: faqs as FAQ[],
      }));

      setCategories(categoriesData);
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await fetch("/api/v1/support/faqs/popular-searches");
      if (!response.ok) throw new Error("Failed to fetch popular searches");
      const data = await response.json();
      setPopularSearches(data.searches || []);
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `/api/v1/support/faqs/search?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setSuggestions(data.faqs || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const loadSearchHistory = () => {
    const history = localStorage.getItem("faq_search_history");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const saveSearchHistory = (query: string) => {
    const updated = [query, ...searchHistory.filter((q) => q !== query)].slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem("faq_search_history", JSON.stringify(updated));
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchFAQs();
      return;
    }

    setSearchQuery(query);
    saveSearchHistory(query);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/v1/support/faqs/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search FAQs");
      const data = await response.json();
      setFaqs(data.faqs || []);
      setSuggestions([]);
    } catch (error) {
      console.error("Error searching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);

    // Track view
    if (expandedFAQ !== faqId) {
      fetch(`/api/v1/support/faqs/${faqId}/view`, { method: "POST" }).catch(console.error);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    fetchFAQs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600">Quick answers to common questions</p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery);
              }
            }}
            placeholder="Search FAQs..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Autocomplete Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((faq) => (
              <button
                key={faq.id}
                onClick={() => {
                  handleSearch(faq.question);
                  setExpandedFAQ(faq.id);
                }}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <p className="text-sm font-medium text-gray-900">{faq.question}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{faq.category}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search History & Popular Searches */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                Recent Searches
              </h3>
              <div className="space-y-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Popular Searches
              </h3>
              <div className="space-y-2">
                {popularSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQs by Category */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : searchQuery && faqs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
          <p className="text-gray-500 mb-4">
            Try different keywords or browse by category
          </p>
          <button
            onClick={clearSearch}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear search
          </button>
        </div>
      ) : searchQuery ? (
        // Search Results
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold">
              {faqs.length} result{faqs.length !== 1 ? "s" : ""} for "{searchQuery}"
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{faq.category}</p>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Categories
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="capitalize">{category.name}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    ({category.faqs.length})
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq) => (
                  <div key={faq.id} className="p-4">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-start justify-between gap-4 text-left"
                    >
                      <h4 className="font-medium text-gray-900 flex-1">{faq.question}</h4>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="mt-4 text-gray-700 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Still Need Help CTA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
        <p className="text-blue-700 text-sm mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <button
          onClick={() => (window.location.href = "/support/tickets/new")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Support Ticket
        </button>
      </div>
    </div>
  );
}
