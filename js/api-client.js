/**
 * JurisAI Client API
 * Calls local secure backend server proxy endpoint (/api/gemini).
 * No API key is stored or exposed on client side!
 */

export class GeminiLegalAPI {
  constructor() {
    this.proxyUrl = '/api/gemini';
  }

  hasApiKey() {
    return true; // Key is managed securely on server backend
  }

  async callGemini(promptText, systemInstruction = "") {
    const response = await fetch(this.proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: promptText,
        systemInstruction: systemInstruction
      })
    });

    if (!response.ok) {
      throw new Error(`Server Proxy HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Backend server failed to process GenAI request.");
    }

    return data.text;
  }

  /**
   * Simplify a full legal document or snippet
   */
  async simplifyDocument(documentText, language = "en") {
    const systemPrompt = `You are JurisAI, an expert senior legal counsel and AI document simplifier. 
Your mission is to make legal contracts clear, accessible, and understandable for non-lawyers.
Analyze the provided legal document and return a valid JSON object with the following structure:
{
  "title": "Short descriptive title of contract",
  "summary": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "legaleseDensity": 75,
  "estReadingTime": "15 mins",
  "simplifiedReadingTime": "3 mins",
  "clauses": [
    {
      "id": "c1",
      "title": "Section Title",
      "category": "Category name",
      "severity": "high" | "medium" | "low",
      "rawText": "Original exact text",
      "simplified": "Clear plain English explanation in simple terms",
      "impact": "Practical real-world impact or risk for the user",
      "loopholes": "Hidden trap, loop hole or missing protection",
      "recommendation": "Actionable negotiation advice",
      "fairDraft": "Fair balanced rewrite of the clause"
    }
  ]
}
IMPORTANT: Return ONLY raw valid JSON, no markdown formatting blocks. Respond in ${language} language for simplified explanations while keeping original raw text intact.`;

    const rawResult = await this.callGemini(documentText, systemPrompt);
    return this._cleanJsonParse(rawResult);
  }

  /**
   * Compare two contract drafts (Doc A vs Doc B)
   */
  async compareContracts(docAText, docBText) {
    const systemPrompt = `You are a contract negotiation expert. Compare Document A (Original / Draft 1) with Document B (Counterproposal / Draft 2).
Analyze structural changes, added clauses, removed clauses, altered terms, and risk shifts.
Return a valid JSON object with this exact structure:
{
  "overallRiskDelta": "High Risk Shift to Vendor" | "Moderate Changes" | "Favorable Modifications",
  "diffSummary": [
    {
      "clause": "Clause Name",
      "status": "modified" | "added" | "deleted",
      "riskLevel": "high" | "medium" | "low",
      "docA_Text": "Text in Doc A or [Not Present]",
      "docB_Text": "Text in Doc B or [Not Present]",
      "plainMeaning": "What this change means in simple plain language",
      "impact": "Which party gains an advantage and what risks it creates"
    }
  ]
}
IMPORTANT: Return ONLY raw valid JSON, no markdown code blocks.`;

    const userPrompt = `DOCUMENT A:\n${docAText}\n\nDOCUMENT B:\n${docBText}`;
    const rawResult = await this.callGemini(userPrompt, systemPrompt);
    return this._cleanJsonParse(rawResult);
  }

  /**
   * Helper to strip markdown json markers and parse JSON
   */
  _cleanJsonParse(str) {
    try {
      let cleaned = str.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parsing error from Gemini output:", e, str);
      throw new Error("Failed to parse AI response into structured JSON format.");
    }
  }
}
