export function ContactRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full translate-y-[-60px]"
      viewBox="0 0 1728 1117"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="contact-ribbon-linear"
          x1="-407.393"
          y1="470.19"
          x2="815.697"
          y2="894.052"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.153846" stopColor="#15351E" />
          <stop offset="1" stopColor="#147D26" />
        </linearGradient>
        <radialGradient
          id="contact-ribbon-radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(1811.95 658.501) rotate(147.283) scale(1045.34 1097.24)"
        >
          <stop stopColor="#147D26" />
          <stop offset="0.775284" stopColor="#15351E" />
        </radialGradient>
      </defs>
      <path
        d="M321.754 458.587C133.446 379.036 -185.425 19.4745 -236.358 -23.3451C175.592 87.0482 91.5051 459.775 350.418 583.286C498.941 654.137 332.919 951.001 920 1043.5C405.5 1109 621.93 585.398 321.754 458.587Z"
        fill="url(#contact-ribbon-linear)"
      />
      <path
        d="M1739.5 699.999C1927.81 620.447 2136.51 727.321 2187.44 684.501C1775.49 794.895 1917.36 681.489 1658.44 805C1509.92 875.851 1478.08 954.002 891.001 1046.5C1405.5 1112 1439.32 826.81 1739.5 699.999Z"
        fill="url(#contact-ribbon-radial)"
      />
    </svg>
  );
}
