const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate care schedule for a plant using AI
 */
const generateCareSchedule = async (plantData, userConditions) => {
  try {
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

Generate a personalized care schedule in JSON format ONLY (no markdown, no other text):
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

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024
    });

    const response = completion.choices[0]?.message?.content || '';

    console.log('🤖 AI Response:', response.substring(0, 200));
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }
    
    const careSchedule = JSON.parse(jsonMatch[0]);
    console.log('✅ AI care schedule generated');
    return careSchedule;
  } catch (error) {
    console.error('❌ AI care schedule generation error:', error.message);
    
    // Fallback to basic schedule
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
    const prompt = `You are an expert in Indian gardening and agriculture.

Plant: ${plantName}
Location: ${location}
Season: ${season}

Provide specific care tips for this plant during ${season} season in India. Focus on:
1. Watering adjustments
2. Common issues during this season
3. Protection needed (from rain/heat/cold)
4. Fertilization changes

Return ONLY valid JSON (no markdown):
{
  "wateringTips": "<specific watering advice for this season>",
  "commonIssues": "<issues to watch for>",
  "protectionNeeded": "<how to protect the plant>",
  "fertilizationAdvice": "<fertilization tips>",
  "additionalCare": "<any other important care tips>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
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
    console.error('❌ AI seasonal tips generation error:', error.message);
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
    const prompt = `You are a plant care expert.

Plant: ${plantName}
Water Source: ${waterSource}

Provide water quality advice for this plant. Return ONLY valid JSON (no markdown):
{
  "suitability": "<excellent/good/suitable/not-recommended>",
  "recommendation": "<brief recommendation>",
  "preparation": "<any preparation needed before using this water>",
  "frequency": "<how often to use this water type>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 512
    });

    const response = completion.choices[0]?.message?.content || '';

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ AI water quality advice error:', error.message);
    return {
      suitability: 'suitable',
      recommendation: 'This water source is generally suitable for most plants',
      preparation: 'Let water sit for 24 hours before use',
      frequency: 'Can be used regularly'
    };
  }
};

/**
 * Generate general water quality advice (without specific plant)
 */
const generateGeneralWaterQualityAdvice = async (waterSource) => {
  try {
    const prompt = `You are a plant care expert specializing in water quality for Indian gardening conditions.

Water Source: ${waterSource}

Provide general water quality advice for houseplants and garden plants. Consider Indian water conditions.
Return ONLY valid JSON (no markdown):
{
  "suitability": "<excellent/good/suitable/not-recommended>",
  "recommendation": "<detailed recommendation for using this water type for plants in general>",
  "preparation": "<any preparation needed before using this water, specific steps>",
  "frequency": "<how often this water type can be used and any rotation recommendations>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 512
    });

    const response = completion.choices[0]?.message?.content || '';

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ AI general water quality advice error:', error.message);
    return {
      suitability: 'suitable',
      recommendation: 'This water source is generally suitable for most plants. Monitor your plants for any signs of mineral buildup or stress.',
      preparation: 'Let tap water sit for 24 hours to allow chlorine to evaporate. For RO water, consider adding a small amount of fertilizer as it lacks minerals.',
      frequency: 'Can be used regularly for most plants. Consider alternating with rainwater when available for optimal plant health.'
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
    const prompt = `You are an expert in Indian gardening and horticulture with deep knowledge of plants that grow well in India.

User Conditions:
- Location: ${userConditions.city}, ${userConditions.state}, India
- Climate Zone: ${userConditions.climateZone}
- Growing Location: ${userConditions.balconyType}
- Available Sunlight: ${userConditions.sunlightHours} hours/day
- Current Season: ${getCurrentSeason()}

Available Plants:
${availablePlants.slice(0, 20).map((p, i) => `${i + 1}. ${p.name} (${p.type})`).join('\n')}

IMPORTANT: You MUST suggest plants that are commonly grown in India and suitable for Indian climate conditions.
Prioritize traditional Indian plants like Tulsi (Holy Basil), Curry Leaf, Neem, Jasmine, Marigold, Hibiscus, Coriander, Mint, Money Plant, etc.

From the available plants list above, suggest the top 5 most suitable plants for growing in ${userConditions.city}, India.
Focus on plants that:
1. Thrive in Indian climate (especially ${userConditions.climateZone} climate)
2. Are commonly found in Indian homes and gardens
3. Are suitable for ${userConditions.balconyType} growing
4. Match the ${userConditions.sunlightHours} hours of available sunlight

Return ONLY valid JSON (no markdown):
{
  "suggestions": ["plant1", "plant2", "plant3", "plant4", "plant5"],
  "reasoning": "<brief explanation why these Indian plants suit the conditions>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024
    });

    const response = completion.choices[0]?.message?.content || '';
    
    console.log('🤖 AI Suggestions Response:', response.substring(0, 200));
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ AI plant suggestions generated');
    return parsed;
  } catch (error) {
    console.error('❌ AI plant suggestions error:', error.message);
    // Fallback with common Indian plants
    const indianPlantsFallback = ['Tulsi', 'Money Plant', 'Aloe Vera', 'Jasmine', 'Marigold'];
    return {
      suggestions: indianPlantsFallback,
      reasoning: 'These are popular Indian plants that grow well in most conditions across India'
    };
  }
};

module.exports = {
  generateCareSchedule,
  generateSeasonalTips,
  generateWaterQualityAdvice,
  generateGeneralWaterQualityAdvice,
  generatePlantSuggestions,
  getCurrentSeason
};