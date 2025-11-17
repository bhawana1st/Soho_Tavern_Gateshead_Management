import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Download,
  Trash2,
  Search,
  Calendar,
  User,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import API from "../utils/api";

// Reusable Components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-rose-100 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-rose-100 text-rose-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

const Section = ({ title, children, icon: Icon }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-rose-900/20">
      {Icon && <Icon className="h-5 w-5 text-rose-900" />}
      <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
    </div>
    {children}
  </div>
);

const CheckItem = ({ label, checked }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-rose-50/50 transition group">
    <div
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${
        checked
          ? "bg-rose-900 border-rose-900 shadow-sm"
          : "border-gray-300 bg-white group-hover:border-rose-300"
      }`}
    >
      {checked && (
        <svg
          className="w-3.5 h-3.5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </div>
    <span className="text-sm text-gray-700 leading-relaxed">
      {label || "Unnamed check"}
    </span>
  </div>
);

const DataTable = ({ headers, data, renderRow }) => (
  <div className="overflow-x-auto -mx-4 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <table className="min-w-full divide-y divide-rose-200">
        <thead className="bg-linear-to-r from-rose-50 to-amber-50">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-rose-100">
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-rose-50/30 transition">
              {renderRow(item, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="bg-linear-to-br from-rose-50 to-amber-50 p-4 rounded-lg border border-rose-200">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-rose-800 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default function Reports() {
  const [checklists, setChecklists] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [checklistDetail, setChecklistDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef();

  useEffect(() => {
    fetchAllChecklists();
  }, []);

  const fetchAllChecklists = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/checklist");
      setChecklists(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch checklists");
    } finally {
      setLoading(false);
    }
  };

  const fetchChecklistByDate = async (date) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/checklist/${date}`);
      setChecklistDetail(data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "No checklist found for this date"
      );
      setChecklistDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    fetchChecklistByDate(date);
  };

  const handleDelete = async () => {
    if (!checklistDetail?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this checklist?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/checklist/${checklistDetail._id}`);
      alert("Checklist deleted successfully!");
      setChecklists((prev) =>
        prev.filter((c) => c._id !== checklistDetail._id)
      );
      setChecklistDetail(null);
      setSelectedDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete checklist");
    }
  };

  const exportToPDF = async () => {
    if (!checklistDetail) return;

    setExporting(true);
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow pop-ups to export PDF");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Checklist - ${checklistDetail.date}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', Arial, sans-serif;
              background: white;
              padding: 20px;
              color: #2e2e2e;
            }
            h1, h2, h3 {
              font-family: 'Playfair Display', Georgia, serif;
              color: #881337;
              margin-bottom: 12px;
            }
            h1 { font-size: 28px; }
            h2 { font-size: 22px; margin-top: 20px; }
            h3 { font-size: 18px; margin-top: 16px; }
            .header {
              border-bottom: 3px solid #881337;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .section {
              margin-bottom: 24px;
              page-break-inside: avoid;
            }
            .check-item {
              display: flex;
              align-items: center;
              padding: 8px 12px;
              background: #fef2f2;
              border-radius: 6px;
              margin-bottom: 8px;
            }
            .checkbox {
              width: 18px;
              height: 18px;
              border: 2px solid #881337;
              border-radius: 3px;
              margin-right: 12px;
              flex-shrink: 0;
              display: inline-block;
              vertical-align: middle;
            }
            .checkbox.checked {
              background: #881337;
              position: relative;
            }
            .checkbox.checked::after {
              content: '✓';
              color: white;
              position: absolute;
              top: -2px;
              left: 2px;
              font-size: 14px;
              font-weight: bold;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              font-size: 13px;
            }
            th {
              background: linear-gradient(to right, #fef2f2, #fffbeb);
              padding: 10px;
              text-align: left;
              font-weight: 600;
              border: 1px solid #fecaca;
              color: #881337;
            }
            td {
              padding: 8px 10px;
              border: 1px solid #fecaca;
            }
            tr:nth-child(even) {
              background: #fef2f2;
            }
            .temp-reading {
              display: inline-block;
              background: white;
              padding: 6px 12px;
              border-radius: 6px;
              margin-right: 8px;
              font-weight: 600;
              border: 2px solid #fecaca;
            }
            .info-card {
              background: linear-gradient(135deg, #fef2f2, #fffbeb);
              padding: 12px;
              border-radius: 8px;
              margin-bottom: 12px;
              border-left: 4px solid #881337;
            }
            .label {
              font-weight: 600;
              color: #881337;
            }
            @media print {
              body { padding: 0; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Soho Tavern — Gateshead</h1>
            <h2>Daily Checklist Report</h2>
            <p style="color: #666; margin-top: 8px;">
              Date: ${checklistDetail.date} | 
              Submitted by: ${checklistDetail.name || "Unknown"} | 
              ${new Date(checklistDetail.createdAt).toLocaleString("en-GB")}
            </p>
          </div>
          
          ${
            checklistDetail.openingChecks?.length > 0
              ? `
            <div class="section">
              <h3>Opening Checks</h3>
              ${checklistDetail.openingChecks
                .map(
                  (check) => `
                <div class="check-item">
                  <span class="checkbox ${check.yes ? "checked" : ""}"></span>
                  <span>${check.label || "Unnamed check"}</span>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.fridgeTemps?.length > 0
              ? `
            <div class="section">
              <h3>Fridge Temperature Monitoring</h3>
              ${checklistDetail.fridgeTemps
                .map(
                  (temp) => `
                <div class="info-card">
                  <span class="label">${temp.time} Reading:</span>
                  ${
                    temp.readings
                      ?.map((r) => `<span class="temp-reading">${r}°C</span>`)
                      .join("") || "<em>No readings</em>"
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.deliveryDetails?.length > 0
              ? `
            <div class="section">
              <h3>Delivery Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Product</th>
                    <th>Time</th>
                    <th>Surface Temp</th>
                    <th>Rejected</th>
                    <th>Sign</th>
                  </tr>
                </thead>
                <tbody>
                  ${checklistDetail.deliveryDetails
                    .map(
                      (del) => `
                    <tr>
                      <td>${del.supplier || "-"}</td>
                      <td>${del.product || "-"}</td>
                      <td>${del.time || "-"}</td>
                      <td>${del.surfTemp || "-"}</td>
                      <td>${del.rejectedIfAny || "-"}</td>
                      <td>${del.sign || "-"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.cookingDetails?.length > 0
              ? `
            <div class="section">
              <h3>Cooking & Chilling Records</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item Cooked</th>
                    <th>End Cook Temp</th>
                    <th>Time</th>
                    <th>Chilling Method</th>
                    <th>Duration</th>
                    <th>End Temp</th>
                  </tr>
                </thead>
                <tbody>
                  ${checklistDetail.cookingDetails
                    .map(
                      (cook) => `
                    <tr>
                      <td>${cook.itemCooked || "-"}</td>
                      <td>${
                        cook.endCookingTemperature
                          ? cook.endCookingTemperature + "°C"
                          : "-"
                      }</td>
                      <td>${cook.time || "-"}</td>
                      <td>${cook.chillingMethod || "-"}</td>
                      <td>${cook.chillingDuration || "-"}</td>
                      <td>${
                        cook.endTemperature ? cook.endTemperature + "°C" : "-"
                      }</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.dishwasherChecks?.length > 0
              ? `
            <div class="section">
              <h3>Dishwasher Checks</h3>
              ${checklistDetail.dishwasherChecks
                .map(
                  (check) => `
                <div class="info-card">
                  <div style="margin-bottom: 8px;">
                    <span class="label" style="font-size: 16px;">${
                      check.period
                    } Check</span>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 13px;">
                    <div><span class="label">Time:</span> ${
                      check.time || "-"
                    }</div>
                    <div><span class="label">Temperature:</span> ${
                      check.temp ? check.temp + "°C" : "-"
                    }</div>
                    <div><span class="label">Initials:</span> ${
                      check.initial || "-"
                    }</div>
                    <div><span class="label">Cleansing OK:</span> ${
                      check.cleansingOk || "-"
                    }</div>
                    <div><span class="label">Chemical Sufficient:</span> ${
                      check.chemicalSufficient || "-"
                    }</div>
                    <div><span class="label">Closing Check:</span> ${
                      check.closingCheck || "-"
                    }</div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.wastageReport?.length > 0
              ? `
            <div class="section">
              <h3>Wastage Report</h3>
              ${checklistDetail.wastageReport
                .map(
                  (waste) => `
                <div class="info-card">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                    <div><span class="label">Item:</span> ${
                      waste.itemName || "-"
                    }</div>
                    <div><span class="label">Session:</span> ${
                      waste.session || "-"
                    }</div>
                    <div><span class="label">Reason:</span> ${
                      waste.reason || "-"
                    }</div>
                    <div><span class="label">Quantity:</span> ${
                      waste.quantity || "-"
                    }</div>
                    <div style="grid-column: 1 / -1;"><span class="label">Sign:</span> ${
                      waste.sign || "-"
                    }</div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.incidentReport?.length > 0
              ? `
            <div class="section">
              <h3>Incident Report</h3>
              ${checklistDetail.incidentReport
                .map(
                  (incident) => `
                <div class="info-card" style="border-left-color: #dc2626;">
                  <div style="margin-bottom: 8px; font-size: 13px;">
                    <span class="label">Nature:</span> ${incident.nature || "-"}
                  </div>
                  <div style="font-size: 13px;">
                    <span class="label">Action Taken:</span> ${
                      incident.actionTaken || "-"
                    }
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.closingChecks?.length > 0
              ? `
            <div class="section">
              <h3>Closing Checks</h3>
              ${checklistDetail.closingChecks
                .map(
                  (check) => `
                <div class="check-item">
                  <span class="checkbox ${check.yes ? "checked" : ""}"></span>
                  <span>${check.label || "Unnamed check"}</span>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        setExporting(false);
      }, 500);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF. Please try again.");
      setExporting(false);
    }
  };

  const filteredChecklists = checklists.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date?.includes(searchTerm)
  );

  const userRole = JSON.parse(
    localStorage.getItem("user") || '{"role":"viewer"}'
  ).role;

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-amber-50 to-orange-50 pt-24 sm:pt-28 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-linear-to-br from-rose-900 to-rose-700 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-900">
                Checklist Reports
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                View and review all submitted checklists
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar - Date List */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Card className="p-4 sm:p-6 sticky top-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-rose-900 mb-3">
                  Available Dates
                </h2>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {loading && !checklistDetail && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-900"></div>
                </div>
              )}

              {error && !checklistDetail && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {filteredChecklists.length === 0 && !loading ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No checklists found</p>
                  </div>
                ) : (
                  filteredChecklists.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleDateSelect(item.date)}
                      className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all transform hover:scale-[1.02] ${
                        selectedDate === item.date
                          ? "bg-linear-to-r from-rose-900 to-rose-700 text-white shadow-lg"
                          : "bg-white hover:bg-rose-50 border border-rose-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar
                              className={`h-4 w-4 shrink-0 ${
                                selectedDate === item.date
                                  ? "text-white"
                                  : "text-rose-600"
                              }`}
                            />
                            <span className="font-semibold text-sm truncate">
                              {new Date(item.date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User
                              className={`h-3 w-3 shrink-0 ${
                                selectedDate === item.date
                                  ? "text-white/80"
                                  : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-xs truncate ${
                                selectedDate === item.date
                                  ? "text-white/90"
                                  : "text-gray-600"
                              }`}
                            >
                              {item.name || "Unknown"}
                            </span>
                          </div>
                        </div>
                        {selectedDate === item.date && (
                          <ChevronRight className="h-5 w-5 text-white shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Main Content - Checklist Detail */}
          <div className="lg:col-span-8 xl:col-span-9">
            {!selectedDate ? (
              <Card className="p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-linear-to-br from-rose-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-rose-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Checklist Selected
                  </h3>
                  <p className="text-gray-600">
                    Select a date from the sidebar to view checklist details
                  </p>
                </div>
              </Card>
            ) : loading ? (
              <Card className="p-8 sm:p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900"></div>
                  <p className="text-gray-600">Loading checklist...</p>
                </div>
              </Card>
            ) : checklistDetail ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Action Buttons */}
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-rose-900">
                        {new Date(checklistDetail.date).toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{checklistDetail.name || "Unknown"}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(checklistDetail.createdAt).toLocaleString(
                              "en-GB"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={exportToPDF}
                        disabled={exporting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-linear-to-r from-rose-900 to-rose-700 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {exporting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            <span className="text-sm font-medium">
                              Exporting...
                            </span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Export PDF
                            </span>
                          </>
                        )}
                      </button>

                      {userRole !== "viewer" && (
                        <button
                          onClick={handleDelete}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Checklist Content */}
                <Card className="p-4 sm:p-6">
                  <div
                    ref={printRef}
                    className="space-y-6 max-h-[800px] overflow-y-auto pr-2"
                  >
                    {/* Opening Checks */}
                    {checklistDetail.openingChecks?.length > 0 && (
                      <Section title="Opening Checks" icon={FileText}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {checklistDetail.openingChecks.map((check, i) => (
                            <CheckItem
                              key={i}
                              label={check.label}
                              checked={check.yes}
                            />
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Fridge Temperatures */}
                    {checklistDetail.fridgeTemps?.length > 0 && (
                      <Section
                        title="Fridge Temperature Monitoring"
                        icon={FileText}
                      >
                        <div className="space-y-3">
                          {checklistDetail.fridgeTemps.map((temp, i) => (
                            <div
                              key={i}
                              className="bg-linear-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-rose-200"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <Badge variant="default">
                                  {temp.time} Reading
                                </Badge>
                                <div className="flex flex-wrap gap-2">
                                  {temp.readings && temp.readings.length > 0 ? (
                                    temp.readings.map((reading, j) => (
                                      <span
                                        key={j}
                                        className="bg-white px-3 py-1.5 rounded-lg font-semibold text-sm border-2 border-rose-200 shadow-sm"
                                      >
                                        Fridge {j + 1}: {reading}°C
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-gray-400 italic text-sm">
                                      No readings available
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Delivery Details */}
                    {checklistDetail.deliveryDetails?.length > 0 && (
                      <Section title="Delivery Details" icon={FileText}>
                        <DataTable
                          headers={[
                            "Supplier",
                            "Product",
                            "Time",
                            "Surface Temp",
                            "Rejected",
                            "Sign",
                          ]}
                          data={checklistDetail.deliveryDetails}
                          renderRow={(del, i) => (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {del.supplier || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {del.product || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {del.time || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {del.surfTemp || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {del.rejectedIfAny || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {del.sign || "-"}
                              </td>
                            </>
                          )}
                        />
                      </Section>
                    )}

                    {/* Cooking Details */}
                    {checklistDetail.cookingDetails?.length > 0 && (
                      <Section
                        title="Cooking & Chilling Records"
                        icon={FileText}
                      >
                        <DataTable
                          headers={[
                            "Item Cooked",
                            "End Cook Temp",
                            "Time",
                            "Chilling Method",
                            "Duration",
                            "End Temp",
                          ]}
                          data={checklistDetail.cookingDetails}
                          renderRow={(cook, i) => (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {cook.itemCooked || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {cook.endCookingTemperature
                                  ? `${cook.endCookingTemperature}°C`
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {cook.time || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {cook.chillingMethod || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {cook.chillingDuration || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {cook.endTemperature
                                  ? `${cook.endTemperature}°C`
                                  : "-"}
                              </td>
                            </>
                          )}
                        />
                      </Section>
                    )}

                    {/* Dishwasher Checks */}
                    {checklistDetail.dishwasherChecks?.length > 0 && (
                      <Section title="Dishwasher Checks" icon={FileText}>
                        <div className="space-y-4">
                          {checklistDetail.dishwasherChecks.map((check, i) => (
                            <div
                              key={i}
                              className="bg-linear-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-rose-200"
                            >
                              <div className="mb-3">
                                <Badge variant="default">
                                  {check.period} Check
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <InfoCard
                                  label="Time"
                                  value={check.time || "-"}
                                  icon={Clock}
                                />
                                <InfoCard
                                  label="Temperature"
                                  value={check.temp ? `${check.temp}°C` : "-"}
                                  icon={FileText}
                                />
                                <InfoCard
                                  label="Initials"
                                  value={check.initial || "-"}
                                  icon={User}
                                />
                                <InfoCard
                                  label="Cleansing OK"
                                  value={check.cleansingOk || "-"}
                                  icon={FileText}
                                />
                                <InfoCard
                                  label="Chemical Sufficient"
                                  value={check.chemicalSufficient || "-"}
                                  icon={FileText}
                                />
                                <InfoCard
                                  label="Closing Check"
                                  value={check.closingCheck || "-"}
                                  icon={FileText}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Wastage Report */}
                    {checklistDetail.wastageReport?.length > 0 && (
                      <Section title="Wastage Report" icon={FileText}>
                        <div className="space-y-3">
                          {checklistDetail.wastageReport.map((waste, i) => (
                            <div
                              key={i}
                              className="bg-linear-to-r from-rose-50 to-amber-50 p-4 rounded-lg border border-rose-200"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="text-sm">
                                  <span className="font-semibold text-rose-900">
                                    Item:
                                  </span>
                                  <span className="ml-2 text-gray-700">
                                    {waste.itemName || "-"}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-semibold text-rose-900">
                                    Session:
                                  </span>
                                  <span className="ml-2 text-gray-700">
                                    {waste.session || "-"}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-semibold text-rose-900">
                                    Reason:
                                  </span>
                                  <span className="ml-2 text-gray-700">
                                    {waste.reason || "-"}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-semibold text-rose-900">
                                    Quantity:
                                  </span>
                                  <span className="ml-2 text-gray-700">
                                    {waste.quantity || "-"}
                                  </span>
                                </div>
                                <div className="text-sm sm:col-span-2">
                                  <span className="font-semibold text-rose-900">
                                    Signature:
                                  </span>
                                  <span className="ml-2 text-gray-700">
                                    {waste.sign || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Incident Report */}
                    {checklistDetail.incidentReport?.length > 0 && (
                      <Section title="Incident Report" icon={AlertCircle}>
                        <div className="space-y-3">
                          {checklistDetail.incidentReport.map((incident, i) => (
                            <div
                              key={i}
                              className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600"
                            >
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-semibold text-red-900">
                                    Nature:
                                  </span>
                                  <span className="ml-2 text-gray-800">
                                    {incident.nature || "-"}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="font-semibold text-red-900">
                                    Action Taken:
                                  </span>
                                  <span className="ml-2 text-gray-800">
                                    {incident.actionTaken || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Closing Checks */}
                    {checklistDetail.closingChecks?.length > 0 && (
                      <Section title="Closing Checks" icon={FileText}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {checklistDetail.closingChecks.map((check, i) => (
                            <CheckItem
                              key={i}
                              label={check.label}
                              checked={check.yes}
                            />
                          ))}
                        </div>
                      </Section>
                    )}

                    {/* Empty State */}
                    {!checklistDetail.openingChecks?.length &&
                      !checklistDetail.fridgeTemps?.length &&
                      !checklistDetail.deliveryDetails?.length &&
                      !checklistDetail.cookingDetails?.length &&
                      !checklistDetail.dishwasherChecks?.length &&
                      !checklistDetail.wastageReport?.length &&
                      !checklistDetail.incidentReport?.length &&
                      !checklistDetail.closingChecks?.length && (
                        <div className="text-center py-12">
                          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            No checklist data available for this date
                          </p>
                        </div>
                      )}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-8 sm:p-12 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
