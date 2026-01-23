const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate care schedule for a plant using AI
 */
const generateCareSchedule = async (plantData, userConditions) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // CHANGED

    const prompt = `You are an expert horticulturist specializing in Indian climate conditions.

Plant Details:
- Name: ${plantData.name}
- Scientific Name: ${plantData.scientificName || 'N/A'}
- Type: ${plantData.type || plantData.category}

User Conditions:
- Location: ${userConditions.city}, ${userConditions.state} (Climate: ${userConditions.climateZone})
- Growing Location: ${userConditions.balconyType}
- Available Sunlight: ${userConditions.sunlightHours} hours/day
- Current Season: ${getCurrentSeason()}

Generate a personalized care schedule in JSON format ONLY (no other text):
{
  "wateringFrequency": <number of days between watering>,
  "wateringNeeds": "<low/moderate/high>",
  "wateringInstructions": "<brief instruction>",
  "fertilizingFrequency": <days>,
  "fertilizingInstructions": "<brief instruction>",
  "pruningFrequency": <days>,
  "sunlightRequirement": "<hours per day>",
  "soilType": "<recommended soil type>",
  "idealTemperature": "<temperature range in Celsius>",
  "growthTimeDays": <estimated days to maturity or full growth>
}

Consider Indian climate, monsoon season, and balcony/terrace constraints.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }
    
    const careSchedule = JSON.parse(jsonMatch[0]);
    return careSchedule;
  } catch (error) {
    console.error('AI care schedule generation error:', error);
    
    // Fallback to basic schedule if AI fails
    return {
      wateringFrequency: 2,
      wateringNeeds: 'moderate',
      wateringInstructions: 'Water when top soil is dry',
      fertilizingFrequency: 30,
      fertilizingInstructions: 'Use balanced NPK fertilizer',
      pruningFrequency: 60,
      sunlightRequirement: '4-6 hours',
      soilType: 'Well-drained potting mix',
      idealTemperature: '20-30°C',
      growthTimeDays: 90
    };
  }
};

/**
 * Generate seasonal care tips using AI
 */
const generateSeasonalTips = async (plantName, location, season) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // CHANGED

    const prompt = `You are an expert in Indian gardening and agriculture.

Plant: ${plantName}
Location: ${location}
Season: ${season}

Provide specific care tips for this plant during ${season} season in India. Focus on:
1. Watering adjustments
2. Common issues during this season
3. Protection needed (from rain/heat/cold)
4. Fertilization changes

Return JSON ONLY:
{
  "wateringTips": "<specific watering advice for this season>",
  "commonIssues": "<issues to watch for>",
  "protectionNeeded": "<how to protect the plant>",
  "fertilizationAdvice": "<fertilization tips>",
  "additionalCare": "<any other important care tips>"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI seasonal tips generation error:', error);
    return {
      wateringTips: 'Adjust watering based on weather conditions',
      commonIssues: 'Monitor for pests and diseases',
      protectionNeeded: 'Protect from extreme weather',
      fertilizationAdvice: 'Continue regular fertilization schedule',
      additionalCare: 'Observe plant health regularly'
    };
  }
};

/**
 * Generate water quality recommendations using AI
 */
const generateWaterQualityAdvice = async (plantName, waterSource) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // CHANGED

    const prompt = `You are a plant care expert.

Plant: ${plantName}
Water Source: ${waterSource}

Provide water quality advice for this plant. Return JSON ONLY:
{
  "suitability": "<excellent/good/suitable/not-recommended>",
  "recommendation": "<brief recommendation>",
  "preparation": "<any preparation needed before using this water>",
  "frequency": "<how often to use this water type>"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI water quality advice error:', error);
    return {
      suitability: 'suitable',
      recommendation: 'This water source is generally suitable for most plants',
      preparation: 'Let water sit for 24 hours before use',
      frequency: 'Can be used regularly'
    };
  }
};

/**
 * Get current season in India
 */
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  if (month >= 10 && month <= 11) return 'autumn';
  return 'winter';
};

/**
 * Generate plant suggestions based on user conditions
 */
const generatePlantSuggestions = async (userConditions, availablePlants) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // CHANGED

    const prompt = `You are an expert in Indian gardening.

User Conditions:
- Location: ${userConditions.city}, ${userConditions.state}
- Climate Zone: ${userConditions.climateZone}
- Growing Location: ${userConditions.balconyType}
- Available Sunlight: ${userConditions.sunlightHours} hours/day
- Current Season: ${getCurrentSeason()}

Available Plants:
${availablePlants.map(p => `- ${p.name} (${p.type || 'plant'})`).join('\n')}

From the available plants list, suggest the top 5 most suitable plants for these conditions.

Return JSON ONLY (array of plant names):
{
  "suggestions": ["plant1", "plant2", "plant3", "plant4", "plant5"],
  "reasoning": "<brief explanation why these plants>"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI plant suggestions error:', error);
    return {
      suggestions: availablePlants.slice(0, 5).map(p => p.name),
      reasoning: 'These plants are generally suitable for various conditions'
    };
  }
};

module.exports = {
  generateCareSchedule,
  generateSeasonalTips,
  generateWaterQualityAdvice,
  generatePlantSuggestions,
  getCurrentSeason
};