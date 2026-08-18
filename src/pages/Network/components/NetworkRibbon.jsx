export function NetworkRibbon() {
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full translate-y-[-90px]"
        style={{ transform: "scaleY(0.6)" }}
        viewBox="0 0 1728 554"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="rede-ribbon-top"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(753.995 288.184 -109.76 243.026 1007.15 88.1752)"
            gradientUnits="userSpaceOnUse"
          >
            <stop />
            <stop offset="1" stopColor="#147D26" />
          </radialGradient>
        </defs>
        <path
          d="M1018.63 11.7433C1501.48 62.3125 1382.98 156.813 1793.46 251.283C1570.98 70.2891 1293.48 81.8125 983.981 62.3125C348.028 78.8129 32.5157 162.893 -75 553.961C277.054 327.404 452.481 -73.6875 1018.63 11.7433Z"
          fill="url(#rede-ribbon-top)"
        />
      </svg>

      <svg
        className="pointer-events-none absolute inset-0 w-full h-full translate-y-[250px]"
        viewBox="0 0 1728 506"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="rede-ribbon-bottom"
            x1="49.5641"
            y1="-74.2411"
            x2="1875.93"
            y2="575.216"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#15351E" />
            <stop offset="0.943634" stopColor="#08A423" />
            <stop offset="1" stopColor="#147D26" />
          </linearGradient>
        </defs>
        <path
          d="M620.207 422.391C545.226 169.837 137.113 248.934 -221.955 0.000687403C-216.599 201.491 614.881 314.245 763.957 565.899C841.182 696.263 1290.68 636.902 1898 404.773C1664.01 558.599 783.378 971.99 620.207 422.391Z"
          fill="url(#rede-ribbon-bottom)"
        />
      </svg>
    </>
  );
}