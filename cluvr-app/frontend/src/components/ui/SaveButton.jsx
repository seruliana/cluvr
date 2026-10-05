export default function SaveButton({ saved = false, onClick, className = '', size = 16 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`save-btn w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 border-none cursor-pointer flex items-center justify-center shadow-md transition-transform hover:scale-110 ${saved ? 'saved' : ''} ${className}`}
      aria-label={saved ? 'Saved' : 'Save'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          stroke={saved ? '#5b3ff8' : 'currentColor'}
          fill={saved ? '#5b3ff8' : 'none'}
          strokeWidth="2"
          className="text-muted dark:text-gray-300"
        />
      </svg>
    </button>
  )
}
