import { useCallback, useEffect, useMemo, useState } from "react";

import Card from "../components/ui/Card";
import DashboardPanel from "../components/ui/DashboardPanel";
import HeroSection from "../components/ui/HeroSection";
import ApplicationList from "../components/ui/ApplicationList";
import InternshipList from "../components/ui/InternshipList";
import { useAppContext } from "../context/AppContext";
import InternshipComposer from "../features/company/components/InternshipComposer";
import { companyService } from "../services";

const INITIAL_FORM_VALUES = {
  title: "",
  description: "",
  duration: "",
  requiredSkills: ""
};

function CompaniesPage() {
  const { auth } = useAppContext();
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState("");
  const [editingInternshipId, setEditingInternshipId] = useState("");
  const [applicationViews, setApplicationViews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInternships = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await companyService.getInternships();

        if (!isMounted) {
          return;
        }

        const nextInternships = data.internships || [];
        setInternships(nextInternships);
        setSelectedInternshipId(nextInternships[0]?.id || "");
        setApplicationViews(
          nextInternships.reduce((accumulator, internship) => {
            accumulator[internship.id] = {
              applications: [],
              hasLoaded: false,
              isLoading: false,
              query: ""
            };

            return accumulator;
          }, {})
        );
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load internships.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInternships();

    return () => {
      isMounted = false;
    };
  }, [auth.token]);

  const applicantCount = useMemo(
    () => internships.reduce((total, internship) => total + (internship.applicantCount || 0), 0),
    [internships]
  );

  const resetComposer = () => {
    setEditingInternshipId("");
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormValues((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formValues.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formValues.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!formValues.duration.trim()) {
      nextErrors.duration = "Duration is required.";
    }

    if (!formValues.requiredSkills.trim()) {
      nextErrors.requiredSkills = "Required skills are required.";
    }

    return nextErrors;
  };

  const handleCreateOrUpdateInternship = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        duration: formValues.duration.trim(),
        requiredSkills: formValues.requiredSkills.trim()
      };
      const data = editingInternshipId
        ? await companyService.updateInternship(editingInternshipId, payload)
        : await companyService.createInternship(payload);

      setInternships((current) => {
        if (editingInternshipId) {
          return current.map((internship) =>
            internship.id === editingInternshipId ? data.internship : internship
          );
        }

        return [data.internship, ...current];
      });
      setSelectedInternshipId(data.internship.id);
      setApplicationViews((current) => ({
        ...current,
        [data.internship.id]: current[data.internship.id] || {
          applications: [],
          hasLoaded: false,
          isLoading: false,
          query: ""
        }
      }));
      resetComposer();
    } catch (submitError) {
      setError(
        submitError.message || (editingInternshipId ? "Unable to update internship." : "Unable to post internship.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInternship = (internship) => {
    setEditingInternshipId(internship.id);
    setSelectedInternshipId(internship.id);
    setFormErrors({});
    setFormValues({
      title: internship.title || "",
      description: internship.description || "",
      duration: internship.duration || "",
      requiredSkills: internship.requiredSkills || ""
    });
    setError("");
  };

  const handleApplicantSearchChange = (internshipId, value) => {
    setApplicationViews((current) => ({
      ...current,
      [internshipId]: {
        ...(current[internshipId] || {}),
        query: value
      }
    }));
  };

  const loadApplicants = useCallback(async (internshipId, query = "") => {
    setApplicationViews((current) => ({
      ...current,
      [internshipId]: {
        ...(current[internshipId] || {}),
        isLoading: true
      }
    }));

    try {
      const data = await companyService.getApplicants(internshipId, query);

      setApplicationViews((current) => ({
        ...current,
        [internshipId]: {
          ...(current[internshipId] || {}),
          applications: data.applications || [],
          hasLoaded: true,
          isLoading: false
        }
      }));
    } catch (loadError) {
      setError(loadError.message || "Unable to load applicants.");
      setApplicationViews((current) => ({
        ...current,
        [internshipId]: {
          ...(current[internshipId] || {}),
          isLoading: false
        }
      }));
    }
  }, []);

  const handleUpdateStatus = async (internshipId, applicationId, status) => {
    setIsUpdating(applicationId);
    setError("");

    try {
      const data = await companyService.updateApplicationStatus(applicationId, status);

      setApplicationViews((current) => ({
        ...current,
        [internshipId]: {
          ...(current[internshipId] || {}),
          applications: (current[internshipId]?.applications || []).map((application) =>
            application.id === applicationId ? data.application : application
          )
        }
      }));
    } catch (updateError) {
      setError(updateError.message || "Unable to update applicant status.");
    } finally {
      setIsUpdating("");
    }
  };

  useEffect(() => {
    if (!selectedInternshipId || applicationViews[selectedInternshipId]?.applications?.length) {
      return;
    }

    if (applicationViews[selectedInternshipId]?.hasLoaded) {
      return;
    }

    loadApplicants(selectedInternshipId);
  }, [applicationViews, loadApplicants, selectedInternshipId]);

  const selectedInternship = internships.find((internship) => internship.id === selectedInternshipId);
  const selectedView = applicationViews[selectedInternshipId] || {
    applications: [],
    isLoading: false,
    query: ""
  };

  return (
    <main className="page">
      <HeroSection
        eyebrow="Company Dashboard"
        title={`Manage internships, ${auth.user?.name}.`}
        description="Publish new roles, update live postings, and review candidate pipelines in one operational workspace."
        highlights={[
          `${internships.length} active internships`,
          `${applicantCount} total applicants`,
          selectedInternship ? `Focused on ${selectedInternship.title}` : "Select an internship"
        ]}
        aside={
          <Card className="hero-card hero-card-compact">
            <p className="panel-kicker">{editingInternshipId ? "Edit internship" : "Post internship"}</p>
            <InternshipComposer
              errors={formErrors}
              isEditing={Boolean(editingInternshipId)}
              isSubmitting={isSubmitting}
              values={formValues}
              onChange={handleFormChange}
              onReset={resetComposer}
              onSubmit={handleCreateOrUpdateInternship}
            />
          </Card>
        }
      />

      {error ? <p className="notice notice-error">{error}</p> : null}

      <section className="dashboard-grid">
        <DashboardPanel
          eyebrow="Portfolio"
          title="Your Internships"
          description="Select a role to inspect the applicant list, review skills, or update the posting."
        >
          <InternshipList
            internships={internships}
            isLoading={isLoading}
            emptyTitle="No internships posted yet"
            emptyMessage="Publish your first internship to start collecting applicants."
            actionLabel={null}
            onAction={null}
            renderDetails={(internship) => (
              <div className="detail-grid">
                <span className="detail-chip">Duration: {internship.duration || "Not provided"}</span>
                <span className="detail-chip">Applicants: {internship.applicantCount ?? 0}</span>
              </div>
            )}
            renderMeta={(internship) => (
              <div className="split-actions">
                <button
                  type="button"
                  className={selectedInternshipId === internship.id ? "button-secondary" : "button-ghost"}
                  onClick={() => {
                    setSelectedInternshipId(internship.id);
                    loadApplicants(internship.id, applicationViews[internship.id]?.query || "");
                  }}
                >
                  Review applicants
                </button>
                <button
                  type="button"
                  className="button-ghost"
                  onClick={() => handleEditInternship(internship)}
                >
                  Edit internship
                </button>
              </div>
            )}
          />
        </DashboardPanel>

        <DashboardPanel
          eyebrow="Applicants"
          title={selectedInternship ? selectedInternship.title : "Application Queue"}
          description={
            selectedInternship
              ? `${selectedInternship.company?.name || "Company"} candidate pipeline`
              : "Choose an internship to review applicants."
          }
          aside={
            selectedInternship ? (
              <label className="search-field">
                <span>Search applicants</span>
                <input
                  type="search"
                  placeholder="Search by name or email"
                  value={selectedView.query}
                  onChange={(event) => {
                    const nextQuery = event.target.value;
                    handleApplicantSearchChange(selectedInternship.id, nextQuery);
                    loadApplicants(selectedInternship.id, nextQuery);
                  }}
                />
              </label>
            ) : null
          }
        >
          {selectedInternship ? (
            <div className="detail-panel">
              <div className="detail-grid">
                <span className="detail-chip">Duration: {selectedInternship.duration || "Not provided"}</span>
                <span className="detail-chip">
                  Skills: {selectedInternship.requiredSkills || "Not provided"}
                </span>
              </div>
              <p className="row-text">{selectedInternship.description || "No description provided."}</p>
            </div>
          ) : null}

          <ApplicationList
            applications={selectedView.applications}
            isLoading={selectedView.isLoading}
            emptyTitle="No applicants yet"
            emptyMessage="Applications will appear here once students start applying."
            variant="company"
            pendingId={isUpdating}
            onApprove={(application) =>
              handleUpdateStatus(selectedInternship.id, application.id, "Approved")
            }
            onReject={(application) =>
              handleUpdateStatus(selectedInternship.id, application.id, "Rejected")
            }
          />
        </DashboardPanel>
      </section>
    </main>
  );
}

export default CompaniesPage;
