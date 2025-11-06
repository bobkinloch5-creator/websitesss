const axios = require('axios');

class AIService {
  constructor() {
    this.apiUrl = process.env.YOUR_AI_API_URL;
    this.apiKey = process.env.YOUR_AI_API_KEY;
    this.timeout = 120000;
  }

  async processPrompt(userPrompt, projectContext = {}) {
    try {
      const startTime = Date.now();
      const response = await axios.post(
        this.apiUrl,
        {
          messages: [
            { role: 'system', content: this.getSystemPrompt() },
            { role: 'user', content: userPrompt }
          ],
          context: projectContext,
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: this.timeout
        }
      );
      const executionTime = Date.now() - startTime;
      const parsed = this.parseAIResponse(response.data);
      return {
        ...parsed,
        executionTime,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ AI Service Error:', error.message);
      if (error.response) {
        throw new Error(`AI API Error: ${error.response.status} - ${error.response.data.error || error.message}`);
      } else if (error.request) {
        throw new Error('AI API not responding. Please check your connection.');
      } else {
        throw new Error(`AI processing failed: ${error.message}`);
      }
    }
  }

  getSystemPrompt() {
    return `You are Hideout Bot, an advanced AI assistant that generates Roblox game content.\n\nYour job is to convert natural language requests into actionable Roblox Studio commands.\n\nCRITICAL: You MUST respond with VALID JSON in this EXACT format:\n{\n  \"plan\": \"Brief 1-2 sentence explanation of what you'll create\",\n  \"actions\": [\n    {\n      \"type\": \"ACTION_TYPE\",\n      \"description\": \"Human-readable description of this action\",\n      \"data\": { /* action-specific data */ }\n    }\n  ]\n}\n...`; // Truncated for brevity
  }

  parseAIResponse(rawResponse) {
    let parsed;
    try {
      if (typeof rawResponse === 'string') {
        const jsonMatch = rawResponse.match(/```json\n?([\s\S]*?)\n?```/) || 
                         rawResponse.match(/```\n?([\s\S]*?)\n?```/) ||
                         rawResponse.match(/(\{[\s\S]*\})/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1]);
        } else {
          parsed = JSON.parse(rawResponse);
        }
      } else if (rawResponse.choices && rawResponse.choices[0]) {
        const content = rawResponse.choices[0].message?.content || rawResponse.choices[0].text;
        parsed = JSON.parse(content);
      } else if (rawResponse.content) {
        parsed = JSON.parse(rawResponse.content);
      } else {
        parsed = rawResponse;
      }
      if (!parsed.actions || !Array.isArray(parsed.actions)) {
        throw new Error('Response missing "actions" array');
      }
      parsed.actions = parsed.actions.map((action, index) => {
        if (!action.type || !action.data) {
          throw new Error(`Action ${index} missing required fields (type, data)`);
        }
        return {
          id: `${Date.now()}_${index}`,
          type: action.type,
          description: action.description || `Action ${index + 1}`,
          data: action.data,
          status: 'pending'
        };
      });
      return {
        plan: parsed.plan || 'Executing your request...',
        actions: parsed.actions
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error(`Invalid AI response format: ${error.message}`);
    }
  }
}

module.exports = new AIService();
