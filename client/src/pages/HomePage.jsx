import { Link } from "react-router-dom";

import Card from "../components/ui/Card";
import HeroSection from "../components/ui/HeroSection";
import StatsSection from "../components/ui/StatsSection";

const homepageHighlights = [
  {
    title: "Structured internship publishing",
    description:
      "Keep listings organized with a consistent format that is easier for students to scan and apply to."
  },
  {
    title: "Clear application tracking",
    description:
      "Bring applications, approvals, and follow-ups into a cleaner flow for institutions and recruiters."
  },
  {
    title: "Faster student access",
    description:
      "Reduce friction from discovery to placement with a homepage that surfaces the platform value more clearly."
  }
];

const studentReviews = [
  {
    name: "Rahul Sharma",
    course: "BCA",
    review: "This platform helped me find my first internship quickly and kept the application process easy to follow."
  },
  {
    name: "Priya Nair",
    course: "MBA",
    review: "I could compare opportunities, apply without confusion, and stay updated on each step from one place."
  },
  {
    name: "Aman Verma",
    course: "B.Tech CSE",
    review: "The dashboard and internship listings felt straightforward, and I did not need to jump across multiple tools."
  }
];

function HomePage() {
  return (
    <main className="page home-page">
      <section className="home-hero-shell">
        <HeroSection
          eyebrow="Internship Management Simplified"
          title="'Interns.Net' Internship Management Simplified"
          description="Bring organizations, students, applications, and placements into one focused workflow built to reduce admin overhead and keep internship programs moving."
          actions={[
            <Link key="get-started" to="/register" className="button-primary">
              Get Started
            </Link>,
            <Link key="dashboard" to="/dashboard" className="button-secondary">
              View Dashboard
            </Link>
          ]}
          aside={
            <Card className="hero-card home-hero-panel">
              <div className="home-hero-panel-head">
                <div>
                  <p className="panel-kicker">Program operations</p>
                  <h2>One system for publishing roles, tracking applicants, and guiding placements.</h2>
                </div>
                <div className="home-hero-stat">
                  <strong>24/7</strong>
                  <span>student access</span>
                </div>
              </div>
              <p className="panel-copy">
                Replace fragmented internship coordination with a cleaner experience for both campus
                teams and hiring organizations.
              </p>
              <ul className="feature-list home-feature-list">
                <li>Publish internships with a consistent structure.</li>
                <li>Track applicants and outcomes from a separate dashboard.</li>
                <li>Give students a clearer path from discovery to placement.</li>
              </ul>
            </Card>
          }
        />
      </section>

      <section className="page-section home-feature-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Why Teams Use It</p>
            <h2>Balanced tools for institutions, employers, and students</h2>
          </div>
          <p className="panel-copy section-heading-copy">
            ````````````````````````````````````````````````````````````````````
          </p>
        </div>

        <div className="home-card-grid">
          {homepageHighlights.map((item) => (
            <Card key={item.title} className="home-info-card">
              <div className="home-card-accent" aria-hidden="true" />
              <p className="panel-kicker">Core Benefit</p>
              <h3>{item.title}</h3>
              <p className="row-text">{item.description}</p>
              <div className="home-card-link-wrap">
                <Link to="/dashboard" className="button-secondary home-card-button">
                  Explore Platform
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <StatsSection />

      <section className="page-section home-reviews-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Student Reviews</p>
            <h2>What students say about the platform</h2>
          </div>
          <p className="panel-copy section-heading-copy">
            Sample Reviews.
          </p>
        </div>

        <div className="home-review-grid">
          {studentReviews.map((review) => (
            <Card key={`${review.name}-${review.course}`} className="home-review-card">
              <div className="home-review-head">
                <div>
                  <h3>{review.name}</h3>
                  <p className="home-review-course">{review.course}</p>
                </div>
              </div>
              <p className="home-review-copy">"{review.review}"</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <Link to="/admin/login" className="footer-admin-link">
          Admin
        </Link>
      </footer>
    </main>
  );
}

export default HomePage;
