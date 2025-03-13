export async function GET() {
  const trendData = [
    { date: "2024-03-01", positive: 40, negative: 10, neutral: 20 },
    { date: "2024-03-02", positive: 50, negative: 15, neutral: 25 },
    { date: "2024-03-03", positive: 60, negative: 20, neutral: 30 },
    { date: "2024-03-04", positive: 70, negative: 25, neutral: 35 }
  ];
  return Response.json(trendData);
}
