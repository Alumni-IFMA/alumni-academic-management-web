export function AuthRibbon() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 1904 1030"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="auth-ribbon-leaf"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-817.84 121.391 -26.4589 -256.851 1067.01 906.666)"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopColor="#147D26" />
        </radialGradient>
      </defs>
      <path
        d="M1105.85 972.375C510.304 1258.27 406.449 1032.81 294.314 1144.63C584.421 1144.2 456.344 1174.63 1034.28 945.812C1591.54 625.571 2036.94 327.02 1932.89 -53C1735.41 306.761 1636.87 752.603 1105.85 972.375Z"
        fill="url(#auth-ribbon-leaf)"
      />
      <path
        d="M342.225 546.982C437.391 633.861 320.046 709.436 350.889 762C251.049 722.969 435.332 569.82 332.859 470.799C255.886 396.42 197.498 122.833 397.208 -113C128.153 111.491 135.13 357.918 342.225 546.982Z"
        fill="#147D26"
      />
      <path
        d="M546.983 880.94C533.76 755.737 351.466 779.576 321.367 708.364C300.202 807.449 584.421 795.963 603.092 934.082C617.117 1037.83 843.073 1018.41 1096.89 971.687C942.096 1043.82 575.759 1153.4 546.983 880.94Z"
        fill="#102716"
      />
    </svg>
  );
}
