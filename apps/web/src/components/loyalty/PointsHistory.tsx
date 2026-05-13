"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Clock, Filter } from "lucide-react";

interface Transaction {
  id: number;
  points: number;
  type: string;
  reference: string;
  description: string;
  created_at: string;
}

const typeColors: Record<string, string> = {
  earned: "text-green-600 bg-green-50",
  redeemed: "text-red-600 bg-red-50",
  expired: "text-gray-600 bg-gray-50",
};

export default function PointsHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loyalty/history?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) => filter === "all" || t.type === filter
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Points History</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Transactions</option>
            <option value="earned">Earned</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${typeColors[tx.type]}`}>
                {tx.type === "earned" ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{tx.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(tx.created_at)}</span>
                  {tx.reference && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-xs">{tx.reference}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-xl font-bold ${
                  tx.points > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.points > 0 ? "+" : ""}
                {tx.points.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 uppercase font-semibold">{tx.type}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No transactions yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Start earning points by completing bookings and referring friends!
          </p>
        </div>
      )}
    </div>
  );
}
