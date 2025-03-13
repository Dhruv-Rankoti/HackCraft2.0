export async function GET() {
  const sentimentData = [
    { name: "Positive", count: 120 },
    { name: "Neutral", count: 50 },
    { name: "Negative", count: 30 }
  ];
  return Response.json(sentimentData);
}
