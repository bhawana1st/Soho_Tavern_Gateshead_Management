// frontend/src/pages/Checklist.jsx
import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Calendar } from "lucide-react";
import API from "../utils/api";

// Reusable Card Component
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg ${className}`}
  >
    {children}
  </div>
);

// Small components
const SectionHeader = ({ title, onAdd, addButtonText }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
    <h2 className="text-xl sm:text-2xl font-serif text-rose-900">{title}</h2>
    {onAdd && (
      <button
        onClick={onAdd}
        className="w-full sm:w-auto bg-rose-900 text-amber-50 px-4 py-2 rounded-lg hover:bg-rose-800 transition flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>{addButtonText}</span>
      </button>
    )}
  </div>
);

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm sm:text-base"
      {...props}
    />
  </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition">
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 text-rose-900 border-gray-300 rounded focus:ring-rose-900 mt-0.5 shrink-0"
    />
    <span className="text-sm sm:text-base text-gray-700 group-hover:text-rose-900 transition">
      {label}
    </span>
  </label>
);

// Temperature Input allowing +/-
const SignedTempInput = ({
  value,
  onChange,
  label,
  placeholder = "e.g. +3.5",
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm sm:text-base"
        placeholder={placeholder}
      />
      <span className="absolute right-3 top-2.5 text-gray-500 text-sm">°C</span>
    </div>
  </div>
);

const DeleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition shrink-0"
    aria-label="Delete"
  >
    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
  </button>
);

// Sections
const ChecklistSection = ({ title, checks, onUpdate }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
    <h2 className="text-xl sm:text-2xl font-serif text-rose-900 mb-4">
      {title}
    </h2>
    <div className="space-y-2">
      {checks.map((check, index) => (
        <CheckboxItem
          key={index}
          label={check.label}
          checked={check.yes}
          onChange={(value) => onUpdate(index, value)}
        />
      ))}
    </div>
  </Card>
);

const FridgeTempSection = ({ temps, onUpdate, comments, onCommentChange }) => {
  const labelFor = (i) =>
    i >= 4 && i <= 6 ? `Fridge ${i + 1}` : `Fridge ${i + 1}`;

  return (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-serif text-rose-900 mb-4">
        Fridge Temperature Monitoring
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-4">
        Record temperatures for all fridges twice daily.
      </p>

      <div className="space-y-4 sm:space-y-6">
        {temps.map((temp, timeIndex) => (
          <div
            key={timeIndex}
            className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50/60"
          >
            <div className="mb-4">
              <span className="inline-block text-sm sm:text-base font-semibold text-rose-900 bg-amber-50 px-3 py-1 rounded-lg">
                {temp.time} Reading
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {temp.readings.map((reading, readingIndex) => (
                <SignedTempInput
                  key={readingIndex}
                  label={labelFor(readingIndex)}
                  value={reading}
                  onChange={(val) => onUpdate(timeIndex, readingIndex, val)}
                />
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Comment for {temp.time} Reading
              </label>
              <textarea
                value={comments[temp.time] || ""}
                onChange={(e) => onCommentChange(temp.time, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 text-sm"
                placeholder={`Add comment for ${temp.time} fridge readings...`}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const CookedDishSection = ({ rows, onAddRow, onRemoveRow, onUpdateRow }) => (
  <Card className="p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
      <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-rose-900">
        Cooked Dish Serving Temperature
      </h2>
      <button
        onClick={onAddRow}
        className="bg-rose-900 text-amber-50 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-rose-800 transition whitespace-nowrap"
      >
        <Plus className="h-4 w-4" /> Add Row
      </button>
    </div>

    {/* Desktop Table View */}
    <div className="hidden md:block overflow-x-auto">
      {rows.length > 0 && (
        <table className="min-w-full divide-y divide-rose-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">
                Dish name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">
                Temperature
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-rose-900 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-rose-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-rose-50/30 transition">
                <td className="px-4 py-3">
                  <input
                    value={r.dish}
                    onChange={(e) => onUpdateRow(i, "dish", e.target.value)}
                    className="w-full border border-rose-200 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder={`Dish ${i + 1}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.lunch}
                    onChange={(e) => onUpdateRow(i, "lunch", e.target.value)}
                    className="w-full border border-rose-200 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    type="time"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={r.dinner}
                    onChange={(e) => onUpdateRow(i, "dinner", e.target.value)}
                    className="w-full border border-rose-200 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                    placeholder="eg. 5° or 7°"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onRemoveRow(i)}
                    className="text-red-600 hover:text-red-800 transition p-1"
                    title="Delete row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-3">
      {rows.map((r, i) => (
        <div
          key={i}
          className="bg-white border border-rose-200 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm font-semibold text-rose-900">
              Dish {i + 1}
            </span>
            <button
              onClick={() => onRemoveRow(i)}
              className="text-red-600 hover:text-red-800 transition p-1"
              title="Delete row"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-900 uppercase mb-1">
              Dish Name
            </label>
            <input
              value={r.dish}
              onChange={(e) => onUpdateRow(i, "dish", e.target.value)}
              className="w-full border border-rose-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder={`Dish ${i + 1}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-900 uppercase mb-1">
                Time
              </label>
              <input
                value={r.lunch}
                onChange={(e) => onUpdateRow(i, "lunch", e.target.value)}
                className="w-full border border-rose-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="e.g. +65"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-900 uppercase mb-1">
                Temperature
              </label>
              <input
                value={r.dinner}
                onChange={(e) => onUpdateRow(i, "dinner", e.target.value)}
                className="w-full border border-rose-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="e.g. +70"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// smaller sections reused
const DeliverySection = ({ deliveries, onAdd, onRemove, onUpdate }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
    <SectionHeader
      title="Delivery Details"
      onAdd={onAdd}
      addButtonText="Add Delivery"
    />
    <div className="space-y-4">
      {deliveries.map((delivery, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 sm:p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              Delivery #{index + 1}
            </span>
            <DeleteButton onClick={() => onRemove(index)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <InputField
              placeholder="Supplier"
              value={delivery.supplier}
              onChange={(e) => onUpdate(index, "supplier", e.target.value)}
            />
            <InputField
              placeholder="Product"
              value={delivery.product}
              onChange={(e) => onUpdate(index, "product", e.target.value)}
            />
            <InputField
              type="time"
              value={delivery.time}
              onChange={(e) => onUpdate(index, "time", e.target.value)}
            />
            <InputField
              placeholder="Surface Temp"
              value={delivery.surfTemp}
              onChange={(e) => onUpdate(index, "surfTemp", e.target.value)}
            />
            <InputField
              placeholder="Rejected (if any)"
              value={delivery.rejectedIfAny}
              onChange={(e) => onUpdate(index, "rejectedIfAny", e.target.value)}
            />
            <InputField
              placeholder="Signature"
              value={delivery.sign}
              onChange={(e) => onUpdate(index, "sign", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const CookingSection = ({ cookings, onAdd, onRemove, onUpdate }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
    <SectionHeader
      title="Cooking & Chilling Records"
      onAdd={onAdd}
      addButtonText="Add Record"
    />
    <div className="space-y-4">
      {cookings.map((cooking, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 sm:p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              Record #{index + 1}
            </span>
            <DeleteButton onClick={() => onRemove(index)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <InputField
              placeholder="Item Cooked"
              value={cooking.itemCooked}
              onChange={(e) => onUpdate(index, "itemCooked", e.target.value)}
            />
            <InputField
              type="number"
              placeholder="End Cooking Temp (°C)"
              value={cooking.endCookingTemperature}
              onChange={(e) =>
                onUpdate(
                  index,
                  "endCookingTemperature",
                  parseFloat(e.target.value) || 0
                )
              }
            />
            <InputField
              type="time"
              value={cooking.time}
              onChange={(e) => onUpdate(index, "time", e.target.value)}
            />
            <InputField
              placeholder="Chilling Method"
              value={cooking.chillingMethod}
              onChange={(e) =>
                onUpdate(index, "chillingMethod", e.target.value)
              }
            />
            <InputField
              placeholder="Chilling Duration"
              value={cooking.chillingDuration}
              onChange={(e) =>
                onUpdate(index, "chillingDuration", e.target.value)
              }
            />
            <InputField
              type="number"
              placeholder="End Temp (°C)"
              value={cooking.endTemperature}
              onChange={(e) =>
                onUpdate(
                  index,
                  "endTemperature",
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const WastageSection = ({ wastages, onAdd, onRemove, onUpdate }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
    <SectionHeader
      title="Wastage Report"
      onAdd={onAdd}
      addButtonText="Add Wastage"
    />
    <div className="space-y-4">
      {wastages.map((wastage, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 sm:p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              Wastage #{index + 1}
            </span>
            <DeleteButton onClick={() => onRemove(index)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <InputField
              placeholder="Item Name"
              value={wastage.itemName}
              onChange={(e) => onUpdate(index, "itemName", e.target.value)}
            />
            <InputField
              placeholder="Session"
              value={wastage.session}
              onChange={(e) => onUpdate(index, "session", e.target.value)}
            />
            <InputField
              placeholder="Reason"
              value={wastage.reason}
              onChange={(e) => onUpdate(index, "reason", e.target.value)}
            />
            <InputField
              placeholder="Quantity"
              value={wastage.quantity}
              onChange={(e) => onUpdate(index, "quantity", e.target.value)}
            />
            <InputField
              placeholder="Signature"
              value={wastage.sign}
              onChange={(e) => onUpdate(index, "sign", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const IncidentSection = ({ incidents, onAdd, onRemove, onUpdate }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
    <SectionHeader
      title="Incident Report"
      onAdd={onAdd}
      addButtonText="Add Incident"
    />
    <div className="space-y-4">
      {incidents.map((incident, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 sm:p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              Incident #{index + 1}
            </span>
            <DeleteButton onClick={() => onRemove(index)} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <textarea
              placeholder="Nature of Incident"
              value={incident.nature}
              onChange={(e) => onUpdate(index, "nature", e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm sm:text-base"
              rows="2"
            />
            <textarea
              placeholder="Action Taken"
              value={incident.actionTaken}
              onChange={(e) => onUpdate(index, "actionTaken", e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm sm:text-base"
              rows="2"
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default function Checklist() {
  const [checklist, setChecklist] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    dishwasherChecks: [
      {
        period: "AM",
        time: "",
        temp: "",
        cleansingOk: "",
        chemicalSufficient: "",
        closingCheck: "",
        initial: "",
      },
      {
        period: "PM",
        time: "",
        temp: "",
        cleansingOk: "",
        chemicalSufficient: "",
        closingCheck: "",
        initial: "",
      },
    ],
    openingChecks: [
      { label: "your fridges and freezers are working properly.", yes: false },
      {
        label: "your combi oven microwave oven is working properly.",
        yes: false,
      },
      {
        label:
          "food preparation area are clean and disinfected(work surface, equipment, utensils etc.",
        yes: false,
      },
      {
        label: "all area are free from evidence of pest activity.",
        yes: false,
      },
      {
        label:
          "there are plenty of hand washing and cleaning materials(soap, paper towel, sanitiser)",
        yes: false,
      },
      {
        label: "hot running waters available at all sinks and hand wash basin.",
        yes: false,
      },
      {
        label: "probe thermometer is working and probe wipes are available.",
        yes: false,
      },
      {
        label: "allergen information is accurate for all items on sale.",
        yes: false,
      },
    ],
    fridgeTemps: [
      { time: "AM", readings: ["", "", "", "", "", "", ""] },
      { time: "PM", readings: ["", "", "", "", "", "", ""] },
    ],
    fridgeComments: { AM: "", PM: "" },
    deliveryDetails: [],
    cookingDetails: [],
    servedRows: [],
    wastageReport: [],
    incidentReport: [],
    closingChecks: [
      {
        label: "all food is covered labelled and put in fridge or freezers.",
        yes: false,
      },
      { label: "food on its use by date been discarded.", yes: false },
      {
        label: "dirty cleaning equipment's been cleaned or thrown away.",
        yes: false,
      },
      { label: "waste has been removed and new bag put in.", yes: false },
      {
        label:
          "food preparation area are clean and disinfected(work surface, equipment, utensils)",
        yes: false,
      },
      { label: "all washing up has been finished.", yes: false },
      { label: "floors are swept and clean.", yes: false },
      { label: "prove it check have been recorded.", yes: false },
    ],
    openingComment: "",
    closingComment: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.name) {
      setChecklist((prev) => ({ ...prev, name: user.name }));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Validate required fields
      if (!checklist.name.trim()) {
        setMessage("❌ Please enter your name");
        setLoading(false);
        return;
      }

      if (!checklist.date) {
        setMessage("❌ Please select a date");
        setLoading(false);
        return;
      }

      // Prepare payload - ensure all fields are properly formatted
      const payload = {
        name: checklist.name.trim(),
        date: checklist.date,
        dishwasherChecks: checklist.dishwasherChecks.map((check) => ({
          period: check.period,
          time: check.time || "",
          temp: check.temp || "",
          cleansingOk: check.cleansingOk || "",
          chemicalSufficient: check.chemicalSufficient || "",
          closingCheck: check.closingCheck || "",
          initial: check.initial || "",
        })),
        openingChecks: checklist.openingChecks.map((check) => ({
          label: check.label,
          yes: Boolean(check.yes),
        })),
        openingComment: checklist.openingComment || "",
        fridgeTemps: checklist.fridgeTemps.map((temp) => ({
          time: temp.time,
          readings: temp.readings.map((r) => r || ""),
        })),
        fridgeComments: {
          AM: checklist.fridgeComments.AM || "",
          PM: checklist.fridgeComments.PM || "",
        },
        deliveryDetails: checklist.deliveryDetails.map((d) => ({
          supplier: d.supplier || "",
          product: d.product || "",
          time: d.time || "",
          surfTemp: d.surfTemp || "",
          rejectedIfAny: d.rejectedIfAny || "",
          sign: d.sign || "",
        })),
        cookingDetails: checklist.cookingDetails.map((c) => ({
          itemCooked: c.itemCooked || "",
          endCookingTemperature: parseFloat(c.endCookingTemperature) || 0,
          time: c.time || "",
          chillingMethod: c.chillingMethod || "",
          chillingDuration: c.chillingDuration || "",
          endTemperature: parseFloat(c.endTemperature) || 0,
        })),
        servedRows: checklist.servedRows.map((r) => ({
          dish: r.dish || "",
          lunch: r.lunch || "",
          dinner: r.dinner || "",
        })),
        wastageReport: checklist.wastageReport.map((w) => ({
          itemName: w.itemName || "",
          session: w.session || "",
          reason: w.reason || "",
          quantity: w.quantity || "",
          sign: w.sign || "",
        })),
        incidentReport: checklist.incidentReport.map((i) => ({
          nature: i.nature || "",
          actionTaken: i.actionTaken || "",
        })),
        closingChecks: checklist.closingChecks.map((check) => ({
          label: check.label,
          yes: Boolean(check.yes),
        })),
        closingComment: checklist.closingComment || "",
      };

      console.log("Sending payload:", payload);

      const response = await API.post("/checklist", payload);

      if (response.status === 201 || response.status === 200) {
        setMessage("✅ Checklist saved successfully!");

        // Optionally reset form or redirect
        setTimeout(() => {
          // window.location.href = "/checklists"; // or wherever you want
        }, 2000);
      }
    } catch (error) {
      console.error("Save error:", error);

      if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else if (error.response?.status === 400) {
        setMessage("❌ Invalid data. Please check all fields.");
      } else if (error.response?.status === 401) {
        setMessage("❌ Please login to save checklist");
      } else {
        setMessage("❌ Failed to save checklist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const updateDishwasherCheck = (index, field, value) => {
    setChecklist((prev) => ({
      ...prev,
      dishwasherChecks: prev.dishwasherChecks.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateOpeningCheck = (index, value) => {
    setChecklist((prev) => ({
      ...prev,
      openingChecks: prev.openingChecks.map((item, i) =>
        i === index ? { ...item, yes: value } : item
      ),
    }));
  };

  const updateClosingCheck = (index, value) => {
    setChecklist((prev) => ({
      ...prev,
      closingChecks: prev.closingChecks.map((item, i) =>
        i === index ? { ...item, yes: value } : item
      ),
    }));
  };

  const updateFridgeTemp = (timeIndex, readingIndex, value) => {
    setChecklist((prev) => ({
      ...prev,
      fridgeTemps: prev.fridgeTemps.map((temp, i) =>
        i === timeIndex
          ? {
              ...temp,
              readings: temp.readings.map((r, j) =>
                j === readingIndex ? value : r
              ),
            }
          : temp
      ),
    }));
  };

  const updateFridgeComment = (time, value) => {
    setChecklist((prev) => ({
      ...prev,
      fridgeComments: { ...prev.fridgeComments, [time]: value },
    }));
  };

  const addServedRow = () =>
    setChecklist((prev) => ({
      ...prev,
      servedRows: [...prev.servedRows, { dish: "", lunch: "", dinner: "" }],
    }));
  const removeServedRow = (index) =>
    setChecklist((prev) => ({
      ...prev,
      servedRows: prev.servedRows.filter((_, i) => i !== index),
    }));
  const updateServedRow = (index, field, value) =>
    setChecklist((prev) => ({
      ...prev,
      servedRows: prev.servedRows.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      ),
    }));

  const addDelivery = () =>
    setChecklist((prev) => ({
      ...prev,
      deliveryDetails: [
        ...prev.deliveryDetails,
        {
          supplier: "",
          product: "",
          time: "",
          surfTemp: "",
          rejectedIfAny: "",
          sign: "",
        },
      ],
    }));
  const removeDelivery = (index) =>
    setChecklist((prev) => ({
      ...prev,
      deliveryDetails: prev.deliveryDetails.filter((_, i) => i !== index),
    }));
  const updateDelivery = (index, field, value) =>
    setChecklist((prev) => ({
      ...prev,
      deliveryDetails: prev.deliveryDetails.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

  const addCooking = () =>
    setChecklist((prev) => ({
      ...prev,
      cookingDetails: [
        ...prev.cookingDetails,
        {
          itemCooked: "",
          endCookingTemperature: 0,
          time: "",
          chillingMethod: "",
          chillingDuration: "",
          endTemperature: 0,
        },
      ],
    }));
  const removeCooking = (index) =>
    setChecklist((prev) => ({
      ...prev,
      cookingDetails: prev.cookingDetails.filter((_, i) => i !== index),
    }));
  const updateCooking = (index, field, value) => {
    setChecklist((prev) => ({
      ...prev,
      cookingDetails: prev.cookingDetails.map((item, i) => {
        if (i === index) {
          if (field === "endCookingTemperature" || field === "endTemperature") {
            return {
              ...item,
              [field]: value === "" ? 0 : parseFloat(value) || 0,
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const addWastage = () =>
    setChecklist((prev) => ({
      ...prev,
      wastageReport: [
        ...prev.wastageReport,
        { itemName: "", session: "", reason: "", quantity: "", sign: "" },
      ],
    }));
  const removeWastage = (index) =>
    setChecklist((prev) => ({
      ...prev,
      wastageReport: prev.wastageReport.filter((_, i) => i !== index),
    }));
  const updateWastage = (index, field, value) =>
    setChecklist((prev) => ({
      ...prev,
      wastageReport: prev.wastageReport.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

  const addIncident = () =>
    setChecklist((prev) => ({
      ...prev,
      incidentReport: [...prev.incidentReport, { nature: "", actionTaken: "" }],
    }));
  const removeIncident = (index) =>
    setChecklist((prev) => ({
      ...prev,
      incidentReport: prev.incidentReport.filter((_, i) => i !== index),
    }));
  const updateIncident = (index, field, value) =>
    setChecklist((prev) => ({
      ...prev,
      incidentReport: prev.incidentReport.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

  const updateOpeningComment = (value) =>
    setChecklist((prev) => ({ ...prev, openingComment: value }));
  const updateClosingComment = (value) =>
    setChecklist((prev) => ({ ...prev, closingComment: value }));

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 pt-24 sm:pt-28 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-rose-900 mb-4">
            Daily Checklist
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              label="Staff Name"
              value={checklist.name}
              onChange={(e) =>
                setChecklist({ ...checklist, name: e.target.value })
              }
              placeholder="Enter your name"
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={checklist.date}
                  onChange={(e) =>
                    setChecklist({ ...checklist, date: e.target.value })
                  }
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </Card>

        <ChecklistSection
          title="Opening Checks"
          checks={checklist.openingChecks}
          onUpdate={updateOpeningCheck}
        />

        <Card className="p-4 sm:p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comment for Opening Checks
          </label>
          <textarea
            rows={3}
            value={checklist.openingComment}
            onChange={(e) => updateOpeningComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 text-sm"
            placeholder="Add comment about opening checks..."
          />
        </Card>

        <FridgeTempSection
          temps={checklist.fridgeTemps}
          onUpdate={updateFridgeTemp}
          comments={checklist.fridgeComments}
          onCommentChange={updateFridgeComment}
        />

        <DeliverySection
          deliveries={checklist.deliveryDetails}
          onAdd={addDelivery}
          onRemove={removeDelivery}
          onUpdate={updateDelivery}
        />

        <CookingSection
          cookings={checklist.cookingDetails}
          onAdd={addCooking}
          onRemove={removeCooking}
          onUpdate={updateCooking}
        />

        {/* Dishwasher Checks */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-serif text-rose-900 mb-4">
            Dishwasher Checks
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {checklist.dishwasherChecks.map((check, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50/60"
              >
                <div className="mb-4">
                  <span className="inline-block text-sm sm:text-base font-semibold text-rose-900 bg-amber-50 px-3 py-1 rounded-lg">
                    {check.period} Check
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <InputField
                    label="Time"
                    type="time"
                    value={check.time}
                    onChange={(e) =>
                      updateDishwasherCheck(index, "time", e.target.value)
                    }
                  />
                  <SignedTempInput
                    label="Temperature"
                    value={check.temp}
                    onChange={(v) => updateDishwasherCheck(index, "temp", v)}
                    placeholder="e.g. +65"
                  />
                  <InputField
                    label="Initials"
                    value={check.initial}
                    onChange={(e) =>
                      updateDishwasherCheck(index, "initial", e.target.value)
                    }
                    placeholder="Staff initials"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <InputField
                    label="Cleansing OK"
                    value={check.cleansingOk}
                    onChange={(e) =>
                      updateDishwasherCheck(
                        index,
                        "cleansingOk",
                        e.target.value
                      )
                    }
                    placeholder="Enter status"
                  />
                  <InputField
                    label="Chemical Sufficient"
                    value={check.chemicalSufficient}
                    onChange={(e) =>
                      updateDishwasherCheck(
                        index,
                        "chemicalSufficient",
                        e.target.value
                      )
                    }
                    placeholder="Enter status"
                  />
                  <InputField
                    label="Closing Check"
                    value={check.closingCheck}
                    onChange={(e) =>
                      updateDishwasherCheck(
                        index,
                        "closingCheck",
                        e.target.value
                      )
                    }
                    placeholder="Enter status"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <CookedDishSection
          rows={checklist.servedRows}
          onAddRow={addServedRow}
          onRemoveRow={removeServedRow}
          onUpdateRow={updateServedRow}
        />

        <WastageSection
          wastages={checklist.wastageReport}
          onAdd={addWastage}
          onRemove={removeWastage}
          onUpdate={updateWastage}
        />

        <IncidentSection
          incidents={checklist.incidentReport}
          onAdd={addIncident}
          onRemove={removeIncident}
          onUpdate={updateIncident}
        />

        <ChecklistSection
          title="Closing Checks"
          checks={checklist.closingChecks}
          onUpdate={updateClosingCheck}
        />

        <Card className="p-4 sm:p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comment for Closing Checks
          </label>
          <textarea
            rows={3}
            value={checklist.closingComment}
            onChange={(e) => updateClosingComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 text-sm"
            placeholder="Add comment about closing checks..."
          />
        </Card>

        <div className="flex justify-center mb-6 sm:mb-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 bg-rose-900 text-amber-50 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-rose-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{loading ? "Saving..." : "Save Checklist"}</span>
          </button>
        </div>

        {message && (
          <div
            className={`text-center p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
