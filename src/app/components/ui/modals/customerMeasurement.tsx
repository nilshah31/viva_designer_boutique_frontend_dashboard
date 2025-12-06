"use client";

import { useEffect, useState } from "react";
import CustomerModal from "./customer"; // reuse your existing modal

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
  customerName
}: Props) {
  const [activeTab, setActiveTab] = useState<"blouse" | "lehenga">("blouse");

  const [data, setData] = useState<CustomerMeasurement>({
    customerId,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!open) return;

    setData(
      initialData || {
        customerId,
        blouseTop: {},
        lehengaPant: {},
      }
    );

    setIsDirty(false);
    setActiveTab("blouse");

  }, [open, customerId, initialData]);


  const handleClose = () => {
    if (isDirty) setShowWarning(true);
    else onClose();
  };

  const handleSave = () => {
    onSave(data);
    setIsDirty(false);
    onClose();
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
              className="px-4 py-2 bg-gray-700 text-white rounded text-sm"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gold text-black rounded text-sm"
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
          <div className="grid grid-cols-2 gap-3">
            {BLOUSE_FIELDS.map((key) => (
              <input
                key={key}
                type="number"
                placeholder={BLOUSE_LABELS[key]}
                value={data.blouseTop?.[key] ?? ""}
                onChange={(e) => {
                  setIsDirty(true);
                  setData({
                    ...data,
                    blouseTop: {
                      ...data.blouseTop,
                      [key]: Number(e.target.value),
                    },
                  });
                }}
                className="px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm"
              />
            ))}
          </div>
        )}

        {/* LEHENGA TAB */}
        {activeTab === "lehenga" && (
          <div className="grid grid-cols-2 gap-3">
            {LEHENGA_FIELDS.map((key) => (
              <input
                key={key}
                type="number"
                placeholder={LEHENGA_LABELS[key]}
                value={data.lehengaPant?.[key] ?? ""}
                onChange={(e) => {
                  setIsDirty(true);
                  setData({
                    ...data,
                    lehengaPant: {
                      ...data.lehengaPant,
                      [key]: Number(e.target.value),
                    },
                  });
                }}
                className="px-3 py-2 bg-black border border-gray-700 rounded text-white text-sm"
              />
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
