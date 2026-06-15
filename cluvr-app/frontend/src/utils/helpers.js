export function toId(item) {
  return typeof item === 'object' && item?._id ? item._id : item
}

export function parseEventDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

export function isEventPast(event) {
  const d = parseEventDate(event?.date)
  if (!d) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export function splitEventsByDate(events = []) {
  const upcoming = []
  const past = []
  for (const ev of events) {
    if (isEventPast(ev)) past.push(ev)
    else upcoming.push(ev)
  }
  return { upcoming, past }
}

export function getItemImage(item) {
  if (item?.image) return item.image
  const seed = encodeURIComponent(item?.name || item?.title || item?.id || 'cluvr')
  return `https://picsum.photos/seed/${seed}/640/480`
}

export function getClubName(event) {
  if (typeof event?.clubId === 'object' && event.clubId?.name) return event.clubId.name
  if (typeof event?.club === 'string' && event.club !== 'Unknown') return event.club
  return 'Campus Event'
}

export function formatEventMonthYear(dateStr) {
  const d = parseEventDate(dateStr)
  if (!d) return 'TBD'
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function getEventCardBadge(event) {
  const past = isEventPast(event)
  const when = formatEventMonthYear(event?.date)
  return {
    badge: past ? `Past · ${when}` : `Upcoming · ${when}`,
    badgeColor: past ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200' : 'bg-orange-50 text-orange-600',
  }
}

export function getClubActivityStatus(clubId, allEvents = []) {
  const events = Array.isArray(allEvents) ? allEvents : []
  const id = toId(clubId)
  const clubEvents = events.filter((e) => toId(e?.clubId) === id)
  if (clubEvents.length === 0) {
    return { label: 'Inactive', badgeColor: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200' }
  }

  const dates = clubEvents.map((e) => parseEventDate(e.date)).filter(Boolean).sort((a, b) => b - a)
  const latest = dates[0]
  if (!latest) {
    return { label: 'Inactive', badgeColor: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200' }
  }

  const now = new Date()
  const oneMonthAgo = new Date(now)
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const twoMonthsAgo = new Date(now)
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

  if (latest >= oneMonthAgo) {
    return { label: 'Active', badgeColor: 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200' }
  }
  if (latest >= twoMonthsAgo) {
    return { label: 'Average', badgeColor: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200' }
  }
  return { label: 'Inactive', badgeColor: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200' }
}

export function getClubGalleryImages(club, count = 4) {
  const images = []
  if (club?.image) images.push(club.image)
  const base = encodeURIComponent(club?.name || 'club')
  for (let i = images.length; i < count; i += 1) {
    images.push(`https://picsum.photos/seed/${base}-${i}/400/300`)
  }
  return images.slice(0, count)
}
