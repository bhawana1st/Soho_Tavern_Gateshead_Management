import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";

export default function Reports() {
  const [checklists, setChecklists] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [checklistDetail, setChecklistDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const printRef = useRef();

  // Fetch all checklists on mount
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

  const exportToPDF = async () => {
    if (!checklistDetail) return;

    setExporting(true);
    try {
      // Use browser's native print functionality instead
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow pop-ups to export PDF");
        return;
      }

      const content = printRef.current;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Checklist - ${checklistDetail.date}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Inter', Arial, sans-serif;
              background: white;
              padding: 20px;
              color: #2e2e2e;
            }
            h1, h2, h3 {
              font-family: 'Playfair Display', Georgia, serif;
              color: #581c24;
              margin-bottom: 12px;
            }
            h1 { font-size: 28px; }
            h2 { font-size: 22px; margin-top: 20px; }
            h3 { font-size: 18px; margin-top: 16px; }
            .header {
              border-bottom: 2px solid #581c24;
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
              background: #fdf6ec;
              border-radius: 6px;
              margin-bottom: 8px;
            }
            .checkbox {
              width: 18px;
              height: 18px;
              border: 2px solid #581c24;
              border-radius: 3px;
              margin-right: 12px;
              flex-shrink: 0;
              display: inline-block;
              vertical-align: middle;
            }
            .checkbox.checked {
              background: #581c24;
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
              background: #fdf6ec;
              padding: 10px;
              text-align: left;
              font-weight: 600;
              border: 1px solid #d4af37;
            }
            td {
              padding: 8px 10px;
              border: 1px solid #e5e5e5;
            }
            tr:nth-child(even) {
              background: #fdfaf6;
            }
            .temp-reading {
              display: inline-block;
              background: white;
              padding: 6px 12px;
              border-radius: 4px;
              margin-right: 8px;
              font-weight: 600;
              border: 1px solid #e5e5e5;
            }
            .wastage-item, .incident-item {
              background: #fdf6ec;
              padding: 12px;
              border-radius: 6px;
              margin-bottom: 12px;
              border-left: 4px solid #581c24;
            }
            .incident-item {
              background: #fff5f5;
              border-left-color: #c53030;
            }
            .label {
              font-weight: 600;
              color: #581c24;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
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
            <h2>Checklist for ${checklistDetail.date}</h2>
            <p style="color: #666; margin-top: 8px;">Submitted by: ${
              checklistDetail.name || "Unknown"
            } | ${new Date(checklistDetail.createdAt).toLocaleString(
        "en-GB"
      )}</p>
          </div>
          
          ${
            checklistDetail.openingChecks?.length > 0
              ? `
            <div class="section">
              <h3>Opening Checks</h3>
              <div class="grid-2">
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
            </div>
          `
              : ""
          }
          
          ${
            checklistDetail.fridgeTemps?.length > 0
              ? `
            <div class="section">
              <h3>Fridge Temperatures</h3>
              ${checklistDetail.fridgeTemps
                .map(
                  (temp) => `
                <div style="margin-bottom: 12px;">
                  <span class="label">${temp.time}:</span>
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
              <h3>Cooking Details</h3>
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
            checklistDetail.wastageReport?.length > 0
              ? `
            <div class="section">
              <h3>Wastage Report</h3>
              ${checklistDetail.wastageReport
                .map(
                  (waste) => `
                <div class="wastage-item">
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
                <div class="incident-item">
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
              <div class="grid-2">
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
            </div>
          `
              : ""
          }
        </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load then trigger print
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

  return (
    <div className="min-h-screen pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-burgundy mb-2">
            Checklist Reports
          </h1>
          <p className="text-gray-600">
            View and review all submitted checklists by date
          </p>
        </div>

        {/* Date Selector & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Date List */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-serif font-semibold text-burgundy mb-4">
                Available Dates
              </h2>

              {loading && !checklistDetail && (
                <p className="text-gray-500">Loading...</p>
              )}

              {error && !checklistDetail && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {checklists.length === 0 && !loading ? (
                  <p className="text-gray-500 text-sm">No checklists found</p>
                ) : (
                  checklists.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleDateSelect(item.date)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedDate === item.date
                          ? "bg-burgundy text-white"
                          : "bg-cream hover:bg-burgundy/10"
                      }`}
                    >
                      <div className="font-medium">
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        By: {item.name || "Unknown"}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Checklist Detail */}
          <div className="lg:col-span-2">
            {!selectedDate ? (
              <div className="card p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">
                  Select a date to view checklist details
                </p>
              </div>
            ) : loading ? (
              <div className="card p-12 text-center">
                <p className="text-gray-500">Loading checklist...</p>
              </div>
            ) : checklistDetail ? (
              <div className="space-y-4">
                {/* Export Button */}
                {/* Export & Delete Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={exportToPDF}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-burgundy text-white px-4 py-2 rounded-lg hover:bg-burgundy/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {exporting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Export to PDF</span>
                      </>
                    )}
                  </button>

                  {/* 🗑️ Delete Button */}
                  {JSON.parse(localStorage.getItem("user")).role ===
                  "viewer" ? (
                    <></>
                  ) : (
                    <button
                      onClick={async () => {
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
                          alert(
                            err.response?.data?.message ||
                              "Failed to delete checklist"
                          );
                        }
                      }}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {/* Printable Content */}
                <div
                  ref={printRef}
                  data-pdf-content
                  className="card p-6 space-y-6 max-h-[700px] overflow-y-auto"
                >
                  {/* Header Info */}
                  <div className="border-b border-burgundy/20 pb-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <h2 className="text-2xl font-serif font-bold text-burgundy">
                      Checklist for {checklistDetail.date}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by: {checklistDetail.name || "Unknown"} |{" "}
                      {new Date(checklistDetail.createdAt).toLocaleString(
                        "en-GB"
                      )}
                    </p>
                  </div>

                  {/* Opening Checks */}
                  {checklistDetail.openingChecks?.length > 0 && (
                    <Section title="Opening Checks">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

                  {/* Fridge Temps */}
                  {checklistDetail.fridgeTemps?.length > 0 && (
                    <Section title="Fridge Temperatures">
                      <div className="space-y-2">
                        {checklistDetail.fridgeTemps.map((temp, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 text-sm bg-cream/50 p-3 rounded-lg"
                          >
                            <span className="font-semibold text-burgundy w-24">
                              {temp.time}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {temp.readings && temp.readings.length > 0 ? (
                                temp.readings.map((reading, j) => (
                                  <span
                                    key={j}
                                    className="bg-white px-3 py-1 rounded-md font-medium shadow-sm"
                                  >
                                    {reading}°C
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 italic">
                                  No readings
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Delivery Details */}
                  {checklistDetail.deliveryDetails?.length > 0 && (
                    <Section title="Delivery Details">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-burgundy/10">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">
                                Supplier
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Product
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Time
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Surface Temp
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Rejected
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {checklistDetail.deliveryDetails.map((del, i) => (
                              <tr
                                key={i}
                                className="border-t border-burgundy/10 hover:bg-cream/30"
                              >
                                <td className="px-3 py-2">
                                  {del.supplier || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {del.product || "-"}
                                </td>
                                <td className="px-3 py-2">{del.time || "-"}</td>
                                <td className="px-3 py-2">
                                  {del.surfTemp || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {del.rejectedIfAny || "-"}
                                </td>
                                <td className="px-3 py-2 font-medium">
                                  {del.sign || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {/* Cooking Details */}
                  {checklistDetail.cookingDetails?.length > 0 && (
                    <Section title="Cooking Details">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-burgundy/10">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold">
                                Item Cooked
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                End Cook Temp
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Time
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Chilling Method
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Duration
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                End Temp
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {checklistDetail.cookingDetails.map((cook, i) => (
                              <tr
                                key={i}
                                className="border-t border-burgundy/10 hover:bg-cream/30"
                              >
                                <td className="px-3 py-2">
                                  {cook.itemCooked || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {cook.endCookingTemperature
                                    ? `${cook.endCookingTemperature}°C`
                                    : "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {cook.time || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {cook.chillingMethod || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {cook.chillingDuration || "-"}
                                </td>
                                <td className="px-3 py-2">
                                  {cook.endTemperature
                                    ? `${cook.endTemperature}°C`
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {/* Wastage Report */}
                  {checklistDetail.wastageReport?.length > 0 && (
                    <Section title="Wastage Report">
                      <div className="space-y-3">
                        {checklistDetail.wastageReport.map((waste, i) => (
                          <div
                            key={i}
                            className="bg-cream/70 p-4 rounded-lg border border-burgundy/10"
                          >
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-semibold text-burgundy">
                                  Item:
                                </span>{" "}
                                {waste.itemName || "-"}
                              </div>
                              <div>
                                <span className="font-semibold text-burgundy">
                                  Session:
                                </span>{" "}
                                {waste.session || "-"}
                              </div>
                              <div>
                                <span className="font-semibold text-burgundy">
                                  Reason:
                                </span>{" "}
                                {waste.reason || "-"}
                              </div>
                              <div>
                                <span className="font-semibold text-burgundy">
                                  Quantity:
                                </span>{" "}
                                {waste.quantity || "-"}
                              </div>
                              <div className="col-span-2">
                                <span className="font-semibold text-burgundy">
                                  Sign:
                                </span>{" "}
                                {waste.sign || "-"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Incident Report */}
                  {checklistDetail.incidentReport?.length > 0 && (
                    <Section title="Incident Report">
                      <div className="space-y-3">
                        {checklistDetail.incidentReport.map((incident, i) => (
                          <div
                            key={i}
                            className="bg-red-50 p-4 rounded-lg border-l-4 border-burgundy"
                          >
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-semibold text-burgundy">
                                  Nature:
                                </span>{" "}
                                <span className="text-gray-800">
                                  {incident.nature || "-"}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-burgundy">
                                  Action Taken:
                                </span>{" "}
                                <span className="text-gray-800">
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
                    <Section title="Closing Checks">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                    !checklistDetail.wastageReport?.length &&
                    !checklistDetail.incidentReport?.length &&
                    !checklistDetail.closingChecks?.length && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No checklist data available for this date</p>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({ title, children }) {
  return (
    <div className="border-t border-burgundy/20 pt-4">
      <h3 className="text-lg font-serif font-semibold text-burgundy mb-3">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

function CheckItem({ label, checked }) {
  return (
    <div className="flex items-center gap-3 bg-cream/50 px-4 py-2 rounded-lg border border-burgundy/5">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          checked ? "bg-burgundy border-burgundy" : "border-gray-300 bg-white"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
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
      <span className="text-sm">{label || "Unnamed check"}</span>
    </div>
  );
}
