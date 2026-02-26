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
const generateWaterQualityAdvice = async (plantName, waterSource, plantContext = null) => {
  try {
    let contextInfo = '';
    if (plantContext) {
      const parts = [];
      if (plantContext.soilType) parts.push(`Soil Type: ${plantContext.soilType}`);
      if (plantContext.wateringNeeds) parts.push(`Watering Needs: ${plantContext.wateringNeeds}`);
      if (plantContext.sunlight) parts.push(`Sunlight: ${plantContext.sunlight}`);
      if (plantContext.location) parts.push(`Growing Location: ${plantContext.location}`);
      if (plantContext.city) parts.push(`User City: ${plantContext.city}, India`);
      if (plantContext.climateZone) parts.push(`Climate Zone: ${plantContext.climateZone}`);
      if (parts.length > 0) {
        contextInfo = `\n\nPlant Growing Conditions:\n${parts.join('\n')}`;
      }
    }

    const season = getCurrentSeason();

    const prompt = `You are an expert in plant water quality and irrigation, specializing in Indian gardening conditions.

Plant: ${plantName}
Water Source: ${waterSource}
Current Season: ${season}${contextInfo}

Analyze the water quality suitability for this specific plant. Consider:
1. pH sensitivity of this plant species
2. How the water source interacts with the soil type
3. Mineral content impact on this plant
4. Seasonal watering adjustments for Indian climate
5. Local water conditions in India

Return ONLY valid JSON (no markdown):
{
  "suitability": "<excellent/good/suitable/not-recommended>",
  "recommendation": "<detailed recommendation specific to this plant and water source>",
  "preparation": "<specific preparation steps before using this water>",
  "frequency": "<how often to use this water type>",
  "phCompatibility": "<pH analysis - how this water source pH works with this plant's needs>",
  "mineralAnalysis": "<analysis of mineral content impact - calcium, chlorine, fluoride, etc.>",
  "alternativeWaterTip": "<suggestion for alternative or complementary water source for best results>"
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
      max_tokens: 768
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
      frequency: 'Can be used regularly',
      phCompatibility: 'Most plants tolerate a pH range of 6.0-7.0',
      mineralAnalysis: 'Monitor for mineral buildup over time',
      alternativeWaterTip: 'Consider mixing with rainwater for optimal results'
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

/**
 * Generate soil suggestion for a plant
 */
const generateSoilSuggestion = async (plantContext) => {
  try {
    const season = getCurrentSeason();

    const prompt = `You are an expert horticulturist specializing in Indian gardening and soil science.

Plant: ${plantContext.species || 'Unknown'}
${plantContext.scientificName ? `Scientific Name: ${plantContext.scientificName}` : ''}
Category: ${plantContext.category || 'other'}
Growing Location: ${plantContext.location || 'balcony'}
Current Soil: ${plantContext.soilType || 'Unknown'}
Sunlight: ${plantContext.sunlight || 'Unknown'}
${plantContext.city ? `Location: ${plantContext.city}, India` : ''}
${plantContext.climateZone ? `Climate: ${plantContext.climateZone}` : ''}
Season: ${season}

Provide a comprehensive soil guide for this plant, considering Indian conditions and locally available materials.

Return ONLY valid JSON (no markdown):
{
  "idealSoilType": "<ideal soil type name>",
  "soilMixRecipe": [
    {"component": "<component name>", "ratio": <percentage as number>, "purpose": "<why this component>"}
  ],
  "phRange": {"min": <number>, "max": <number>, "ideal": <number>},
  "drainageNeeds": "<excellent/good/moderate/low - with explanation>",
  "organicMatter": "<recommended organic matter additions and frequency>",
  "fertilizerRecommendation": "<specific fertilizer type, NPK ratio, and schedule>",
  "commonProblems": [
    {"problem": "<soil problem name>", "solution": "<how to fix it>"}
  ],
  "localAvailability": "<where to find these soil components in India - nurseries, online, local alternatives>",
  "seasonalAdjustment": "<how to adjust soil care for current season>"
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
    console.error('❌ AI soil suggestion error:', error.message);
    return {
      idealSoilType: 'Well-drained potting mix',
      soilMixRecipe: [
        { component: 'Garden Soil', ratio: 40, purpose: 'Base structure' },
        { component: 'Cocopeat', ratio: 30, purpose: 'Moisture retention' },
        { component: 'Vermicompost', ratio: 20, purpose: 'Nutrients' },
        { component: 'Perlite', ratio: 10, purpose: 'Drainage' }
      ],
      phRange: { min: 6.0, max: 7.0, ideal: 6.5 },
      drainageNeeds: 'Good - ensure pots have drainage holes',
      organicMatter: 'Add vermicompost every 2-3 months',
      fertilizerRecommendation: 'Balanced NPK (19-19-19) every 2 weeks during growing season',
      commonProblems: [
        { problem: 'Waterlogging', solution: 'Add perlite and ensure drainage holes' },
        { problem: 'Nutrient depletion', solution: 'Top-dress with compost monthly' }
      ],
      localAvailability: 'Available at local nurseries and online platforms like Amazon, Ugaoo',
      seasonalAdjustment: 'Reduce watering frequency and adjust soil moisture based on season'
    };
  }
};

/**
 * Generate companion planting suggestions
 */
const generateCompanionPlantingSuggestions = async (userPlants, userConditions) => {
  try {
    const plantList = userPlants.map(p => `${p.species} (${p.category}, ${p.location})`).join(', ');

    const prompt = `You are an expert in companion planting and Indian home gardening.

User's Plants: ${plantList}
Location: ${userConditions.city || 'India'}, ${userConditions.state || ''}
Climate: ${userConditions.climateZone || 'tropical'}
Growing Space: ${userConditions.balconyType || 'balcony'}
Season: ${getCurrentSeason()}

Analyze the compatibility of these plants growing together and suggest improvements.

Return ONLY valid JSON (no markdown):
{
  "compatibilityScore": <number 0-100>,
  "compatibilitySummary": "<brief overall assessment>",
  "goodPairings": [
    {"plants": ["<plant1>", "<plant2>"], "benefit": "<why they grow well together>"}
  ],
  "badPairings": [
    {"plants": ["<plant1>", "<plant2>"], "reason": "<why they should be separated>"}
  ],
  "suggestedCompanions": [
    {"plant": "<new plant name>", "reason": "<why it would complement existing garden>", "benefitsFor": ["<existing plant it helps>"]}
  ],
  "layoutTips": ["<spatial arrangement suggestions>"],
  "pestControlBenefits": [
    {"plant": "<plant name>", "repels": "<pest it repels>", "protects": "<which plants benefit>"}
  ]
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
    console.error('❌ AI companion planting error:', error.message);
    return {
      compatibilityScore: 70,
      compatibilitySummary: 'Your garden has a good mix of plants. Some adjustments could improve growth.',
      goodPairings: [],
      badPairings: [],
      suggestedCompanions: [
        { plant: 'Tulsi (Holy Basil)', reason: 'Natural pest repellent and beneficial for most plants', benefitsFor: ['All plants'] },
        { plant: 'Marigold', reason: 'Repels harmful insects and attracts pollinators', benefitsFor: ['Vegetables', 'Herbs'] }
      ],
      layoutTips: ['Place taller plants on the north side to avoid shading smaller ones', 'Group plants with similar water needs together'],
      pestControlBenefits: []
    };
  }
};

module.exports = {
  generateCareSchedule,
  generateSeasonalTips,
  generateWaterQualityAdvice,
  generateGeneralWaterQualityAdvice,
  generatePlantSuggestions,
  generateSoilSuggestion,
  generateCompanionPlantingSuggestions,
  getCurrentSeason
};