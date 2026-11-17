// Decorative line-art mandala. Inherits colour from `currentColor`.

const ring = (n: number) => Array.from({ length: n }, (_, i) => (i * 360) / n);

export function Mandala({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-150 -150 300 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      className={className}
      aria-hidden
    >
      <circle r="40" />
      <circle r="44" />
      <circle r="6" />

      {/* Inner lotus */}
      {ring(12).map((a) => (
        <path key={`p12-${a}`} transform={`rotate(${a})`} d="M0 -44 C9 -52 9 -62 0 -70 C-9 -62 -9 -52 0 -44 Z" />
      ))}
      {ring(12).map((a) => (
        <path key={`s12-${a}`} transform={`rotate(${a})`} d="M0 -8 C3 -18 3 -30 0 -38 C-3 -30 -3 -18 0 -8 Z" />
      ))}

      <circle r="74" />

      {/* Small petals */}
      {ring(24).map((a) => (
        <path key={`p24-${a}`} transform={`rotate(${a})`} d="M0 -76 C5 -81 5 -87 0 -92 C-5 -87 -5 -81 0 -76 Z" />
      ))}

      {/* Dot ring */}
      <g fill="currentColor" stroke="none">
        {ring(48).map((a) => (
          <circle key={`d-${a}`} transform={`rotate(${a})`} cy="-98" r="1.1" />
        ))}
      </g>

      {/* Outer lotus */}
      {ring(16).map((a) => (
        <g key={`p16-${a}`} transform={`rotate(${a})`}>
          <path d="M0 -102 C16 -112 16 -126 0 -136 C-16 -126 -16 -112 0 -102 Z" />
          <path d="M0 -108 C7 -114 7 -122 0 -128 C-7 -122 -7 -114 0 -108 Z" />
        </g>
      ))}

      <circle r="140" />

      {/* Scalloped edge */}
      {ring(32).map((a) => (
        <path key={`sc-${a}`} transform={`rotate(${a})`} d="M-13.7 -140 Q0 -152 13.7 -140" />
      ))}
    </svg>
  );
}
