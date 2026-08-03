export function DecorativeRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1728 1337"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="decorative-ribbon-leaf"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-121.171 372.344 -120.426 -47.23 1026.763 513.006)"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopColor="#147D26" />
        </radialGradient>
      </defs>
      <path
        d="M1291.45 1191.92C1291.45 1322.96 1128.24 1386.03 961.076 1428.93C1055.776 1351.23 1247.01 1322.96 1247.01 1191.92C1247.01 985.651 996.031 957.889 841 946.014C1011.717 928.862 1291.45 958.823 1291.45 1191.92Z"
        fill="var(--color-ribbon)"
      />
      <path
        d="M1064.449 511.57C1064.449 827.602 941.446 820.132 967.355 892.82C1029.38 770.429 1015.51 831.337 1037.231 535.703C1013.678 228.002 967.094 37.5207 775 -5C893.375 160.019 1080.152 237.77 1064.449 511.57Z"
        fill="url(#decorative-ribbon-leaf)"
      />
    </svg>
  );
}
