// // frontend/src/pages/DailyReportForm.jsx
// import React, { useEffect, useState } from "react";
// import API from "../utils/api";
// import { useSearchParams, useNavigate } from "react-router-dom";

// const DEFAULT_OPENING = [
//   "your fridges and freezers are working properly.",
//   "your combi oven microwave oven is working properly.",
//   "staff are fit for work and wearing clean work clothes.",
//   "food preparation area are clean and disinfected(work surface, equipment, utensils etc)",
//   "all area are free from evidence of pest activity.",
//   "there are plenty of hand washing and cleaning materials(soap, paper towel, sanitiser)",
//   "hot running waters available at all sinks and hand wash basin.",
//   "probe thermometer is working and probe wipes are available.",
//   "allergen information is accurate for all items on sale."
// ];

// const DEFAULT_CLOSING = [
//   "all food is covered labelled and put in fridge or freezers.",
//   "food on its use by date been discarded.",
//   "dirty cleaning equipment's been cleaned or thrown away.",
//   "waste has been removed and new bag put in.",
//   "food preparation area are clean and disinfected(work surface, equipment, utensils)",
//   "all washing up has been finished.",
//   "floors are swept and clean.",
//   "prove it check have been recorded."
// ];

// export default function DailyReportForm() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dateParam = searchParams.get("date") || "";
//   const [date, setDate] = useState(dateParam);
//   const [name, setName] = useState("");
//   const [openingChecks, setOpeningChecks] = useState(
//     DEFAULT_OPENING.map((q) => ({ label: q, yes: null }))
//   );

//   // fridge temps: rows AM/PM and columns 1..8 in paper. We'll create two rows with 8 readings each.
//   const initialFridgeRow = { time: "AM", readings: Array(8).fill("") };
//   const [fridgeTemps, setFridgeTemps] = useState([initialFridgeRow, { ...initialFridgeRow, time: "PM" }]);

//   const [deliveryDetails, setDeliveryDetails] = useState([{ supplier: "", product: "", time: "", surfTemp: "", rejectedIfAny: "", sign: "" }]);

//   const [cookingDetails, setCookingDetails] = useState([
//     { itemCooked: "", endCookingTemperature: "", time: "", chillingMethod: "", chillingDuration: "", endTemperature: "" },
//   ]);

//   const [wastageReport, setWastageReport] = useState([{ itemName: "", session: "", reason: "", quantity: "", sign: "" }]);
//   const [incidentReport, setIncidentReport] = useState([{ nature: "", actionTaken: "" }]);
//   const [closingChecks, setClosingChecks] = useState(DEFAULT_CLOSING.map((q) => ({ label: q, yes: null })));

//   // load if date param present
//   useEffect(() => {
//     if (dateParam) {
//       API.get(`/checklist/${dateParam}`)
//         .then((res) => {
//           const r = res.data;
//           setName(r.name || "");
//           setOpeningChecks(r.openingChecks.length ? r.openingChecks : openingChecks);
//           setFridgeTemps(r.fridgeTemps.length ? r.fridgeTemps : fridgeTemps);
//           setDeliveryDetails(r.deliveryDetails.length ? r.deliveryDetails : deliveryDetails);
//           setCookingDetails(r.cookingDetails.length ? r.cookingDetails : cookingDetails);
//           setWastageReport(r.wastageReport.length ? r.wastageReport : wastageReport);
//           setIncidentReport(r.incidentReport.length ? r.incidentReport : incidentReport);
//           setClosingChecks(r.closingChecks.length ? r.closingChecks : closingChecks);
//         })
//         .catch(() => {
//           // no report found or error - keep defaults
//         });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateParam]);

//   const handleOpenYesNo = (i, val) => {
//     const copy = [...openingChecks];
//     copy[i].yes = val;
//     setOpeningChecks(copy);
//   };

//   const handleCloseYesNo = (i, val) => {
//     const copy = [...closingChecks];
//     copy[i].yes = val;
//     setClosingChecks(copy);
//   };

//   const setFridgeValue = (rowIndex, colIndex, value) => {
//     const copy = fridgeTemps.map((r) => ({ ...r }));
//     copy[rowIndex].readings[colIndex] = value;
//     setFridgeTemps(copy);
//   };

//   const addDeliveryRow = () => setDeliveryDetails([...deliveryDetails, { supplier: "", product: "", time: "", surfTemp: "", rejectedIfAny: "", sign: "" }]);
//   const addCookingRow = () => setCookingDetails([...cookingDetails, { itemCooked: "", endCookingTemperature: "", time: "", chillingMethod: "", chillingDuration: "", endTemperature: "" }]);
//   const addWastageRow = () => setWastageReport([...wastageReport, { itemName: "", session: "", reason: "", quantity: "", sign: "" }]);
//   const addIncidentRow = () => setIncidentReport([...incidentReport, { nature: "", actionTaken: "" }]);

//   const handleSave = async () => {
//     if (!date) return alert("Please enter the date before saving.");
//     // build payload
//     const payload = {
//       name,
//       date,
//       openingChecks,
//       fridgeTemps,
//       deliveryDetails,
//       cookingDetails,
//       wastageReport,
//       incidentReport,
//       closingChecks,
//     };

//     try {
//       await API.post("/checklist", payload);
//       alert("Report saved.");
//       navigate("/reports");
//     } catch (err) {
//       console.error(err);
//       alert("Error saving. Check console.");
//     }
//   };

//   return (
//     <div className="pt-20 p-6 bg-cream min-h-screen text-burgundy">
//       <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-serif">SOHO TAVERN GATESHEAD — DAILY REPORT</h1>
//           <div className="space-x-2">
//             <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="border px-2 py-1 rounded-md" />
//             <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border px-2 py-1 rounded-md" />
//             <button onClick={handleSave} className="btn-glow ml-2">Save / Update</button>
//             <button onClick={() => window.print()} className="btn-outline-glow ml-2">Print / Save as PDF</button>
//           </div>
//         </div>

//         {/* Opening checks */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">OPENING CHECKS</h2>
//           <div className="space-y-2">
//             {openingChecks.map((o, i) => (
//               <div key={i} className="flex justify-between items-center border-b py-2">
//                 <div>{o.label}</div>
//                 <div className="space-x-4">
//                   <label><input type="radio" name={`open-${i}`} checked={o.yes === true} onChange={() => handleOpenYesNo(i, true)} /> Yes</label>
//                   <label><input type="radio" name={`open-${i}`} checked={o.yes === false} onChange={() => handleOpenYesNo(i, false)} /> No</label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Fridge temps */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">FRIDGE TEMPERATURES (AM / PM)</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full border">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-2">Time</th>
//                   {[...Array(8)].map((_, col) => <th key={col} className="p-2">#{col+1}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {fridgeTemps.map((row, ri) => (
//                   <tr key={ri} className="border-b">
//                     <td className="p-2">{row.time}</td>
//                     {row.readings.map((val, ci) => (
//                       <td key={ci} className="p-2">
//                         <input value={val} onChange={(e) => setFridgeValue(ri, ci, e.target.value)} className="w-full border px-2 py-1 rounded" />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Delivery detail */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">DELIVERY DETAIL</h2>
//           <div className="space-y-2">
//             {deliveryDetails.map((d, i) => (
//               <div key={i} className="grid grid-cols-6 gap-2 items-center">
//                 <input placeholder="Supplier" value={d.supplier} onChange={(e) => { const c=[...deliveryDetails]; c[i].supplier=e.target.value; setDeliveryDetails(c);} } className="border px-2 py-1 rounded col-span-2" />
//                 <input placeholder="Product" value={d.product} onChange={(e)=>{const c=[...deliveryDetails]; c[i].product=e.target.value; setDeliveryDetails(c);}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Time" value={d.time} onChange={(e)=>{const c=[...deliveryDetails]; c[i].time=e.target.value; setDeliveryDetails(c);}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Surf Temp" value={d.surfTemp} onChange={(e)=>{const c=[...deliveryDetails]; c[i].surfTemp=e.target.value; setDeliveryDetails(c);}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Sign" value={d.sign} onChange={(e)=>{const c=[...deliveryDetails]; c[i].sign=e.target.value; setDeliveryDetails(c);}} className="border px-2 py-1 rounded" />
//               </div>
//             ))}
//             <div className="mt-2">
//               <button onClick={addDeliveryRow} className="btn-outline-glow">Add Delivery Row</button>
//             </div>
//           </div>
//         </section>

//         {/* Cooking and chilling */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">COOKING AND CHILLING PROCEDURE</h2>
//           <div className="space-y-2">
//             {cookingDetails.map((c, i) => (
//               <div key={i} className="grid grid-cols-6 gap-2 items-center">
//                 <input placeholder="Item Cooked" value={c.itemCooked} onChange={(e)=>{const cp=[...cookingDetails]; cp[i].itemCooked = e.target.value; setCookingDetails(cp)}} className="border px-2 py-1 rounded col-span-2" />
//                 <input placeholder="End Cooking Temp" value={c.endCookingTemperature} onChange={(e)=>{const cp=[...cookingDetails]; cp[i].endCookingTemperature = e.target.value; setCookingDetails(cp)}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Time" value={c.time} onChange={(e)=>{const cp=[...cookingDetails]; cp[i].time = e.target.value; setCookingDetails(cp)}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Chilling Method" value={c.chillingMethod} onChange={(e)=>{const cp=[...cookingDetails]; cp[i].chillingMethod = e.target.value; setCookingDetails(cp)}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Chilling Duration" value={c.chillingDuration} onChange={(e)=>{const cp=[...cookingDetails]; cp[i].chillingDuration = e.target.value; setCookingDetails(cp)}} className="border px-2 py-1 rounded" />
//               </div>
//             ))}
//             <div className="mt-2"><button onClick={addCookingRow} className="btn-outline-glow">Add Cooking Row</button></div>
//           </div>
//         </section>

//         {/* Wastage Report */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">WASTAGE REPORT</h2>
//           <div className="space-y-2">
//             {wastageReport.map((w, i) => (
//               <div key={i} className="grid grid-cols-5 gap-2 items-center">
//                 <input placeholder="Item Name" value={w.itemName} onChange={(e)=>{const c=[...wastageReport]; c[i].itemName=e.target.value; setWastageReport(c)}} className="border px-2 py-1 rounded col-span-2" />
//                 <input placeholder="Session" value={w.session} onChange={(e)=>{const c=[...wastageReport]; c[i].session=e.target.value; setWastageReport(c)}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Quantity" value={w.quantity} onChange={(e)=>{const c=[...wastageReport]; c[i].quantity=e.target.value; setWastageReport(c)}} className="border px-2 py-1 rounded" />
//                 <input placeholder="Sign" value={w.sign} onChange={(e)=>{const c=[...wastageReport]; c[i].sign=e.target.value; setWastageReport(c)}} className="border px-2 py-1 rounded" />
//               </div>
//             ))}
//             <div className="mt-2"><button onClick={addWastageRow} className="btn-outline-glow">Add Wastage Row</button></div>
//           </div>
//         </section>

//         {/* Incident / Maintenance */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">INCIDENT / MAINTENANCE / ANY OTHER REPORT</h2>
//           <div className="space-y-2">
//             {incidentReport.map((it, i) => (
//               <div key={i} className="grid grid-cols-2 gap-2">
//                 <textarea placeholder="Nature of incident" value={it.nature} onChange={(e)=>{const c=[...incidentReport]; c[i].nature=e.target.value; setIncidentReport(c)}} className="border p-2 rounded col-span-1" />
//                 <textarea placeholder="Action taken" value={it.actionTaken} onChange={(e)=>{const c=[...incidentReport]; c[i].actionTaken=e.target.value; setIncidentReport(c)}} className="border p-2 rounded col-span-1" />
//               </div>
//             ))}
//             <div className="mt-2"><button onClick={addIncidentRow} className="btn-outline-glow">Add Incident Row</button></div>
//           </div>
//         </section>

//         {/* Closing checks */}
//         <section className="mb-6">
//           <h2 className="font-semibold mb-2">CLOSING CHECK</h2>
//           <div className="space-y-2">
//             {closingChecks.map((c, i) => (
//               <div key={i} className="flex justify-between items-center border-b py-2">
//                 <div>{c.label}</div>
//                 <div className="space-x-4">
//                   <label><input type="radio" name={`close-${i}`} checked={c.yes === true} onChange={() => handleCloseYesNo(i, true)} /> Yes</label>
//                   <label><input type="radio" name={`close-${i}`} checked={c.yes === false} onChange={() => handleCloseYesNo(i, false)} /> No</label>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }


// frontend/src/pages/DailyReportForm.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";

const DEFAULT_OPENING = [
  "your fridges and freezers are working properly.",
  "your combi oven microwave oven is working properly.",
  "staff are fit for work and wearing clean work clothes.",
  "food preparation area are clean and disinfected(work surface, equipment, utensils etc)",
  "all area are free from evidence of pest activity.",
  "there are plenty of hand washing and cleaning materials(soap, paper towel, sanitiser)",
  "hot running waters available at all sinks and hand wash basin.",
  "probe thermometer is working and probe wipes are available.",
  "allergen information is accurate for all items on sale."
];

const DEFAULT_CLOSING = [
  "all food is covered labelled and put in fridge or freezers.",
  "food on its use by date been discarded.",
  "dirty cleaning equipment's been cleaned or thrown away.",
  "waste has been removed and new bag put in.",
  "food preparation area are clean and disinfected(work surface, equipment, utensils)",
  "all washing up has been finished.",
  "floors are swept and clean.",
  "prove it check have been recorded."
];

export default function DailyReportForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateParam = searchParams.get("date") || "";
  const [date, setDate] = useState(dateParam);
  const [name, setName] = useState("");
  const [openingChecks, setOpeningChecks] = useState(DEFAULT_OPENING.map((q) => ({ label: q, yes: null })));

  const initialFridgeAM = { time: "AM", readings: Array(7).fill("") };
  const initialFridgePM = { time: "PM", readings: Array(7).fill("") };
  const [fridgeTemps, setFridgeTemps] = useState([initialFridgeAM, initialFridgePM]);
  const [fridgeComments, setFridgeComments] = useState({ AM: "", PM: "" });

  const [deliveryDetails, setDeliveryDetails] = useState([{ supplier: "", product: "", time: "", surfTemp: "", rejectedIfAny: "", sign: "" }]);
  const [cookingDetails, setCookingDetails] = useState([{ itemCooked: "", endCookingTemperature: "", time: "", chillingMethod: "", chillingDuration: "", endTemperature: "" }]);
  const [servedRows, setServedRows] = useState([{ dish: "", lunch: "", dinner: "" }, { dish: "", lunch: "", dinner: "" }, { dish: "", lunch: "", dinner: "" }]);
  const [wastageReport, setWastageReport] = useState([{ itemName: "", session: "", reason: "", quantity: "", sign: "" }]);
  const [incidentReport, setIncidentReport] = useState([{ nature: "", actionTaken: "" }]);
  const [closingChecks, setClosingChecks] = useState(DEFAULT_CLOSING.map((q) => ({ label: q, yes: null })));

  const [openingComment, setOpeningComment] = useState("");
  const [closingComment, setClosingComment] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.name) setName(user.name);
  }, []);

  useEffect(() => {
    if (dateParam) {
      API.get(`/checklist/${dateParam}`)
        .then((res) => {
          const r = res.data;
          setName(r.name || "");
          setOpeningChecks(r.openingChecks && r.openingChecks.length ? r.openingChecks : openingChecks);
          setFridgeTemps(r.fridgeTemps && r.fridgeTemps.length ? r.fridgeTemps : [initialFridgeAM, initialFridgePM]);
          setFridgeComments(r.fridgeComments || { AM: "", PM: "" });
          setDeliveryDetails(r.deliveryDetails && r.deliveryDetails.length ? r.deliveryDetails : deliveryDetails);
          setCookingDetails(r.cookingDetails && r.cookingDetails.length ? r.cookingDetails : cookingDetails);
          setServedRows(r.servedRows && r.servedRows.length ? r.servedRows : servedRows);
          setWastageReport(r.wastageReport && r.wastageReport.length ? r.wastageReport : wastageReport);
          setIncidentReport(r.incidentReport && r.incidentReport.length ? r.incidentReport : incidentReport);
          setClosingChecks(r.closingChecks && r.closingChecks.length ? r.closingChecks : closingChecks);
          setOpeningComment(r.openingComment || "");
          setClosingComment(r.closingComment || "");
        })
        .catch(() => {
          // keep defaults
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateParam]);

  const handleOpenYesNo = (i, val) => { const copy = [...openingChecks]; copy[i].yes = val; setOpeningChecks(copy); };
  const handleCloseYesNo = (i, val) => { const copy = [...closingChecks]; copy[i].yes = val; setClosingChecks(copy); };

  const setFridgeValue = (rowIndex, colIndex, value) => {
    const copy = fridgeTemps.map((r) => ({ ...r, readings: [...(r.readings || Array(7).fill(""))] }));
    copy[rowIndex].readings[colIndex] = value;
    setFridgeTemps(copy);
  };

  const setFridgeComment = (time, val) => setFridgeComments(prev => ({ ...prev, [time]: val }));

  const addDeliveryRow = () => setDeliveryDetails([...deliveryDetails, { supplier: "", product: "", time: "", surfTemp: "", rejectedIfAny: "", sign: "" }]);
  const addCookingRow = () => setCookingDetails([...cookingDetails, { itemCooked: "", endCookingTemperature: "", time: "", chillingMethod: "", chillingDuration: "", endTemperature: "" }]);
  const addWastageRow = () => setWastageReport([...wastageReport, { itemName: "", session: "", reason: "", quantity: "", sign: "" }]);
  const addIncidentRow = () => setIncidentReport([...incidentReport, { nature: "", actionTaken: "" }]);

  const addServedRow = () => setServedRows([...servedRows, { dish: "", lunch: "", dinner: "" }]);
  const removeServedRow = (i) => setServedRows(servedRows.filter((_, idx) => idx !== i));
  const updateServedRow = (i, field, v) => { const cp = servedRows.map(row => ({ ...row })); cp[i][field] = v; setServedRows(cp); };

  const handleSave = async () => {
    if (!date) return alert("Please enter the date before saving.");
    const payload = { name, date, openingChecks, fridgeTemps, fridgeComments, deliveryDetails, cookingDetails, servedRows, wastageReport, incidentReport, closingChecks, openingComment, closingComment };
    try { await API.post("/checklist", payload); alert("Report saved."); navigate("/reports"); }
    catch (err) { console.error(err); alert(err.response?.data?.message || "Error saving. Check console."); }
  };

  return (
    <div className="pt-20 p-6 bg-cream min-h-screen text-burgundy">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-serif">SOHO TAVERN GATESHEAD — DAILY REPORT</h1>
          <div className="space-x-2">
            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="border px-2 py-1 rounded-md" />
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border px-2 py-1 rounded-md" />
            <button onClick={handleSave} className="btn-glow ml-2">Save / Update</button>
            <button onClick={() => window.print()} className="btn-outline-glow ml-2">Print / Save as PDF</button>
          </div>
        </div>

        {/* Opening checks */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">OPENING CHECKS</h2>
          <div className="space-y-2">
            {openingChecks.map((o, i) => (
              <div key={i} className="flex justify-between items-center border-b py-2">
                <div>{o.label}</div>
                <div className="space-x-4">
                  <label><input type="radio" name={`open-${i}`} checked={o.yes === true} onChange={() => handleOpenYesNo(i, true)} /> Yes</label>
                  <label><input type="radio" name={`open-${i}`} checked={o.yes === false} onChange={() => handleOpenYesNo(i, false)} /> No</label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <label className="block text-sm font-semibold mb-1">Comment for Opening Checks</label>
            <textarea value={openingComment} onChange={(e) => setOpeningComment(e.target.value)} className="w-full border px-2 py-1 rounded" rows="2" />
          </div>
        </section>

        {/* Fridge temps */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">FRIDGE TEMPERATURES (AM / PM)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100"><th className="p-2">Time</th>{[...Array(7)].map((_, col) => <th key={col} className="p-2">{col+1}</th>)}</tr>
              </thead>
              <tbody>
                {fridgeTemps.map((row, ri) => (
                  <tr key={ri} className="border-b">
                    <td className="p-2">{row.time}</td>
                    {row.readings.map((val, ci) => (
                      <td key={ci} className="p-2"><input value={val} onChange={(e) => setFridgeValue(ri, ci, e.target.value)} className="w-full border px-2 py-1 rounded" placeholder={ci>=4 && ci<=6 ? `Fridger ${ci+1}` : `Fridge ${ci+1}`} /></td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b"><td className="p-2">SIGN AM</td>{Array.from({ length: 7 }).map((_, i) => <td key={i} className="p-2"></td>)}</tr>
                <tr className="border-b"><td className="p-2">SIGN PM</td>{Array.from({ length: 7 }).map((_, i) => <td key={i} className="p-2"></td>)}</tr>
              </tbody>
            </table>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="block text-sm font-semibold mb-1">AM Reading Comment</label><textarea value={fridgeComments.AM} onChange={(e) => setFridgeComment("AM", e.target.value)} className="w-full border px-2 py-1 rounded" rows={2} /></div>
              <div><label className="block text-sm font-semibold mb-1">PM Reading Comment</label><textarea value={fridgeComments.PM} onChange={(e) => setFridgeComment("PM", e.target.value)} className="w-full border px-2 py-1 rounded" rows={2} /></div>
            </div>
          </div>
        </section>

        {/* Delivery / Cooking / Cooked / Wastage / Incident / Closing same as earlier (omitted for brevity in this snippet) */}
        {/* Cooked Dish Serving Temperature */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">COOKED DISH SERVING TEMPERATURE</h2>
          <div className="mb-2 text-sm text-gray-600">Columns are fixed: Lunch and Dinner. You can add/delete dish rows below.</div>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100"><th className="p-2">Dish Name</th><th className="p-2">Lunch</th><th className="p-2">Dinner</th><th className="p-2">Actions</th></tr>
              </thead>
              <tbody>
                {servedRows.map((r, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2"><input className="w-full border px-2 py-1 rounded" value={r.dish} onChange={(e)=>updateServedRow(i, "dish", e.target.value)} /></td>
                    <td className="p-2"><input className="w-full border px-2 py-1 rounded" placeholder="+65 or -2" value={r.lunch} onChange={(e)=>updateServedRow(i, "lunch", e.target.value)} /></td>
                    <td className="p-2"><input className="w-full border px-2 py-1 rounded" placeholder="+70" value={r.dinner} onChange={(e)=>updateServedRow(i, "dinner", e.target.value)} /></td>
                    <td className="p-2"><button onClick={()=>removeServedRow(i)} className="text-red-600">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2"><button onClick={addServedRow} className="btn-outline-glow">Add Dish Row</button></div>
          </div>
        </section>

        {/* Closing checks */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">CLOSING CHECK</h2>
          <div className="space-y-2">{closingChecks.map((c, i) => (<div key={i} className="flex justify-between items-center border-b py-2"><div>{c.label}</div><div className="space-x-4"><label><input type="radio" name={`close-${i}`} checked={c.yes === true} onChange={() => handleCloseYesNo(i, true)} /> Yes</label><label><input type="radio" name={`close-${i}`} checked={c.yes === false} onChange={() => handleCloseYesNo(i, false)} /> No</label></div></div>))}</div>
          <div className="mt-3"><label className="block text-sm font-semibold mb-1">Comment for Closing Checks</label><textarea value={closingComment} onChange={(e) => setClosingComment(e.target.value)} className="w-full border px-2 py-1 rounded" rows="2" /></div>
        </section>
      </div>
    </div>
  );
}
