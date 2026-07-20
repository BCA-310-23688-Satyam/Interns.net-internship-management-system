import { useEffect, useMemo, useState } from "react";

import Card from "../components/ui/Card";
import DashboardPanel from "../components/ui/DashboardPanel";
import HeroSection from "../components/ui/HeroSection";
import ApplicationList from "../components/ui/ApplicationList";
import InternshipList from "../components/ui/InternshipList";
import { useAppContext } from "../context/AppContext";
import ApplicationForm, {
  createInitialApplicationForm
} from "../features/student/components/ApplicationForm";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { studentService } from "../services";

function StudentsPage() {
  const { auth } = useAppContext();
  const [allInternships, setAllInternships] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isApplying, setIsApplying] = useState("");
  const [selectedInternshipId, setSelectedInternshipId] = useState("");
  const [applicationForm, setApplicationForm] = useState(() =>
    createInitialApplicationForm({
      fullName: auth.user?.name || "",
      email: auth.user?.email || ""
    })
  );
  const [applicationErrors, setApplicationErrors] = useState({});
  const [error, setError] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [internshipData, applicationData] = await Promise.all([
          studentService.getInternships(),
          studentService.getApplications()
        ]);

        if (!isMounted) {
          return;
        }

        setAllInternships(internshipData.internships || []);
        setInternships(internshipData.internships || []);
        setApplications(applicationData.applications || []);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load the dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [auth.token]);

  useEffect(() => {
    if (!auth.token || !allInternships.length) {
      return;
    }

    let isMounted = true;

    const searchInternships = async () => {
      const normalizedSearch = debouncedSearch.trim();

      if (!normalizedSearch) {
        setInternships(allInternships);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError("");

      try {
        const data = await studentService.searchInternships(normalizedSearch);

        if (isMounted) {
          setInternships(data.internships || []);
        }
      } catch (searchError) {
        if (isMounted) {
          setError(searchError.message || "Unable to search internships.");
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };

    searchInternships();

    return () => {
      isMounted = false;
    };
  }, [allInternships, auth.token, debouncedSearch]);

  useEffect(() => {
    setApplicationForm((current) => ({
      ...current,
      fullName: current.fullName || auth.user?.name || "",
      email: current.email || auth.user?.email || ""
    }));
  }, [auth.user?.email, auth.user?.name]);

  const applicationMap = useMemo(() => {
    return applications.reduce((accumulator, application) => {
      const internshipId = application.internship?.id;

      if (internshipId) {
        accumulator[internshipId] = application;
      }

      return accumulator;
    }, {});
  }, [applications]);

  const validateApplicationForm = () => {
    const nextErrors = {};

    if (!applicationForm.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!applicationForm.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!applicationForm.currentCourse.trim()) {
      nextErrors.currentCourse = "Current course is required.";
    }

    if (!applicationForm.desiredRole.trim()) {
      nextErrors.desiredRole = "Desired role is required.";
    }

    if (!applicationForm.studentIdCard.trim()) {
      nextErrors.studentIdCard = "Student ID card is required.";
    }

    return nextErrors;
  };

  const openApplicationForm = (internshipId) => {
    setSelectedInternshipId(internshipId);
    setApplicationErrors({});
    setApplicationForm(
      createInitialApplicationForm({
        fullName: auth.user?.name || "",
        email: auth.user?.email || ""
      })
    );
    setError("");
  };

  const closeApplicationForm = () => {
    setSelectedInternshipId("");
    setApplicationErrors({});
  };

  const handleApplicationChange = (event) => {
    const { name, value } = event.target;

    setApplicationForm((current) => ({ ...current, [name]: value }));
    setApplicationErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleApply = async (internshipId) => {
    const nextErrors = validateApplicationForm();

    if (Object.keys(nextErrors).length > 0) {
      setApplicationErrors(nextErrors);
      return;
    }

    setIsApplying(internshipId);
    setError("");

    try {
      const data = await studentService.applyToInternship(internshipId, {
        fullName: applicationForm.fullName.trim(),
        email: applicationForm.email.trim(),
        currentCourse: applicationForm.currentCourse.trim(),
        desiredRole: applicationForm.desiredRole.trim(),
        studentIdCard: applicationForm.studentIdCard.trim()
      });

      setApplications((current) => [data.application, ...current]);
      const markApplied = (current) =>
        current.map((internship) =>
          internship.id === internshipId
            ? {
                ...internship,
                status: data.application.status
              }
            : internship
        );

      setAllInternships(markApplied);
      setInternships(markApplied);
      closeApplicationForm();
    } catch (applyError) {
      setError(applyError.message || "Unable to submit application.");
    } finally {
      setIsApplying("");
    }
  };

  const selectedInternship = internships.find((internship) => internship.id === selectedInternshipId);

  return (
    <main className="page">
      <HeroSection
        eyebrow="Student Dashboard"
        title={`Explore internships, ${auth.user?.name}.`}
        description="Search roles, review internship details, submit a complete application, and monitor every submission from one dashboard."
        highlights={[
          `${internships.length} visible roles`,
          `${applications.length} tracked applications`,
          isSearching ? "Live search active" : "Search ready"
        ]}
        aside={
          <Card className="hero-card hero-card-compact">
            <p className="panel-kicker">Search internships</p>
            <label className="search-field">
              <span>Title or company</span>
              <input
                type="search"
                placeholder="Search by title or company"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </Card>
        }
      />

      {error ? <p className="notice notice-error">{error}</p> : null}

      <section className="dashboard-grid">
        <DashboardPanel
          eyebrow="Open roles"
          title="Internships"
          description={isSearching ? "Search results are updating." : "Available opportunities for you."}
        >
          <InternshipList
            internships={internships.map((internship) => ({
              ...internship,
              status: applicationMap[internship.id]?.status || internship.status
            }))}
            isLoading={isLoading || isSearching}
            emptyTitle="No internships found"
            emptyMessage="Try a different search term or return when more roles are posted."
            actionLabel={(internship) => (applicationMap[internship.id] ? "Applied" : "Apply")}
            pendingId={isApplying}
            isActionDisabled={(internship) => Boolean(applicationMap[internship.id])}
            onAction={(internship) => {
              if (applicationMap[internship.id]) {
                return;
              }

              openApplicationForm(internship.id);
            }}
            renderDetails={(internship) => (
              <div className="detail-grid">
                <span className="detail-chip">Duration: {internship.duration || "Not provided"}</span>
                <span className="detail-chip">
                  Skills: {internship.requiredSkills || "Not provided"}
                </span>
              </div>
            )}
            renderMeta={(internship) =>
              applicationMap[internship.id] ? <span className="inline-note">Application already submitted</span> : null
            }
          />

          {selectedInternshipId ? (
            <ApplicationForm
              errors={applicationErrors}
              internshipTitle={selectedInternship?.title || "Apply to internship"}
              isSubmitting={isApplying === selectedInternshipId}
              values={applicationForm}
              onCancel={closeApplicationForm}
              onChange={handleApplicationChange}
              onSubmit={(event) => {
                event.preventDefault();
                handleApply(selectedInternshipId);
              }}
            />
          ) : null}
        </DashboardPanel>

        <DashboardPanel
          eyebrow="Progress"
          title="Applications"
          description="Your submitted internships and their latest status."
        >
          <ApplicationList
            applications={applications}
            isLoading={isLoading}
            emptyTitle="No applications yet"
            emptyMessage="Applications will appear here after you apply to an internship."
          />
        </DashboardPanel>
      </section>
    </main>
  );
}

export default StudentsPage;
