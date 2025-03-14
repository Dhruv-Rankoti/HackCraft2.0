"use client";

import { useSessionContext } from "@/app/components/SessionWrapper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Dashboard() {
  const { session, loading } = useSessionContext();
  const router = useRouter();
  const [sentimentData, setSentimentData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login"); // ✅ Redirect if user is not logged in
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]); // ✅ Fetch data only after session is available

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [sentimentResponse, trendResponse] = await Promise.all([
        fetch("/api/sentiment-stats"),
        fetch("/api/trends"),
      ]);

      const sentimentJson = await sentimentResponse.json();
      const trendJson = await trendResponse.json();

      setSentimentData(sentimentJson);
      setTrendData(trendJson);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setDataLoading(false);
  };

  if (loading || dataLoading) return <p className="text-center text-lg">Loading Dashboard...</p>; // ✅ Prevents flickering

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Sentiment Analysis Chart */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sentiment Analysis Overview</h2>
        {sentimentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No sentiment data available</p>
        )}
      </div>

      {/* Trend Analysis Chart */}
      <div className="bg-white p-6 shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">Feedback Trends Over Time</h2>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="positive" stroke="#4CAF50" />
              <Line type="monotone" dataKey="negative" stroke="#E53935" />
              <Line type="monotone" dataKey="neutral" stroke="#FFB300" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No trend data available</p>
        )}
      </div>
    </div>
  );
}
