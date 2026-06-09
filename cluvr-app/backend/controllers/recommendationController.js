import OpenAI from 'openai';
import Club from '../model/club.js';
import Event from '../model/event.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getRecommendations = async (req, res) => {
  try {
    const { interests, tags, answers } = req.body;

    // Use tags if available, otherwise fall back to interests
    const userTags = tags && tags.length > 0 ? tags : interests;

    if (!userTags || userTags.length === 0) {
      return res.status(400).json({ message: 'Interests or tags are required' });
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

    // Create the prompt for OpenAI with matching logic
    const prompt = `
You are a club and event recommendation system for a university. 

User interests and tags: ${userTags.join(', ')}

Matching logic examples:
- Design + creative → Design club, Drawing club, Photography club
- Tech + problem solving → Coding club, AI club, Developer club
- Social + people → Volunteer club, Debate club, Leadership club
- Sport + challenge → Running club, Basketball club, Fitness club
- Learning + research → Language club, Academic club

Available clubs:
${clubSummary.map(c => `- ${c.name} (Category: ${c.category}, Tags: ${c.tags.join(', ')})`).join('\n')}

Available events:
${eventSummary.map(e => `- ${e.title} (Category: ${e.category})`).join('\n')}

Based on the user's interests and tags, recommend the top 5 clubs and top 5 events that would be most relevant. 
Use the matching logic to find clubs that align with the user's preferences.
Return your response as a JSON object with this exact structure:
{
  "clubs": ["club_id_1", "club_id_2", ...],
  "events": ["event_id_1", "event_id_2", ...],
  "explanation": "Brief explanation of why these recommendations were made based on the user's interests"
}

Only return the JSON, no other text.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides club and event recommendations based on user interests and tags. Always respond with valid JSON."
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
            userTags.some(tag => 
              club.tags.some(clubTag => clubTag.toLowerCase().includes(tag.toLowerCase())) ||
              club.category.toLowerCase().includes(tag.toLowerCase()) ||
              club.name.toLowerCase().includes(tag.toLowerCase())
            )
          )
          .slice(0, 5)
          .map(club => club._id.toString()),
        events: events
          .filter(event =>
            userTags.some(tag =>
              event.category.toLowerCase().includes(tag.toLowerCase()) ||
              event.title.toLowerCase().includes(tag.toLowerCase())
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
      const { interests, tags } = req.body;
      const userTags = tags && tags.length > 0 ? tags : interests;
      const clubs = await Club.find();
      const events = await Event.find().populate('clubId');

      const recommendedClubs = clubs
        .filter(club => 
          userTags.some(tag => 
            club.tags.some(clubTag => clubTag.toLowerCase().includes(tag.toLowerCase())) ||
            club.category.toLowerCase().includes(tag.toLowerCase()) ||
            club.name.toLowerCase().includes(tag.toLowerCase())
          )
        )
        .slice(0, 5);

      const recommendedEvents = events
        .filter(event =>
          userTags.some(tag =>
            event.category.toLowerCase().includes(tag.toLowerCase()) ||
            event.title.toLowerCase().includes(tag.toLowerCase())
          )
        )
        .slice(0, 5);

      res.json({
        clubs: recommendedClubs,
        events: recommendedEvents,
        explanation: "AI service unavailable, using keyword matching based on your interests and tags."
      });
    } catch (fallbackError) {
      res.status(500).json({ message: 'Failed to get recommendations' });
    }
  }
};
