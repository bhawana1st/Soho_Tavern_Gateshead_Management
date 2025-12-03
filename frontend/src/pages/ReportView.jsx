// // frontend/src/pages/ReportView.jsx
// import React, { useEffect, useState } from "react";
// import API from "../utils/api";
// import { useSearchParams, Link } from "react-router-dom";

// export default function ReportView() {
//   const [searchParams] = useSearchParams();
//   const date = searchParams.get("date");
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (date) {
//       API.get(`/checklist/${date}`)
//         .then((res) => setReport(res.data))
//         .catch(() => setReport(null))
//         .finally(() => setLoading(false));
//     }
//   }, [date]);

//   if (loading) return <div className="p-10 text-center text-lg">Loading...</div>;
//   if (!report)
//     return (
//       <div className="p-10 text-center">
//         <p>No report found for date: {date}</p>
//         <Link to="/reports" className="btn-outline-glow mt-4 inline-block">
//           Go Back
//         </Link>
//       </div>
//     );

//   return (
//     <div className="pt-20 px-6 bg-cream min-h-screen text-burgundy">
//       <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//         <div className="flex justify-between items-center mb-4 print:hidden">
//           <h1 className="text-2xl font-serif font-semibold">
//             SOHO TAVERN GATESHEAD — DAILY REPORT
//           </h1>
//           <div className="space-x-3">
//             <Link
//               to={`/checklist?date=${report.date}`}
//               className="btn-outline-glow"
//             >
//               Edit Report
//             </Link>
//             <button
//               onClick={() => window.print()}
//               className="btn-glow bg-burgundy text-cream"
//             >
//               Print / Save as PDF
//             </button>
//           </div>
//         </div>

//         <div className="border-t border-b py-4 mb-4">
//           <p>
//             <strong>Date:</strong> {report.date}{" "}
//           </p>
//           <p>
//             <strong>Name:</strong> {report.name}
//           </p>
//         </div>

//         {/* Opening Checks */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">Opening Checks</h2>
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Check</th>
//                 <th className="p-2 w-16">Yes/No</th>
//               </tr>
//             </thead>
//             <tbody>
//               {report.openingChecks.map((c, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-2">{c.label}</td>
//                   <td className="p-2 text-center">{c.yes ? "Yes" : "No"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Fridge Temps */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">Fridge Temperatures</h2>
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2">Time</th>
//                 {Array.from({ length: 8 }).map((_, i) => (
//                   <th key={i} className="p-2">
//                     #{i + 1}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {report.fridgeTemps.map((row, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-2">{row.time}</td>
//                   {row.readings.map((r, j) => (
//                     <td key={j} className="p-2 text-center">
//                       {r}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Delivery */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">Delivery Detail</h2>
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2">Supplier</th>
//                 <th className="p-2">Product</th>
//                 <th className="p-2">Time</th>
//                 <th className="p-2">Surf Temp</th>
//                 <th className="p-2">Rejected</th>
//                 <th className="p-2">Sign</th>
//               </tr>
//             </thead>
//             <tbody>
//               {report.deliveryDetails.map((d, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-2">{d.supplier}</td>
//                   <td className="p-2">{d.product}</td>
//                   <td className="p-2">{d.time}</td>
//                   <td className="p-2">{d.surfTemp}</td>
//                   <td className="p-2">{d.rejectedIfAny}</td>
//                   <td className="p-2">{d.sign}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Cooking */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">Cooking & Chilling Procedure</h2>
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2">Item Cooked</th>
//                 <th className="p-2">End Temp</th>
//                 <th className="p-2">Time</th>
//                 <th className="p-2">Method</th>
//                 <th className="p-2">Duration</th>
//                 <th className="p-2">End Temp</th>
//               </tr>
//             </thead>
//             <tbody>
//               {report.cookingDetails.map((c, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-2">{c.itemCooked}</td>
//                   <td className="p-2">{c.endCookingTemperature}</td>
//                   <td className="p-2">{c.time}</td>
//                   <td className="p-2">{c.chillingMethod}</td>
//                   <td className="p-2">{c.chillingDuration}</td>
//                   <td className="p-2">{c.endTemperature}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* Closing Checks */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">Closing Checks</h2>
//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Check</th>
//                 <th className="p-2 w-16">Yes/No</th>
//               </tr>
//             </thead>
//             <tbody>
//               {report.closingChecks.map((c, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="p-2">{c.label}</td>
//                   <td className="p-2 text-center">{c.yes ? "Yes" : "No"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         <p className="text-right text-sm text-gray-600 italic">
//           Report generated on {new Date(report.updatedAt).toLocaleString()}
//         </p>
//       </div>
//     </div>
//   );
// }



// frontend/src/pages/ReportView.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ReportView() {
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date") || "";
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dateParam) return;
    setLoading(true);
    API.get(`/checklist/${dateParam}`)
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Report not found.");
        navigate("/reports");
      })
      .finally(() => setLoading(false));
  }, [dateParam, navigate]);

  if (!dateParam) return <div className="p-6">No date selected.</div>;
  if (loading) return <div className="p-6">Loading...</div>;
  if (!report) return <div className="p-6">No report for {dateParam}</div>;

  const labelFor = (i) => (i >= 4 && i <= 6 ? `Fridger ${i + 1}` : `Fridge ${i + 1}`);

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-serif">Daily Report — {report.date}</h1>
            <div className="text-sm text-gray-600">Prepared by: {report.name || "—"}</div>
          </div>
          <div className="space-x-2">
            <button onClick={() => window.print()} className="px-3 py-1 border rounded">Print / Save PDF</button>
          </div>
        </div>

        {/* Opening checks + comment */}
        <section className="mb-4">
          <h2 className="font-semibold mb-2">Opening Checks</h2>
          <ul className="list-disc pl-6 mb-2">
            {report.openingChecks?.map((o, i) => (
              <li key={i}>{o.label} — <strong>{o.yes ? "Yes" : o.yes === false ? "No" : "—"}</strong></li>
            ))}
          </ul>
          {report.openingComment && <div className="mb-2"><strong>Opening comment:</strong> {report.openingComment}</div>}
        </section>

        {/* Fridge temps (AM/PM) with comments */}
        <section className="mb-4">
          <h2 className="font-semibold mb-2">Fridge Temperatures</h2>
          <div className="overflow-x-auto mb-2">
            <table className="w-full border">
              <thead><tr className="bg-gray-100"><th className="p-2">Time</th>{[...Array(7)].map((_, i) => <th key={i} className="p-2">{labelFor(i)}</th>)}</tr></thead>
              <tbody>
                {report.fridgeTemps?.map((row, ri) => (
                  <tr key={ri} className="border-b">
                    <td className="p-2">{row.time}</td>
                    {row.readings?.map((val, ci) => <td key={ci} className="p-2">{val || "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><strong>AM comment:</strong><div>{report.fridgeComments?.AM || "—"}</div></div>
            <div><strong>PM comment:</strong><div>{report.fridgeComments?.PM || "—"}</div></div>
          </div>
        </section>

        {/* Cooked dish served temps */}
        <section className="mb-4">
          <h2 className="font-semibold mb-2">Cooked Dish Serving Temperature</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Dish Name</th>
                  <th className="p-2">Lunch</th>
                  <th className="p-2">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {report.servedRows?.length ? report.servedRows.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{r.dish || "—"}</td>
                    <td className="p-2">{r.lunch || "—"}</td>
                    <td className="p-2">{r.dinner || "—"}</td>
                  </tr>
                )) : <tr><td colSpan={3} className="p-2">No entries</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* Wastage / Incident / Closing */}
        <section className="mb-4">
          <h2 className="font-semibold mb-2">Wastage</h2>
          <ul className="list-disc pl-6">
            {report.wastageReport?.length ? report.wastageReport.map((w, i) => <li key={i}>{w.itemName} — {w.quantity} ({w.session || "—"})</li>) : <li>None</li>}
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Incidents</h2>
          <ul className="list-disc pl-6">
            {report.incidentReport?.length ? report.incidentReport.map((it, i) => <li key={i}><strong>{it.nature}</strong> — {it.actionTaken}</li>) : <li>None</li>}
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Closing Checks</h2>
          <ul className="list-disc pl-6 mb-2">
            {report.closingChecks?.map((c, i) => <li key={i}>{c.label} — <strong>{c.yes ? "Yes" : c.yes === false ? "No" : "—"}</strong></li>)}
          </ul>
          {report.closingComment && <div><strong>Closing comment:</strong> {report.closingComment}</div>}
        </section>

        <div className="text-sm text-gray-500 mt-6">Created: {new Date(report.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
