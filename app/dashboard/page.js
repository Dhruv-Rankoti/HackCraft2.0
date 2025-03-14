"use client";

import { useSessionContext } from "@/app/components/SessionWrapper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Dashboard() {
  const { session, loading } = useSessionContext(); // Ensure session is loaded before fetching data
  const router = useRouter();

  const [sentimentData, setSentimentData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (session) {
      fetchSentimentData();
      fetchTrendData();
    }
  }, [session]); // Fetch data only after session is available

  const fetchSentimentData = async () => {
    try {
      const response = await fetch("/api/sentiment-stats");
      const data = await response.json();
      setSentimentData(data);
      setDataLoading(false);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      setDataLoading(false);
    }
  };

  const fetchTrendData = async () => {
    try {
      const response = await fetch("/api/trends");
      const data = await response.json();
      setTrendData(data);
      setDataLoading(false);
    } catch (error) {
      console.error("Error fetching trend data:", error);
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) return <p>Loading...</p>; // Show loading state until data is fetched

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
          <p className="text-gray-500 text-center">No data available</p>
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
