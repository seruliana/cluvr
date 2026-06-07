import Event from '../model/event.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search, clubId, aiSearch } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (clubId) {
      query.clubId = clubId;
    }

    const events = await Event.find(query).populate('clubId', 'name emoji').sort({ date: 1 });

    // If AI search is enabled, use semantic search
    if (aiSearch && search) {
      try {
        const searchResults = await semanticEventSearch(events, search);
        return res.status(200).json({
          success: true,
          count: searchResults.length,
          data: searchResults,
          aiSearch: true
        });
      } catch (aiError) {
        console.error('AI search failed, falling back to regex search:', aiError);
        // Fall back to regex search if AI fails
      }
    }

    // Regular regex-based search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
      const filteredEvents = await Event.find(query).populate('clubId', 'name emoji').sort({ date: 1 });
      return res.status(200).json({
        success: true,
        count: filteredEvents.length,
        data: filteredEvents,
        aiSearch: false
      });
    }

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
      aiSearch: false
    });
  } catch (error) {
    next(error);
  }
};

// Helper function for AI semantic search for events
async function semanticEventSearch(events, searchQuery) {
  // Create a summary of all events
  const eventSummaries = events.map(event => ({
    id: event._id.toString(),
    title: event.title,
    category: event.category,
    description: event.description,
    date: event.date,
    location: event.location,
    clubName: event.clubId?.name || 'Unknown'
  }));

  const prompt = `
You are a semantic search assistant for a university event discovery platform.

User search query: "${searchQuery}"

Available events:
${eventSummaries.map((event, index) => `
${index + 1}. ${event.title}
   Category: ${event.category}
   Description: ${event.description}
   Date: ${event.date}
   Location: ${event.location}
   Club: ${event.clubName}
`).join('\n')}

Based on the user's search query, rank the events by relevance to the query. Consider the meaning and intent behind the search, not just exact keyword matches.

Return your response as a JSON object with this exact structure:
{
  "matches": ["event_id_1", "event_id_2", "event_id_3", ...],
  "explanation": "Brief explanation of why these events match the search query"
}

Only include events that are relevant to the search query. If no events are relevant, return an empty array for matches.
Only return the JSON, no other text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides semantic search results for events. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content.trim();

    // Parse the JSON response
    let result;
    try {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '');
      result = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      // Fallback to empty results
      return [];
    }

    // Filter events based on AI matches
    const matchedEvents = events.filter(event =>
      result.matches && result.matches.includes(event._id.toString())
    );

    return matchedEvents;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId', 'name emoji description location');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin/Club Admin)
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/Club Admin)
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Club Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike event
// @route   POST /api/events/:id/like
// @access  Private
export const likeEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const isLiked = event.likes.includes(req.user.id);
    
    if (isLiked) {
      event.likes.pull(req.user.id);
    } else {
      event.likes.push(req.user.id);
    }
    
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event,
      liked: !isLiked
    });
  } catch (error) {
    next(error);
  }
};
