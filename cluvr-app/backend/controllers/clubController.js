import Club from '../model/club.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
export const getClubs = async (req, res, next) => {
  try {
    const { category, search, aiSearch } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    const clubs = await Club.find(query).sort({ createdAt: -1 });

    // If AI search is enabled, use semantic search
    if (aiSearch && search) {
      try {
        const searchResults = await semanticSearch(clubs, search);
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
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
      const filteredClubs = await Club.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: filteredClubs.length,
        data: filteredClubs,
        aiSearch: false
      });
    }

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
      aiSearch: false
    });
  } catch (error) {
    next(error);
  }
};

// Helper function for AI semantic search
async function semanticSearch(clubs, searchQuery) {
  // Create a summary of all clubs
  const clubSummaries = clubs.map(club => ({
    id: club._id.toString(),
    name: club.name,
    category: club.category,
    description: club.description,
    tags: club.tags,
    mission: club.mission || '',
    vision: club.vision || '',
    activities: club.activities || []
  }));

  const prompt = `
You are a semantic search assistant for a university club discovery platform.

User search query: "${searchQuery}"

Available clubs:
${clubSummaries.map((club, index) => `
${index + 1}. ${club.name}
   Category: ${club.category}
   Description: ${club.description}
   Tags: ${club.tags.join(', ')}
   Mission: ${club.mission}
   Vision: ${club.vision}
   Activities: ${club.activities.join(', ')}
`).join('\n')}

Based on the user's search query, rank the clubs by relevance to the query. Consider the meaning and intent behind the search, not just exact keyword matches.

Return your response as a JSON object with this exact structure:
{
  "matches": ["club_id_1", "club_id_2", "club_id_3", ...],
  "explanation": "Brief explanation of why these clubs match the search query"
}

Only include clubs that are relevant to the search query. If no clubs are relevant, return an empty array for matches.
Only return the JSON, no other text.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides semantic search results for clubs. Always respond with valid JSON."
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

    // Filter clubs based on AI matches
    const matchedClubs = clubs.filter(club =>
      result.matches && result.matches.includes(club._id.toString())
    );

    return matchedClubs;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
export const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).populate('followers', 'name email');
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private (Admin)
export const createClub = async (req, res, next) => {
  try {
    const club = await Club.create(req.body);
    
    res.status(201).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
// @access  Private (Admin)
export const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin)
export const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
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

// @desc    Follow/Unfollow club
// @route   POST /api/clubs/:id/follow
// @access  Private
export const followClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }
    
    const isFollowing = club.followers.includes(req.user.id);
    
    if (isFollowing) {
      club.followers.pull(req.user.id);
    } else {
      club.followers.push(req.user.id);
    }
    
    await club.save();
    
    res.status(200).json({
      success: true,
      data: club,
      following: !isFollowing
    });
  } catch (error) {
    next(error);
  }
};
