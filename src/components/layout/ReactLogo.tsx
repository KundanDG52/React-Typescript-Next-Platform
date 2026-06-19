/** Ambient animated React atom logo for backgrounds */
export function ReactLogo({ className = '', size = 600, opacity = 0.05 }: { className?: string; size?: number; opacity?: number }) {
  return (
    <svg className={`${className} animate-spin-slow pointer-events-none`} width={size} height={size} viewBox="-12 -11 24 22" style={{ opacity }}>
      <circle r="2" fill="#61dafb" />
      <g stroke="#61dafb" strokeWidth="0.5" fill="none">
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  )
}
