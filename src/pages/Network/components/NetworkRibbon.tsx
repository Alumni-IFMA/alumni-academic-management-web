export function NetworkRibbon() {
  return (
    <svg
      className="pointer-events-none absolute left-0 right-0 top-[230px] bottom-0 w-full"
      viewBox="0 0 1728 1786"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="rede-ribbon-bottom"
          x1="49.5641"
          y1="1205.83"
          x2="1875.93"
          y2="1855.28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#15351E" />
          <stop offset="0.943634" stopColor="#08A423" />
          <stop offset="1" stopColor="#147D26" />
        </linearGradient>
        <radialGradient
          id="rede-ribbon-top"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(753.995 288.184 -109.76 243.026 1007.15 135.47)"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopColor="#147D26" />
        </radialGradient>
      </defs>
      <path
        d="M620.207 1702.46C545.226 1449.9 137.113 1529 -221.955 1280.07C-216.599 1481.56 614.881 1594.31 763.957 1845.97C841.182 1976.33 1290.68 1916.97 1898 1684.84C1664.01 1838.67 783.378 2252.06 620.207 1702.46Z"
        fill="url(#rede-ribbon-bottom)"
      />
      <path
        d="M1018.63 59.0382C1501.48 109.607 1382.98 204.107 1793.46 298.578C1570.98 117.584 1293.48 129.107 983.981 109.607C348.028 126.108 32.5157 210.188 -75 601.256C277.054 374.699 452.481 -26.3926 1018.63 59.0382Z"
        fill="url(#rede-ribbon-top)"
      />
    </svg>
  );
}