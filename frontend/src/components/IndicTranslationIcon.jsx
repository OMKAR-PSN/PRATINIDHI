export default function IndicTranslationIcon({ className = '', ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      className={className}
      {...props}
    >
      <text x="4" y="12" fontSize="12" fontWeight="800" fontFamily="sans-serif" fill="currentColor">अ</text>
      <text x="12" y="21" fontSize="14" fontWeight="800" fontFamily="sans-serif" fill="currentColor">A</text>
    </svg>
  )
}
