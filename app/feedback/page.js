"use client"; // Required for Next.js App Router

import { useState } from "react";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze feedback");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Error analyzing feedback. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Submit Customer Feedback</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 shadow-lg rounded-lg">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Enter customer feedback..."
          rows={4}
          required
        ></textarea>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Feedback"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-white p-6 shadow-lg rounded-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}
