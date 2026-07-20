function clampPercentage(value) {
  return Math.max(0, Math.min(100, Math.round(value || 0)));
}

export function buildMetricRows(stats = {}) {
  const companies = Math.max(0, Math.round(stats.companies || 0));
  const satisfaction = clampPercentage(stats.satisfaction);
  const placements = clampPercentage(stats.placements);
  const activeInternships = Math.max(0, Math.round(stats.activeInternships || 0));

  return [
    {
      title: "Companies Enrolled",
      value: `${companies}+`,
      description: `${companies} companies are actively using InternNet to source and manage internship talent.`
    },
    {
      title: "Intern Satisfaction",
      value: `${satisfaction}%`,
      description: "Most students report positive internship experiences across discovery, application, and onboarding.",
      progress: satisfaction
    },
    {
      title: "Successful Placements",
      value: `${placements}%`,
      description: "A strong share of submitted applications convert into successful placement outcomes.",
      progress: placements
    },
    {
      title: "Active Internships",
      value: `${activeInternships}+`,
      description: `${activeInternships} active opportunities are currently moving through the platform pipeline.`
    }
  ];
}
