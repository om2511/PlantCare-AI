const Groq = require('groq-sdk');

/**
 * Build plant context string for AI prompts
 */
const buildPlantContextPrompt = (plantContext) => {
  if (!plantContext) return '';

  const parts = [];
  if (plantContext.species) parts.push(`Species: ${plantContext.species}`);
  if (plantContext.scientificName) parts.push(`Scientific Name: ${plantContext.scientificName}`);
  if (plantContext.category) parts.push(`Category: ${plantContext.category}`);
  if (plantContext.location) parts.push(`Growing Location: ${plantContext.location}`);
  if (plantContext.soilType) parts.push(`Soil Type: ${plantContext.soilType}`);
  if (plantContext.sunlight) parts.push(`Sunlight: ${plantContext.sunlight}`);
  if (plantContext.wateringNeeds) parts.push(`Watering Needs: ${plantContext.wateringNeeds}`);
  if (plantContext.city) parts.push(`User Location: ${plantContext.city}, India`);
  if (plantContext.climateZone) parts.push(`Climate Zone: ${plantContext.climateZone}`);
  if (plantContext.season) parts.push(`Current Season: ${plantContext.season}`);

  if (parts.length === 0) return '';

  return `\n\nKNOWN PLANT INFORMATION (use this to improve diagnosis accuracy):
${parts.join('\n')}

IMPORTANT: Your diagnosis MUST be specific to this plant species. Do NOT suggest diseases that don't commonly affect this plant. Consider the growing conditions, climate, and season when diagnosing.`;
};

/**
 * Analyze plant image using Groq AI
 * Provides plant disease analysis with treatment recommendations
 */
const analyzePlantImage = async (imageUrl, plantContext = null) => {
  try {
    console.log('🔍 Analyzing plant image...');

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const contextPrompt = buildPlantContextPrompt(plantContext);

    console.log('🤖 Sending to AI for analysis...');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert plant pathologist specializing in Indian plants and climate conditions. Provide plant disease analysis in JSON format.

IMPORTANT: Always respond with ONLY valid JSON, no markdown code blocks, no extra text.
${plantContext ? `You are analyzing a KNOWN plant: ${plantContext.species || 'Unknown'}. Your diagnosis must be relevant to this specific species. Do not identify diseases that don't affect this plant species.` : 'Identify the plant type and then diagnose.'}

Response format:
{
  "isHealthy": boolean,
  "confidence": number (0-100),
  "disease": "string",
  "plantType": "string (detected plant type from image)",
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
  "prevention": ["string"],
  "plantMismatch": boolean (true if the plant in the image appears different from the registered species),
  "mismatchNote": "string (explain if plant type doesn't match, otherwise empty)",
  "confidenceNote": "string (if confidence is below 40%, explain why diagnosis is uncertain)"
}`
        },
        {
          role: 'user',
          content: `Analyze this plant image for potential diseases: ${imageUrl}
${contextPrompt}

Provide a detailed plant health analysis. If the image appears to be of a healthy plant, indicate that. If there are signs of disease, identify the most likely conditions and provide treatment recommendations suitable for Indian gardeners.

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
      plantType: analysis.plantType || (plantContext?.species) || 'Unknown plant',
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
      ],
      plantMismatch: analysis.plantMismatch || false,
      mismatchNote: analysis.mismatchNote || '',
      lowConfidence: (analysis.confidence ?? 70) < 40,
      confidenceNote: analysis.confidenceNote || ''
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
 * Analyze plant symptoms from text description using Groq AI
 */
const analyzeTextSymptoms = async (plantName, symptoms, plantContext = null) => {
  try {
    console.log('📝 Analyzing symptoms from text...');

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const contextPrompt = buildPlantContextPrompt(plantContext);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert plant pathologist specializing in Indian plants and climate conditions. Analyze plant symptoms and provide disease diagnosis with treatment recommendations.
${plantContext ? `You are diagnosing a KNOWN plant: ${plantContext.species || plantName}. Your diagnosis must be specific to this species and its known vulnerabilities.` : ''}

IMPORTANT: Always respond with ONLY valid JSON, no markdown code blocks, no extra text.

Response format:
{
  "isHealthy": boolean,
  "confidence": number (0-100),
  "disease": "string (name of the disease or 'Healthy Plant')",
  "plantType": "string",
  "severity": "mild" | "moderate" | "severe" | null,
  "symptoms": ["string - list of identified symptoms"],
  "causes": ["string - possible causes"],
  "treatment": {
    "immediate": "string - what to do right now",
    "shortTerm": "string - what to do in 1-2 weeks",
    "longTerm": "string - long-term prevention",
    "organicOptions": ["string - natural remedies"],
    "chemicalOptions": ["string - chemical treatments if needed"]
  },
  "prevention": ["string - tips to prevent recurrence"],
  "confidenceNote": "string (if confidence is below 40%, explain why diagnosis is uncertain)"
}`
        },
        {
          role: 'user',
          content: `Analyze these plant symptoms and provide a diagnosis:

Plant Name: ${plantName || 'Unknown plant'}
Symptoms Described: ${symptoms}
${contextPrompt}

Based on these symptoms, identify the most likely disease or condition and provide detailed treatment recommendations suitable for Indian gardeners. Consider common diseases in Indian climate.

Respond with JSON only.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024
    });

    const responseText = completion.choices[0]?.message?.content || '';
    console.log('📝 AI response received for text analysis');

    // Parse JSON from response
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
      plantType: analysis.plantType || plantName || 'Unknown plant',
      severity: analysis.isHealthy ? null : (analysis.severity || 'moderate'),
      symptoms: analysis.symptoms || [symptoms],
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
      ],
      lowConfidence: (analysis.confidence ?? 70) < 40,
      confidenceNote: analysis.confidenceNote || ''
    };

    console.log('✅ Text-based disease analysis complete');

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('❌ Text analysis error:', error.message);

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
      message: 'Failed to analyze symptoms. Please try again.',
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
  analyzeTextSymptoms,
  getDiseaseInfo
};
