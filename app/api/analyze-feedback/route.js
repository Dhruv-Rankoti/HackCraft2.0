import connectDB from "@/app/utils/db";
import ResponseModel from "@/app/models/Response";
import { analyzeSentimentWithModel } from "@/app/utils/sentimentAnalyzer";

// Fallback responses based on sentiment when offline/API unavailable
const FALLBACK_RESPONSES = {
  Positive:
    "Thank you for your positive feedback! We're delighted to hear that you had a great experience with our product. Your satisfaction is our priority, and we appreciate you taking the time to share your thoughts.",
  Negative:
    "We sincerely apologize for your experience. Your feedback is important to us, and we'll use it to improve our products and services. Please reach out to our customer service team if there's anything we can do to address your concerns.",
  Neutral:
    "Thank you for sharing your feedback. We appreciate your honest assessment and will take your comments into consideration as we continue to improve our products and services. Please don't hesitate to reach out if you have any other thoughts.",
};

export async function POST(req) {
  try {
    const { feedback, price } = await req.json();

    if (!feedback || feedback.length < 3) {
      return Response.json(
        { error: "Feedback is too short." },
        { status: 400 }
      );
    }

    // Step 1: Analyze sentiment using the original ML model
    const sentimentResult = await analyzeSentimentWithModel(feedback, price);
    console.log("Sentiment analysis result:", sentimentResult);

    // Generate a fallback response based on the sentiment
    const fallbackResponse =
      FALLBACK_RESPONSES[sentimentResult.sentiment] ||
      "Thank you for your feedback. We value your input and will use it to improve our products and services.";

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    let customerResponse = fallbackResponse;
    let apiCallSuccessful = false;

    // Check if API key is valid and try to call Gemini API
    if (apiKey && apiKey !== "YOUR_ACTUAL_GEMINI_API_KEY_HERE") {
      try {
        // Step 2: Use Gemini API ONLY for generating customer response
        const prompt = `
          The following customer feedback has been analyzed as ${sentimentResult.sentiment}.
          
          Customer feedback: "${feedback}"
          
          Based on this sentiment analysis, provide a professional, empathetic and personalized response to the customer.
          The response should acknowledge their feedback and match the sentiment of their experience.
          Keep the response under 3 sentences and make it sound natural and sincere.
          
          ONLY provide the response text, with no additional formatting or explanation.
        `;

        console.log("Attempting to call Gemini API...");

        // Call the Gemini API with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();

          if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content
          ) {
            customerResponse = data.candidates[0].content.parts[0].text.trim();
            apiCallSuccessful = true;
            console.log("Gemini API response:", customerResponse);
          } else {
            console.error("Unexpected Gemini API response format");
          }
        } else {
          const errorData = await response.json();
          console.error("Gemini API error:", errorData);
        }
      } catch (apiError) {
        console.error("Failed to call Gemini API:", apiError.message);
        // Continue with fallback response
      }
    } else {
      console.log("Using offline mode with fallback response");
    }

    // Combine results - sentiment from our model and response (either from API or fallback)
    const result = {
      sentiment: sentimentResult.sentiment,
      confidence: sentimentResult.confidence,
      customerResponse: customerResponse,
      offline: !apiCallSuccessful,
    };

    // Save the response to MongoDB
    try {
      await connectDB();

      const newResponse = new ResponseModel({
        feedback: feedback,
        price: price || null,
        sentiment: result.sentiment,
        confidence: result.confidence,
        topics: [],
        recommendations: [],
        customerResponse: result.customerResponse,
      });

      await newResponse.save();
      console.log("Response saved to database");
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
    }

    return Response.json(result);
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}
