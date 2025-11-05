import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Calendar } from "lucide-react";
import API from "../utils/api";
import bg from "../assets/restaurant-interior.jpg"; // Add your restaurant background image

export default function Checklist() {
  const [checklist, setChecklist] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    openingChecks: [
      { label: "All equipment cleaned and sanitized", yes: false },
      { label: "Temperature logs checked", yes: false },
      { label: "Stock rotation completed", yes: false },
      { label: "Kitchen floors cleaned", yes: false },
    ],
    fridgeTemps: [
      { time: "AM", readings: [0, 0, 0] },
      { time: "PM", readings: [0, 0, 0] },
    ],
    deliveryDetails: [],
    cookingDetails: [],
    wastageReport: [],
    incidentReport: [],
    closingChecks: [
      { label: "All food properly stored", yes: false },
      { label: "Kitchen cleaned and sanitized", yes: false },
      { label: "Equipment turned off", yes: false },
      { label: "Waste disposed correctly", yes: false },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setChecklist((prev) => ({ ...prev, name: user.name }));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await API.post("/checklist", checklist);

      if (response.status === 200) {
        setMessage("✅ Checklist saved successfully!");
      } else {
        console.log(data);
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(error.response.data.message ?? "❌ Failed to save checklist");
    } finally {
      setLoading(false);
    }
  };

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

  const addIncident = () => {
    setChecklist((prev) => ({
      ...prev,
      incidentReport: [
        ...prev.incidentReport,
        {
          nature: "",
          actionTaken: "",
        },
      ],
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

  return (
    <div
      className="min-h-screen bg-cover bg-center pt-24 pb-8 px-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="white-card p-6 mb-6">
          <h1 className="text-4xl font-serif text-burgundy mb-4">
            Daily Checklist
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Staff Name
              </label>
              <input
                type="text"
                value={checklist.name}
                onChange={(e) =>
                  setChecklist({ ...checklist, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={checklist.date}
                  onChange={(e) =>
                    setChecklist({ ...checklist, date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opening Checks */}
        <div className="white-card p-6 mb-6">
          <h2 className="text-2xl font-serif text-burgundy mb-4">
            Opening Checks
          </h2>
          <div className="space-y-3">
            {checklist.openingChecks.map((check, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={check.yes}
                  onChange={(e) => updateOpeningCheck(index, e.target.checked)}
                  className="w-5 h-5 text-burgundy border-gray-300 rounded focus:ring-burgundy"
                />
                <span className="text-gray-700 group-hover:text-burgundy transition">
                  {check.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Fridge Temperatures */}
        <div className="white-card p-6 mb-6">
          <h2 className="text-2xl font-serif text-burgundy mb-2">
            Fridge Temperature Monitoring
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Record temperatures for all fridges twice daily. Safe range: 0-5°C
          </p>
          {checklist.fridgeTemps.map((temp, timeIndex) => (
            <div key={timeIndex} className="mb-6 last:mb-0">
              <div className="flex items-center mb-3">
                <span className="text-lg font-semibold text-burgundy bg-cream px-3 py-1 rounded-lg">
                  {temp.time} Reading
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {temp.readings.map((reading, readingIndex) => (
                  <div key={readingIndex}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fridge {readingIndex + 1} Temperature
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={reading}
                        onChange={(e) =>
                          updateFridgeTemp(
                            timeIndex,
                            readingIndex,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                        placeholder="e.g. 3.5"
                      />
                      <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                        °C
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Details */}
        <div className="white-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-burgundy">
              Delivery Details
            </h2>
            <button onClick={addDelivery} className="btn-primary">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Delivery
            </button>
          </div>
          <div className="space-y-4">
            {checklist.deliveryDetails.map((delivery, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Delivery #{index + 1}
                  </span>
                  <button
                    onClick={() => removeDelivery(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Supplier"
                    value={delivery.supplier}
                    onChange={(e) =>
                      updateDelivery(index, "supplier", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Product"
                    value={delivery.product}
                    onChange={(e) =>
                      updateDelivery(index, "product", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={delivery.time}
                    onChange={(e) =>
                      updateDelivery(index, "time", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Surface Temp"
                    value={delivery.surfTemp}
                    onChange={(e) =>
                      updateDelivery(index, "surfTemp", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Rejected (if any)"
                    value={delivery.rejectedIfAny}
                    onChange={(e) =>
                      updateDelivery(index, "rejectedIfAny", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Signature"
                    value={delivery.sign}
                    onChange={(e) =>
                      updateDelivery(index, "sign", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Details */}
        <div className="white-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-burgundy">
              Cooking & Chilling Records
            </h2>
            <button onClick={addCooking} className="btn-primary">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Record
            </button>
          </div>
          <div className="space-y-4">
            {checklist.cookingDetails.map((cooking, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Record #{index + 1}
                  </span>
                  <button
                    onClick={() => removeCooking(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Item Cooked"
                    value={cooking.itemCooked}
                    onChange={(e) =>
                      updateCooking(index, "itemCooked", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="End Cooking Temp (°C)"
                    value={cooking.endCookingTemperature}
                    onChange={(e) =>
                      updateCooking(
                        index,
                        "endCookingTemperature",
                        parseFloat(e.target.value)
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="time"
                    value={cooking.time}
                    onChange={(e) =>
                      updateCooking(index, "time", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Chilling Method"
                    value={cooking.chillingMethod}
                    onChange={(e) =>
                      updateCooking(index, "chillingMethod", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Chilling Duration"
                    value={cooking.chillingDuration}
                    onChange={(e) =>
                      updateCooking(index, "chillingDuration", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="End Temp (°C)"
                    value={cooking.endTemperature}
                    onChange={(e) =>
                      updateCooking(
                        index,
                        "endTemperature",
                        parseFloat(e.target.value)
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wastage Report */}
        <div className="white-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-burgundy">
              Wastage Report
            </h2>
            <button onClick={addWastage} className="btn-primary">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Wastage
            </button>
          </div>
          <div className="space-y-4">
            {checklist.wastageReport.map((wastage, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Wastage #{index + 1}
                  </span>
                  <button
                    onClick={() => removeWastage(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={wastage.itemName}
                    onChange={(e) =>
                      updateWastage(index, "itemName", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Session"
                    value={wastage.session}
                    onChange={(e) =>
                      updateWastage(index, "session", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Reason"
                    value={wastage.reason}
                    onChange={(e) =>
                      updateWastage(index, "reason", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={wastage.quantity}
                    onChange={(e) =>
                      updateWastage(index, "quantity", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Signature"
                    value={wastage.sign}
                    onChange={(e) =>
                      updateWastage(index, "sign", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Report */}
        <div className="white-card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-burgundy">
              Incident Report
            </h2>
            <button onClick={addIncident} className="btn-primary">
              <Plus className="h-4 w-4 inline mr-2" />
              Add Incident
            </button>
          </div>
          <div className="space-y-4">
            {checklist.incidentReport.map((incident, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-600">
                    Incident #{index + 1}
                  </span>
                  <button
                    onClick={() => removeIncident(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <textarea
                    placeholder="Nature of Incident"
                    value={incident.nature}
                    onChange={(e) =>
                      updateIncident(index, "nature", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                    rows="2"
                  />
                  <textarea
                    placeholder="Action Taken"
                    value={incident.actionTaken}
                    onChange={(e) =>
                      updateIncident(index, "actionTaken", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent"
                    rows="2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Checks */}
        <div className="white-card p-6 mb-6">
          <h2 className="text-2xl font-serif text-burgundy mb-4">
            Closing Checks
          </h2>
          <div className="space-y-3">
            {checklist.closingChecks.map((check, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={check.yes}
                  onChange={(e) => updateClosingCheck(index, e.target.checked)}
                  className="w-5 h-5 text-burgundy border-gray-300 rounded focus:ring-burgundy"
                />
                <span className="text-gray-700 group-hover:text-burgundy transition">
                  {check.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-3 bg-burgundy text-cream px-8 py-3 rounded-lg text-lg font-semibold hover:bg-burgundy/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? "Saving..." : "Save Checklist"}</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`text-center p-4 rounded-lg ${
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
