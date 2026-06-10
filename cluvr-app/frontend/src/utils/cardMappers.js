import { getClubActivityStatus, getEventCardBadge, formatEventMonthYear } from './helpers'

export function mapClubToCard(club, allEvents = []) {
  const activity = getClubActivityStatus(club._id, allEvents)
  return {
    id: club._id,
    type: 'club',
    image: club.image,
    gradient: club.gradient || 'from-brand-lt to-violet-200',
    emoji: club.emoji || '🎓',
    badge: activity.label,
    badgeColor: activity.badgeColor,
    org: club.category,
    club: `${club.members || 0} members`,
    catLabel: club.category,
    title: club.name,
    desc: club.description,
    meta: [`📍 ${club.location || 'TBD'}`],
    location: club.location,
    action: 'Follow Club',
    activityLabel: activity.label,
  }
}

export function mapEventToCard(event) {
  const timing = getEventCardBadge(event)
  const when = formatEventMonthYear(event.date)
  return {
    id: event._id,
    type: 'event',
    image: event.image,
    date: event.date,
    gradient: event.gradient || 'from-brand-lt to-violet-200',
    emoji: event.emoji || '📅',
    badge: timing.badge,
    badgeColor: timing.badgeColor,
    org: event.clubId?.name || 'Campus Event',
    club: event.clubId?.name || 'Unknown',
    catLabel: event.category || 'Events',
    title: event.title,
    desc: event.description,
    meta: [
      `📅 ${when}${event.time ? ` · ${event.time}` : ''}`,
      `📍 ${event.location || 'TBD'}`,
    ].filter(Boolean),
    dateStr: `${when}${event.time ? ` · ${event.time}` : ''}`,
    location: event.location,
    action: 'Register Now',
    eventTiming: timing.badge,
  }
}

export function combineClubEventCards(clubs, events) {
  const clubCards = clubs.map((club) => mapClubToCard(club, events))
  const eventCards = events.map(mapEventToCard)
  const combined = []
  const maxLength = Math.max(clubCards.length, eventCards.length)
  for (let i = 0; i < maxLength; i++) {
    if (eventCards[i]) combined.push(eventCards[i])
    if (clubCards[i]) combined.push(clubCards[i])
  }
  return combined
}
