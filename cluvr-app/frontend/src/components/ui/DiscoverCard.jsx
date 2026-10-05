import ItemImage from './ItemImage'
import SaveButton from './SaveButton'

export default function DiscoverCard({
  card,
  index = 0,
  saved = false,
  followed = false,
  registered = false,
  onNavigate,
  onSave,
  onAction,
}) {
  const isDone = card.type === 'club' ? followed : registered

  return (
    <div
      onClick={() => onNavigate(card)}
      className="card reveal border border-border rounded-2xl overflow-hidden bg-card dark:bg-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-brand-lg cursor-pointer"
      style={{
        transitionDelay: `${index * 0.08}s`,
        animation: `fadeUp 0.5s ${index * 0.08}s ease both`,
      }}
    >
      <div className="relative h-44 overflow-hidden">
        <ItemImage item={card} className="card-img-inner w-full h-full object-cover transition-transform duration-300" gradient={card.gradient} />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${card.badgeColor}`}>
            {card.badge || card.catLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
          <SaveButton saved={saved} onClick={(e) => onSave(card, e)} />
        </div>
      </div>

      <div className="p-4">
        <span className="text-xs font-semibold text-brand">{card.org}</span>
        <h3 className="font-bold text-[1.05rem] text-ink mb-2 leading-tight mt-1">{card.title}</h3>
        <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{card.desc}</p>
        {card.meta?.length > 0 && (
          <div className="flex flex-col gap-1 mb-3 text-xs text-muted">
            {card.meta.slice(0, 2).map(m => (
              <div key={m} className="flex items-center gap-1.5">{m}</div>
            ))}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onAction(card) }}
          disabled={isDone}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium cursor-pointer border-none transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed"
          style={{
            background: isDone ? '#10b981' : card.type === 'club' ? 'transparent' : '#5b3ff8',
            color: card.type === 'club' && !isDone ? '#5b3ff8' : 'white',
            border: card.type === 'club' && !isDone ? '2px solid #5b3ff8' : 'none',
          }}
        >
          {registered ? '✅ Registered!' : followed ? '✓ Following' : card.action}
        </button>
      </div>
    </div>
  )
}
