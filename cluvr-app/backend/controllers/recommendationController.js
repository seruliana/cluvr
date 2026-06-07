import OpenAI from 'openai';
import Club from '../model/club.js';
import Event from '../model/event.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getRecommendations = async (req, res) => {
  try {
    const { interests } = req.body;

    if (!interests || interests.length === 0) {
      return res.status(400).json({ message: 'Interests are required' });
    }

    // Fetch all clubs and events
    const clubs = await Club.find();
    const events = await Event.find().populate('clubId');

    // Create a summary of available clubs and events
    const clubSummary = clubs.map(club => ({
      id: club._id,
      name: club.name,
      category: club.category,
      tags: club.tags,
      description: club.description.substring(0, 200),
    }));

    const eventSummary = events.map(event => ({
      id: event._id,
      title: event.title,
      category: event.category,
      description: event.description.substring(0, 200),
    }));

    // Create the prompt for OpenAI
    const prompt = `
You are a club and event recommendation system for a university. 

User interests: ${interests.join(', ')}

Available clubs:
${clubSummary.map(c => `- ${c.name} (Category: ${c.category}, Tags: ${c.tags.join(', ')})`).join('\n')}

Available events:
${eventSummary.map(e => `- ${e.title} (Category: ${e.category})`).join('\n')}

Based on the user's interests, recommend the top 5 clubs and top 5 events that would be most relevant. 
Return your response as a JSON object with this exact structure:
{
  "clubs": ["club_id_1", "club_id_2", ...],
  "events": ["event_id_1", "event_id_2", ...],
  "explanation": "Brief explanation of why these recommendations were made"
}

Only return the JSON, no other text.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides club and event recommendations based on user interests. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Parse the JSON response
    let recommendations;
    try {
      // Remove markdown code blocks if present
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '');
      recommendations = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      // Fallback to simple matching if AI fails
      recommendations = {
        clubs: clubs
          .filter(club => 
            interests.some(interest => 
              club.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
              club.category.toLowerCase().includes(interest.toLowerCase())
            )
          )
          .slice(0, 5)
          .map(club => club._id.toString()),
        events: events
          .filter(event =>
            interests.some(interest =>
              event.category.toLowerCase().includes(interest.toLowerCase())
            )
          )
          .slice(0, 5)
          .map(event => event._id.toString()),
        explanation: "AI recommendation service unavailable, using keyword matching instead."
      };
    }

    // Fetch full details for recommended clubs and events
    const recommendedClubs = await Club.find({ _id: { $in: recommendations.clubs } });
    const recommendedEvents = await Event.find({ _id: { $in: recommendations.events } }).populate('clubId');

    res.json({
      clubs: recommendedClubs,
      events: recommendedEvents,
      explanation: recommendations.explanation
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    
    // Fallback to simple matching if API fails
    try {
      const { interests } = req.body;
      const clubs = await Club.find();
      const events = await Event.find().populate('clubId');

      const recommendedClubs = clubs
        .filter(club => 
          interests.some(interest => 
            club.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
            club.category.toLowerCase().includes(interest.toLowerCase())
          )
        )
        .slice(0, 5);

      const recommendedEvents = events
        .filter(event =>
          interests.some(interest =>
            event.category.toLowerCase().includes(interest.toLowerCase())
          )
        )
        .slice(0, 5);

      res.json({
        clubs: recommendedClubs,
        events: recommendedEvents,
        explanation: "AI service unavailable, using keyword matching based on your interests."
      });
    } catch (fallbackError) {
      res.status(500).json({ message: 'Failed to get recommendations' });
    }
  }
};
