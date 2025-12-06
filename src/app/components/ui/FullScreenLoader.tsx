"use client";

import ClipLoader from "react-spinners/ClipLoader";

export default function FullScreenLoader({
  show,
  text = "Loading...",
}: {
  show: boolean;
  text?: string;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
      <ClipLoader size={48} />
      <p className="text-sm text-gray-300 tracking-wide">{text}</p>
    </div>
  );
}
