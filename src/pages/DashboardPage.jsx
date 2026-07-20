import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import ApplicationList from "../components/ui/ApplicationList";
import Dashboard from "../components/ui/Dashboard";
import DashboardPanel from "../components/ui/DashboardPanel";
import InternshipList from "../components/ui/InternshipList";
import { getStoredAuth } from "../lib/authStorage";
import { adminService, dashboardService } from "../services";

function asCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.round(count) : 0;
}

function countApplicationsByStatus(applicationList = []) {
  return applicationList.reduce(
    (summary, application) => {
      const status = `${application.status || ""}`.toLowerCase();

      if (status === "approved" || status === "accepted") {
        summary.acceptedApplications += 1;
      } else if (status === "rejected") {
        summary.rejectedApplications += 1;
      } else if (status === "applied" || status === "pending") {
        summary.pendingApplications += 1;
      }

      return summary;
    },
    {
      acceptedApplications: 0,
      rejectedApplications: 0,
      pendingApplications: 0
    }
  );
}

async function loadReportLogo() {
  const logoPaths = ["/logo.png", "/logo.jpg", "/logo.jpeg"];

  for (const logoPath of logoPaths) {
    try {
      const response = await fetch(logoPath);
      const contentType = response.headers.get("content-type") || "";

      if (!response.ok || !contentType.startsWith("image/")) {
        continue;
      }

      const blob = await response.blob();

      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ dataUrl: reader.result, type: contentType });
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      continue;
    }
  }

  return null;
}

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setError("");

      try {
        const [statsData, internshipData, applicationData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getInternships(),
          dashboardService.getApplications()
        ]);

        if (!isMounted) {
          return;
        }

        setStats(statsData);
        setInternships(internshipData.internships || []);
        setApplications(applicationData.applications || []);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load dashboard data.");
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
  }, []);

  const handleGenerateReport = async () => {
    let adminDashboard = null;
    let reportApplications = applications;
    const storedAuth = getStoredAuth();
    const canUseAdminStats = storedAuth.user?.role === "admin";

    if (canUseAdminStats) {
      try {
        adminDashboard = await adminService.getDashboard();
      } catch {
        adminDashboard = null;
      }

      try {
        const applicationData = await adminService.getApplications();
        reportApplications = applicationData.applications || [];
      } catch {
        reportApplications = applications;
      }
    }

    const adminStats = adminDashboard?.stats || {};
    const applicationStatusCounts = countApplicationsByStatus(reportApplications);
    const reportStats = [
      ["Total Students", asCount(adminStats.totalStudents)],
      ["Total Companies", asCount(adminStats.totalCompanies ?? stats?.companies)],
      ["Total Internships", asCount(adminStats.totalInternships ?? internships.length ?? stats?.activeInternships)],
      ["Total Applications", asCount(adminStats.totalApplications ?? reportApplications.length)],
      ["Accepted Applications", applicationStatusCounts.acceptedApplications],
      ["Rejected Applications", applicationStatusCounts.rejectedApplications],
      ["Pending Applications", applicationStatusCounts.pendingApplications]
    ];

    const generatedAt = new Date();
    const document = new jsPDF();
    const pageWidth = document.internal.pageSize.getWidth();
    const pageHeight = document.internal.pageSize.getHeight();
    const marginX = 20;
    const logo = await loadReportLogo();
    let headerY = 18;

    document.setDrawColor(28, 62, 92);
    document.setLineWidth(0.8);
    document.line(marginX, 8, pageWidth - marginX, 8);

    if (logo?.dataUrl) {
      document.addImage(logo.dataUrl, logo.type.includes("png") ? "PNG" : "JPEG", pageWidth / 2 - 15, headerY, 30, 18);
      headerY += 26;
    }

    document.setFont("helvetica", "bold");
    document.setTextColor(28, 62, 92);
    document.setFontSize(20);
    document.text("Interns.Net", pageWidth / 2, headerY, { align: "center" });

    document.setFontSize(13);
    document.text("Internship Management System", pageWidth / 2, headerY + 9, { align: "center" });

    document.setFont("helvetica", "bold");
    document.setFontSize(11);
    document.setTextColor(80, 80, 80);
    document.text("System Summary Report", pageWidth / 2, headerY + 18, { align: "center" });

    document.setDrawColor(210, 218, 226);
    document.setLineWidth(0.3);
    document.line(marginX, headerY + 27, pageWidth - marginX, headerY + 27);

    autoTable(document, {
      startY: headerY + 40,
      head: [["Metric", "Count"]],
      body: reportStats.map(([label, value]) => [label, asCount(value)]),
      margin: { left: marginX, right: marginX },
      tableWidth: pageWidth - marginX * 2,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
        lineColor: [205, 213, 223],
        lineWidth: 0.2,
        textColor: [45, 55, 72]
      },
      headStyles: {
        fillColor: [28, 62, 92],
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { halign: "right" }
      },
      pageBreak: "avoid"
    });

    document.setDrawColor(210, 218, 226);
    document.line(marginX, pageHeight - 28, pageWidth - marginX, pageHeight - 28);

    document.setFont("helvetica", "normal");
    document.setFontSize(9);
    document.setTextColor(110, 110, 110);
    document.text(`Generated Date & Time: ${generatedAt.toLocaleString()}`, marginX, pageHeight - 18);
    document.text("Generated by Interns.Net System", pageWidth - marginX, pageHeight - 18, { align: "right" });
    document.save("interns-net-system-summary-report.pdf");
  };

  return (
    <main className="page">
      {error ? <p className="notice notice-error">{error}</p> : null}
      {isLoading ? <section className="panel"><p>Loading platform metrics...</p></section> : null}
      {!isLoading && !error ? (
        <>
          <div className="panel-head">
            <div />
            <button type="button" className="button-secondary" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
          <Dashboard stats={stats} />
          <section className="dashboard-grid">
            <DashboardPanel
              eyebrow="Live internships"
              title="Internships"
              description="Current internship listings published across the platform."
            >
              <InternshipList
                internships={internships}
                isLoading={false}
                emptyTitle="No internships available"
                emptyMessage="Internship postings will appear here when organizations publish new roles."
              />
            </DashboardPanel>

           
          </section>
        </>
      ) : null}
    </main>
  );
}

export default DashboardPage;
