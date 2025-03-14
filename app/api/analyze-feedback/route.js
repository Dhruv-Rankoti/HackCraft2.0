import connectDB from "@/app/utils/db";
import Feedback from "@/app/models/Feedback";

export async function POST(req) {
  try {
    await connectDB(); // Connect to MongoDB
    const { feedback } = await req.json();

    if (!feedback || feedback.length < 3) {
      return Response.json({ error: "Feedback is too short." }, { status: 400 });
    }

    // Simulated AI sentiment analysis (Replace with real AI model)
    const sentiment = feedback.toLowerCase().includes("bad") ? "Negative" : "Positive";
    const confidence = Math.floor(Math.random() * (95 - 75) + 75); // Simulated confidence %

    // Save feedback to MongoDB
    const newFeedback = await Feedback.create({ text: feedback, sentiment, confidence });

    return Response.json({ sentiment, confidence, id: newFeedback._id });
  } catch (error) {
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}
