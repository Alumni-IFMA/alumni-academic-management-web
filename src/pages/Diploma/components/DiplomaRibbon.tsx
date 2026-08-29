export function DiplomaRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1583 927"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="diploma-ribbon-leaf"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-146.467 413.061 -145.567 -52.3948 1536.32 540.652)"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopColor="#147D26" />
        </radialGradient>
      </defs>
      <path
        d="M596.609 149.1C639.838 9.93924 801.069 37.9718 846.36 -40.9913C841.151 69.4028 583.392 54.2638 531.959 207.746C493.325 323.034 -76.8724 259.237 -298 205.158C-173.985 286.685 502.536 451.936 596.609 149.1Z"
        fill="var(--color-dark-green)"
      />
      <path
        d="M1581.88 539.058C1581.88 889.65 1433.19 881.364 1464.51 962C1539.49 826.225 1522.72 893.794 1548.98 565.831C1520.51 224.482 1464.2 13.1706 1232 -34C1375.09 149.064 1600.86 235.318 1581.88 539.058Z"
        fill="url(#diploma-ribbon-leaf)"
      />
    </svg>
  );
}
