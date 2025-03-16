export async function POST(req) {
  try {
    const { feedback } = await req.json();

    if (!feedback || feedback.length < 3) {
      return Response.json({ error: "Feedback is too short." }, { status: 400 });
    }

    // Get the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return Response.json({ error: "API key not configured." }, { status: 500 });
    }

    // Prepare the prompt for Gemini API
    const prompt = `
      Analyze the following customer feedback and provide:
      1. The overall sentiment (Positive, Negative, or Neutral)
      2. A confidence percentage (number only)
      3. Key topics mentioned (as a JSON array of strings)
      4. Actionable recommendations based on the feedback (as a JSON array of strings)
      5. A professional and empathetic response to the customer (as a string)
      
      Format your response as valid JSON with the following structure:
      {
        "sentiment": "Positive/Negative/Neutral",
        "confidence": 85, 
        "topics": ["topic1", "topic2"],
        "recommendations": ["recommendation1", "recommendation2"],
        "customerResponse": "Thank you for your feedback. We appreciate..."
      }
      
      Customer feedback: "${feedback}"
    `;

    // Call the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts:[{text: prompt}]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return Response.json({ error: "Error from AI service." }, { status: response.status });
    }

    const data = await response.json();
    
    // Parse the generated content from Gemini
    try {
      let resultText = '';
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        resultText = data.candidates[0].content.parts[0].text;
      }
      
      // Try to extract JSON from the response
      let jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]);
        return Response.json(analysisResult);
      }
      
      // Fallback if parsing fails
      return Response.json({ 
        sentiment: "Neutral", 
        confidence: 50,
        topics: ["Unknown"],
        recommendations: ["Could not analyze feedback properly."],
        customerResponse: "Thank you for your feedback. We appreciate you taking the time to share your thoughts with us."
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return Response.json({ error: "Failed to parse AI response." }, { status: 500 });
    }
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: "Server error." }, { status: 500 });
  }
}
  