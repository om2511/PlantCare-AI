const Groq = require('groq-sdk');

/**
 * Analyze plant image using Groq AI
 * Provides plant disease analysis with treatment recommendations
 */
const analyzePlantImage = async (imageUrl) => {
  try {
    console.log('🔍 Analyzing plant image...');

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    console.log('🤖 Sending to AI for analysis...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert plant pathologist. Provide plant disease analysis in JSON format.

IMPORTANT: Always respond with ONLY valid JSON, no markdown code blocks, no extra text.

Response format:
{
  "isHealthy": boolean,
  "confidence": number (0-100),
  "disease": "string",
  "plantType": "string",
  "severity": "mild" | "moderate" | "severe" | null,
  "symptoms": ["string"],
  "causes": ["string"],
  "treatment": {
    "immediate": "string",
    "shortTerm": "string",
    "longTerm": "string",
    "organicOptions": ["string"],
    "chemicalOptions": ["string"]
  },
  "prevention": ["string"]
}`
        },
        {
          role: 'user',
          content: `Analyze this plant image for potential diseases: ${imageUrl}

Provide a detailed plant health analysis. If the image appears to be of a healthy plant, indicate that. If there are signs of disease, identify the most likely conditions and provide treatment recommendations.

Respond with JSON only.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024
    });

    const responseText = completion.choices[0]?.message?.content || '';
    console.log('📝 AI response received');

    // Parse JSON from response - handle various formats
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```json\n?/gi, '').replace(/```\n?/g, '');
    }

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Raw response:', responseText);
      throw new Error('AI did not return valid JSON');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Ensure all required fields have defaults
    const result = {
      isHealthy: analysis.isHealthy ?? false,
      confidence: analysis.confidence ?? 70,
      disease: analysis.disease || 'Unknown condition',
      plantType: analysis.plantType || 'Unknown plant',
      severity: analysis.isHealthy ? null : (analysis.severity || 'moderate'),
      symptoms: analysis.symptoms || ['Visual inspection recommended'],
      causes: analysis.causes || ['Multiple factors possible'],
      treatment: {
        immediate: analysis.treatment?.immediate || 'Isolate plant and assess damage',
        shortTerm: analysis.treatment?.shortTerm || 'Monitor closely for changes',
        longTerm: analysis.treatment?.longTerm || 'Maintain proper care routine',
        organicOptions: analysis.treatment?.organicOptions || ['Neem oil spray', 'Remove affected parts'],
        chemicalOptions: analysis.treatment?.chemicalOptions || ['Consult local garden center']
      },
      prevention: analysis.prevention || [
        'Regular monitoring',
        'Proper watering',
        'Good air circulation'
      ]
    };

    console.log('✅ Disease analysis complete');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('❌ Analysis error:', error.message);

    // Handle rate limiting
    if (error.message?.includes('429') || error.message?.includes('rate')) {
      return {
        success: false,
        message: 'Rate limit exceeded. Please try again in a moment.',
        error: 'RATE_LIMITED'
      };
    }

    // Handle authentication errors
    if (error.message?.includes('401') || error.message?.includes('invalid_api_key')) {
      return {
        success: false,
        message: 'API authentication failed. Please check your API key.',
        error: 'AUTH_ERROR'
      };
    }

    return {
      success: false,
      message: 'Failed to analyze image. Please try again.',
      error: error.message
    };
  }
};

/**
 * Get disease information from text using Groq
 */
const getDiseaseInfo = async (diseaseDescription) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Provide information about this plant disease: "${diseaseDescription}"

Return ONLY JSON:
{
  "disease": "<name>",
  "description": "<description>",
  "symptoms": ["symptom1", "symptom2"],
  "treatment": {
    "immediate": "<action>",
    "organic": ["option1", "option2"],
    "chemical": ["option1", "option2"]
  },
  "prevention": ["tip1", "tip2"]
}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024
    });

    const response = completion.choices[0]?.message?.content || '';
    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Disease info error:', error);
    throw error;
  }
};

module.exports = {
  analyzePlantImage,
  getDiseaseInfo
};
