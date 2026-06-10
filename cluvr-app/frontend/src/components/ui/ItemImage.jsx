import { useState } from 'react'
import { getItemImage } from '../../utils/helpers'

export default function ItemImage({
  item,
  alt = '',
  className = 'w-full h-full object-cover',
  gradient = 'from-brand-lt to-violet-200',
}) {
  const [failed, setFailed] = useState(false)
  const src = getItemImage(item)

  if (failed) {
    return (
      <div className={`bg-gradient-to-br ${gradient} flex items-center justify-center text-5xl ${className}`}>
        {item?.emoji || '📌'}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt || item?.name || item?.title || ''}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
