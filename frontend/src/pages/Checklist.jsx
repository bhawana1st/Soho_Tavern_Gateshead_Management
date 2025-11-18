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

// Section Header Component
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

// Input Field Component
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

// Checkbox Item Component
const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-lg transition">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 text-rose-900 border-gray-300 rounded focus:ring-rose-900 mt-0.5 shrink-0"
    />
    <span className="text-sm sm:text-base text-gray-700 group-hover:text-rose-900 transition">
      {label}
    </span>
  </label>
);

// Temperature Input Component
const TempInput = ({ value, onChange, label, placeholder = "e.g. 3.5" }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={onChange}
        className="w-full px-3 sm:px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm sm:text-base"
        placeholder={placeholder}
      />
      <span className="absolute right-3 top-2.5 text-gray-500 text-sm">°C</span>
    </div>
  </div>
);

// Delete Button Component
const DeleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition shrink-0"
    aria-label="Delete"
  >
    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
  </button>
);

// Opening/Closing Checks Section
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

// Fridge Temperature Section
const FridgeTempSection = ({ temps, onUpdate }) => (
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
              <TempInput
                key={readingIndex}
                label={`Fridge ${readingIndex + 1}`}
                value={reading}
                onChange={(e) =>
                  onUpdate(timeIndex, readingIndex, e.target.value)
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Dishwasher Checks Section
const DishwasherSection = ({ checks, onUpdate }) => (
  <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
    <h2 className="text-xl sm:text-2xl font-serif text-rose-900 mb-4">
      Dishwasher Checks
    </h2>
    <div className="space-y-4 sm:space-y-6">
      {checks.map((check, index) => (
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
              onChange={(e) => onUpdate(index, "time", e.target.value)}
            />
            <TempInput
              label="Temperature"
              value={check.temp}
              onChange={(e) => onUpdate(index, "temp", e.target.value)}
              placeholder="e.g. 65"
            />
            <InputField
              label="Initials"
              value={check.initial}
              onChange={(e) => onUpdate(index, "initial", e.target.value)}
              placeholder="Staff initials"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <InputField
              label="Cleansing OK"
              value={check.cleansingOk}
              onChange={(e) => onUpdate(index, "cleansingOk", e.target.value)}
              placeholder="Enter status"
            />
            <InputField
              label="Chemical Sufficient"
              value={check.chemicalSufficient}
              onChange={(e) =>
                onUpdate(index, "chemicalSufficient", e.target.value)
              }
              placeholder="Enter status"
            />
            <InputField
              label="Closing Check"
              value={check.closingCheck}
              onChange={(e) => onUpdate(index, "closingCheck", e.target.value)}
              placeholder="Enter status"
            />
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// Delivery Details Section
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

// Cooking Details Section
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

// Wastage Report Section
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

// Incident Report Section
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

// Main Checklist Component
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
      { time: "AM", readings: [0, 0, 0, 0, 0, 0] },
      { time: "PM", readings: [0, 0, 0, 0, 0, 0] },
    ],
    deliveryDetails: [],
    cookingDetails: [],
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
      const response = await API.post("/checklist", checklist);
      console.log(response);
      if (response.status === 201) {
        setMessage("✅ Checklist saved successfully!");
      } else {
        setMessage(`❌ Error: ${response.data.message}`);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ?? "❌ Failed to save checklist"
      );
    } finally {
      setLoading(false);
    }
  };

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
                j === readingIndex ? parseFloat(value) || 0 : r
              ),
            }
          : temp
      ),
    }));
  };

  // Delivery handlers
  const addDelivery = () => {
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
  };

  const removeDelivery = (index) => {
    setChecklist((prev) => ({
      ...prev,
      deliveryDetails: prev.deliveryDetails.filter((_, i) => i !== index),
    }));
  };

  const updateDelivery = (index, field, value) => {
    setChecklist((prev) => ({
      ...prev,
      deliveryDetails: prev.deliveryDetails.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Cooking handlers
  const addCooking = () => {
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
  };

  const removeCooking = (index) => {
    setChecklist((prev) => ({
      ...prev,
      cookingDetails: prev.cookingDetails.filter((_, i) => i !== index),
    }));
  };

  const updateCooking = (index, field, value) => {
    setChecklist((prev) => ({
      ...prev,
      cookingDetails: prev.cookingDetails.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Wastage handlers
  const addWastage = () => {
    setChecklist((prev) => ({
      ...prev,
      wastageReport: [
        ...prev.wastageReport,
        {
          itemName: "",
          session: "",
          reason: "",
          quantity: "",
          sign: "",
        },
      ],
    }));
  };

  const removeWastage = (index) => {
    setChecklist((prev) => ({
      ...prev,
      wastageReport: prev.wastageReport.filter((_, i) => i !== index),
    }));
  };

  const updateWastage = (index, field, value) => {
    setChecklist((prev) => ({
      ...prev,
      wastageReport: prev.wastageReport.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Incident handlers
  const addIncident = () => {
    setChecklist((prev) => ({
      ...prev,
      incidentReport: [...prev.incidentReport, { nature: "", actionTaken: "" }],
    }));
  };

  const removeIncident = (index) => {
    setChecklist((prev) => ({
      ...prev,
      incidentReport: prev.incidentReport.filter((_, i) => i !== index),
    }));
  };

  const updateIncident = (index, field, value) => {
    setChecklist((prev) => ({
      ...prev,
      incidentReport: prev.incidentReport.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

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

        {/* Opening Checks */}
        <ChecklistSection
          title="Opening Checks"
          checks={checklist.openingChecks}
          onUpdate={updateOpeningCheck}
        />

        {/* Fridge Temperatures */}
        <FridgeTempSection
          temps={checklist.fridgeTemps}
          onUpdate={updateFridgeTemp}
        />

        {/* Delivery Details */}
        <DeliverySection
          deliveries={checklist.deliveryDetails}
          onAdd={addDelivery}
          onRemove={removeDelivery}
          onUpdate={updateDelivery}
        />

        {/* Cooking Details */}
        <CookingSection
          cookings={checklist.cookingDetails}
          onAdd={addCooking}
          onRemove={removeCooking}
          onUpdate={updateCooking}
        />

        {/* Dishwasher Checks */}
        <DishwasherSection
          checks={checklist.dishwasherChecks}
          onUpdate={updateDishwasherCheck}
        />

        {/* Wastage Report */}
        <WastageSection
          wastages={checklist.wastageReport}
          onAdd={addWastage}
          onRemove={removeWastage}
          onUpdate={updateWastage}
        />

        {/* Incident Report */}
        <IncidentSection
          incidents={checklist.incidentReport}
          onAdd={addIncident}
          onRemove={removeIncident}
          onUpdate={updateIncident}
        />

        {/* Closing Checks */}
        <ChecklistSection
          title="Closing Checks"
          checks={checklist.closingChecks}
          onUpdate={updateClosingCheck}
        />

        {/* Save Button */}
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

        {/* Message */}
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
