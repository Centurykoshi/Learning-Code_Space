// Generate typing text for practice
export async function generatetypingtext(mode: "story" | "affirmation", timeLimit: number): Promise<string> {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });

    // Calculate approximate word count based on time (assuming 40 WPM average)
    const targetWords = Math.max(50, Math.floor((timeLimit * 40) / 60));
    
    let prompt: string;
    
    if (mode === "story") {
      prompt = `Generate a ${targetWords}-word engaging short story suitable for typing practice. 
      The story should be:
      - Interesting and motivational
      - Use common, everyday vocabulary (avoid complex technical terms)
      - Include a good mix of punctuation (periods, commas, apostrophes, quotation marks)
      - Use varied sentence lengths (mix of short and medium sentences)
      - Include contractions naturally (don't, can't, it's, won't)
      - Feature both uppercase and lowercase letters in natural contexts
      - Include numbers when they fit naturally in the story
      - Flow naturally for typing practice without awkward phrasing
      - Avoid excessive repetition of the same words
      - Be exactly ${targetWords} words
      
      Create content that helps practice different typing skills while remaining engaging.
      Just return the story text without any formatting or extra explanation.`;
    } else {
      prompt = `Generate ${targetWords} words of positive affirmations and motivational content for typing practice.
      The content should be:
      - Uplifting and encouraging
      - Use simple, clear everyday language
      - Include proper punctuation (periods, commas, apostrophes)
      - Use varied sentence lengths for good typing rhythm
      - Include contractions naturally (you're, I'm, we'll, don't)
      - Flow well for typing practice with natural phrasing
      - Include both positive statements and actionable advice
      - Avoid repetitive phrases or words
      - Be exactly ${targetWords} words
      
      Format as flowing paragraphs of affirmations and motivational thoughts.
      Just return the text without any formatting or extra explanation.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Basic validation
    const wordCount = text.split(/\s+/).length;
    if (wordCount < targetWords * 0.8 || wordCount > targetWords * 1.2) {
      console.warn(`Generated text has ${wordCount} words, target was ${targetWords}`);
    }
    
    return text;
    
  } catch (error) {
    console.error("Error generating typing text:", error);
    throw new Error("Failed to generate typing content. Please check your API configuration.");
  }
}