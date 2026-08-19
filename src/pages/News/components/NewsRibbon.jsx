export function NewsRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1728 1857"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="news-ribbon-radial"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-524.547 -153.666 68.5144 -116.387 1672.11 380.381)"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="0.980426" stopColor="#11651F" />
        </radialGradient>
        <linearGradient
          id="news-ribbon-linear"
          x1="-381.639"
          y1="837.522"
          x2="736.063"
          y2="1490.48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.153846" stopColor="#15351E" />
          <stop offset="1" stopColor="#147D26" />
        </linearGradient>
      </defs>
      <path
        d="M1468 259.456C1281.38 287.128 2275.62 440.163 2085.84 699.238C1887.43 389.367 1164.01 290.606 1340.35 273.711C1520.13 237.02 1259.92 50.2622 1066.17 -249.365C970.443 -164.126 1630.95 241.981 1468 259.456Z"
        fill="url(#news-ribbon-radial)"
      />
      <path
        d="M335.922 967.509C166.611 852.957 -76.4962 438.395 -118.161 386.512C264.569 574.682 109.812 924.032 339.864 1095.4C471.833 1193.7 526.301 1676.42 471.701 1943C561.656 1789.02 605.815 1150.11 335.922 967.509Z"
        fill="url(#news-ribbon-linear)"
      />
    </svg>
  );
}
