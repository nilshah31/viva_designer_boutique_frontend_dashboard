"use client";

import { useEffect, useState } from "react";
import CustomerModal from "./customer";

export interface BlouseTopMeasurements {
  blouseLength?: number;
  kurtaLength?: number;
  upperChest?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  sleeveLength?: number;
  mori?: number;
  byshape?: number;
  armhole?: number;
  frontNeckDepth?: number;
  backNeckDepth?: number;
  dartPoint?: number;
}

export interface LehengaPantMeasurements {
  length?: number;
  waist?: number;
  hip?: number;
  thigh?: number;
  knee?: number;
  ankle?: number;
  crotch?: number;
  mori?: number;
}

export interface CustomerMeasurement {
  customerId: number;
  blouseTop?: BlouseTopMeasurements;
  lehengaPant?: LehengaPantMeasurements;
}

interface Props {
  open: boolean;
  customerId: number;
  customerName: string | undefined;
  initialData?: CustomerMeasurement;
  onClose: () => void;
  onSave: (data: CustomerMeasurement) => void;
  isViewMode: boolean;
}

const BLOUSE_FIELDS: (keyof BlouseTopMeasurements)[] = [
  "blouseLength",
  "kurtaLength",
  "upperChest",
  "chest",
  "waist",
  "hip",
  "shoulder",
  "sleeveLength",
  "mori",
  "byshape",
  "armhole",
  "frontNeckDepth",
  "backNeckDepth",
  "dartPoint",
];

const LEHENGA_FIELDS: (keyof LehengaPantMeasurements)[] = [
  "length",
  "waist",
  "hip",
  "thigh",
  "knee",
  "ankle",
  "crotch",
  "mori",
];

const BLOUSE_LABELS: Record<keyof BlouseTopMeasurements, string> = {
  blouseLength: "Blouse Length",
  kurtaLength: "Kurta Length",
  upperChest: "Upper Chest",
  chest: "Chest",
  waist: "Waist",
  hip: "Hip",
  shoulder: "Shoulder",
  sleeveLength: "Sleeve Length",
  mori: "Mori",
  byshape: "By Shape",
  armhole: "Armhole",
  frontNeckDepth: "Front Neck Depth",
  backNeckDepth: "Back Neck Depth",
  dartPoint: "Dart Point",
};

const LEHENGA_LABELS: Record<keyof LehengaPantMeasurements, string> = {
  length: "Length",
  waist: "Waist",
  hip: "Hip",
  thigh: "Thigh",
  knee: "Knee",
  ankle: "Ankle",
  crotch: "Crotch",
  mori: "Mori",
};

export default function CustomerMeasurementModal({
  open,
  customerId,
  initialData,
  onClose,
  onSave,
  customerName,
  isViewMode,
}: Props) {
  const [activeTab, setActiveTab] = useState<"blouse" | "lehenga">("blouse");

  const [data, setData] = useState<CustomerMeasurement>({
    customerId,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadMeasurements = async () => {
      if (!initialData) {
        const res = await fetch(`/api/measurements?customerId=${customerId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const apiData = await res.json();
          console.log("apiData", apiData.data);
          setData(apiData.data);
        } else {
          setData({
            customerId,
            blouseTop: {},
            lehengaPant: {},
          });
        }
      } else {
        setData(initialData);
      }

      setIsDirty(false);
      setActiveTab("blouse");
    };

    loadMeasurements();
  }, [open, customerId, initialData]);

  const handleClose = () => {
    if (isDirty) setShowWarning(true);
    else onClose();
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare payload - only include non-empty measurements
      const payload: any = {
        customerId,
      };

      // Only include blouseTop if it has any values
      if (data.blouseTop && Object.values(data.blouseTop).some(v => v !== undefined && v !== null && v !== "")) {
        payload.blouseTop = data.blouseTop;
      }

      // Only include lehengaPant if it has any values
      if (data.lehengaPant && Object.values(data.lehengaPant).some(v => v !== undefined && v !== null && v !== "")) {
        payload.lehengaPant = data.lehengaPant;
      }

      const res = await fetch(`/api/measurements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const apiData = await res.json();
        onSave(apiData.data || data);
        setIsDirty(false);
        onClose();
      } else {
        console.error("Failed to save measurements");
      }
    } catch (error) {
      console.error("Error saving measurements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <CustomerModal
        open={open}
        title={`Measurements — ${customerName}`}
        onClose={handleClose}
        footer={
          <>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-700 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-gold text-black rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </>
        }
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-4">
          <button
            onClick={() => setActiveTab("blouse")}
            className={`px-4 py-2 text-sm ${
              activeTab === "blouse"
                ? "border-b-2 border-gold text-gold"
                : "text-gray-400"
            }`}
          >
            Blouse / Top
          </button>

          <button
            onClick={() => setActiveTab("lehenga")}
            className={`px-4 py-2 text-sm ${
              activeTab === "lehenga"
                ? "border-b-2 border-gold text-gold"
                : "text-gray-400"
            }`}
          >
            Lehenga / Pant
          </button>
        </div>

        {/* BLOUSE TAB */}
        {activeTab === "blouse" && (
          <div className="grid grid-cols-2 gap-4">
            {BLOUSE_FIELDS.map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">
                  {BLOUSE_LABELS[key]}
                </label>

                <input
                  type="number"
                  inputMode="decimal"
                  value={data.blouseTop?.[key] ?? ""}
                  disabled={isViewMode}
                  min="0"
                  max="100"
                  step="0.1"
                  onKeyDown={(e) => {
                    // Block 'e', 'E', '+', '-' to prevent scientific notation
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value === "") {
                      setIsDirty(true);
                      setData({
                        ...data,
                        blouseTop: {
                          ...data.blouseTop,
                          [key]: undefined,
                        },
                      });
                      return;
                    }
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                      setIsDirty(true);
                      setData({
                        ...data,
                        blouseTop: {
                          ...data.blouseTop,
                          [key]: numValue,
                        },
                      });
                    }
                  }}
                  className="px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>
        )}

        {/* LEHENGA TAB */}
        {activeTab === "lehenga" && (
          <div className="grid grid-cols-2 gap-4">
            {LEHENGA_FIELDS.map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">
                  {LEHENGA_LABELS[key]}
                </label>

                <input
                  type="number"
                  inputMode="decimal"
                  value={data.lehengaPant?.[key] ?? ""}
                  disabled={isViewMode}
                  min="0"
                  max="100"
                  step="0.1"
                  onKeyDown={(e) => {
                    // Block 'e', 'E', '+', '-' to prevent scientific notation
                    if (["e", "E", "+", "-"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value === "") {
                      setIsDirty(true);
                      setData({
                        ...data,
                        lehengaPant: {
                          ...data.lehengaPant,
                          [key]: undefined,
                        },
                      });
                      return;
                    }
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                      setIsDirty(true);
                      setData({
                        ...data,
                        lehengaPant: {
                          ...data.lehengaPant,
                          [key]: numValue,
                        },
                      });
                    }
                  }}
                  className="px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
            ))}
          </div>
        )}
      </CustomerModal>

      {/* UNSAVED WARNING MODAL */}
      <CustomerModal
        open={showWarning}
        title="Unsaved Changes"
        onClose={() => setShowWarning(false)}
        width="sm"
        footer={
          <>
            <button
              onClick={() => setShowWarning(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowWarning(false);
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm"
            >
              Discard
            </button>
          </>
        }
      >
        <p className="text-gray-300 text-sm">
          There are some unsaved changes. Are you sure you want to close?
        </p>
      </CustomerModal>
    </>
  );
}
