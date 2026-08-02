export function OpportunitiesRibbon() {
  return (
    <svg
      className="pointer-events-none absolute top-0 right-0 h-full w-auto max-w-none"
      viewBox="0 0 483 1357"
      preserveAspectRatio="xMaxYMin meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="opportunities-ribbon-leaf"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-201.549 552.407 -200.31 -70.0701 608.722 698.511)"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopColor="#147D26" />
        </radialGradient>
      </defs>
      <path
        d="M481.454 696.38C481.454 1165.24 248.404 1296.16 291.5 1404C394.669 1222.42 400.05 1170.78 436.181 732.184C397.003 275.681 319.518 -6.91648 0 -70C196.898 174.821 507.572 290.173 481.454 696.38Z"
        fill="url(#opportunities-ribbon-leaf)"
      />
    </svg>
  );
}
