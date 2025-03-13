export async function POST(req) {
    try {
      const { feedback } = await req.json();
  
      if (!feedback || feedback.length < 3) {
        return Response.json({ error: "Feedback is too short." }, { status: 400 });
      }
  
      // Simulated AI sentiment analysis (Replace with real model)
      const sentiment = feedback.toLowerCase().includes("bad") ? "Negative" : "Positive";
      const confidence = Math.floor(Math.random() * (95 - 75) + 75); // Simulated confidence %
  
      return Response.json({ sentiment, confidence });
    } catch (error) {
      return Response.json({ error: "Server error." }, { status: 500 });
    }
  }
  