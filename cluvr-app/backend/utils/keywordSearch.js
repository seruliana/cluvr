const SYNONYMS = {
  code: ['code', 'coding', 'programming', 'hackathon', 'hackum', 'technology', 'software', 'developer', 'tech'],
  hackathon: ['hackathon', 'hackum', 'coding', 'programming', 'technology', 'innovation'],
  hackum: ['hackum', 'hackathon', 'coding', 'programming', 'technology'],
  tech: ['technology', 'programming', 'coding', 'software', 'hackathon', 'hackum', 'innovation'],
  art: ['art', 'arts', 'design', 'creative', 'photography', 'performance'],
  sport: ['sport', 'sports', 'fitness', 'athletics', 'health', 'basketball'],
  music: ['music', 'performance', 'concert', 'band'],
  business: ['business', 'entrepreneurship', 'marketing', 'finance', 'professional'],
  volunteer: ['volunteer', 'community', 'social', 'service'],
  science: ['science', 'research', 'physics', 'biology', 'academic'],
};

function expandSearchTerms(query) {
  const q = query.toLowerCase().trim();
  const terms = new Set([q]);
  for (const [key, values] of Object.entries(SYNONYMS)) {
    if (q.includes(key) || values.some(v => q.includes(v))) {
      terms.add(key);
      values.forEach(v => terms.add(v));
    }
  }
  return [...terms];
}

function collectClubText(club) {
  return [
    club.name,
    club.category,
    club.description,
    club.mission,
    club.vision,
    club.schedule,
    ...(club.tags || []),
    ...(club.activities || []),
  ].filter(Boolean).join(' ').toLowerCase();
}

function collectEventText(event) {
  return [
    event.title,
    event.category,
    event.description,
    event.location,
    event.clubId?.name,
  ].filter(Boolean).join(' ').toLowerCase();
}

export function keywordSearchClubs(clubs, query) {
  const terms = expandSearchTerms(query);
  return clubs.filter(club => {
    const text = collectClubText(club);
    return terms.some(term => text.includes(term));
  });
}

export function keywordSearchEvents(events, query) {
  const terms = expandSearchTerms(query);
  return events.filter(event => {
    const text = collectEventText(event);
    return terms.some(term => text.includes(term));
  });
}

export function keywordScoreClub(club, query) {
  const terms = expandSearchTerms(query);
  const text = collectClubText(club);
  return terms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
}
