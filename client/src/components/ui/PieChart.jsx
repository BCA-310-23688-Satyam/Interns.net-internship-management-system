function PieChart() {
  return (
    <div>
      <svg
        viewBox="0 0 160 160"
        role="img"
        aria-label="Pie chart showing 90 percent satisfied organizations and students"
      >
        <circle cx="80" cy="80" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="24" />
        <circle
          cx="80"
          cy="80"
          r="52"
          fill="none"
          stroke="#ffd60a"
          strokeWidth="24"
          strokeDasharray="294.05 326.73"
          transform="rotate(-90 80 80)"
        />
        <circle cx="80" cy="80" r="34" fill="#101010" />
        <text x="80" y="76" textAnchor="middle" fill="#f4f4f4" fontSize="22" fontWeight="700">
          90%
        </text>
        <text x="80" y="96" textAnchor="middle" fill="#9f9f9f" fontSize="10">
          Satisfied
        </text>
      </svg>
    </div>
  );
}

export default PieChart;
