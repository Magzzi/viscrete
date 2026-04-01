"use client";

import { useState } from "react";
import {
  ImageUp,
  SlidersHorizontal,
  ScanSearch,
  ChevronRight,
  Workflow,
  Network,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Architecture type definitions                                     */
/* ------------------------------------------------------------------ */

type ArchType = "process" | "system";

/* ------------------------------------------------------------------ */
/*  Pipeline stage data per architecture type                         */
/* ------------------------------------------------------------------ */

interface StageDetail {
  title: string;
  bullets: string[];
}

interface PipelineStage {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  process: StageDetail;
  system: StageDetail;
}

const stages: PipelineStage[] = [
  {
    id: "input",
    label: "Input",
    icon: ImageUp,
    process: {
      title: "Image Acquisition",
      bullets: [
        "Upload concrete surface images via the web interface.",
        "Accepts JPEG, PNG, and BMP formats up to 20 MB.",
        "Images are validated for resolution and format compliance.",
        "Uploaded files are stored in a project-scoped directory.",
      ],
    },
    system: {
      title: "Upload Gateway",
      bullets: [
        "Next.js client sends multipart form data to the FastAPI backend.",
        "Files land in /storage/jobs/{project}/original/.",
        "A unique job ID is generated and returned to the client.",
        "Input validation middleware checks MIME type and file size.",
      ],
    },
  },
  {
    id: "preprocess",
    label: "Pre-Process",
    icon: SlidersHorizontal,
    process: {
      title: "Image Enhancement",
      bullets: [
        "Resize to model-compatible dimensions (e.g., 640×640).",
        "Apply CLAHE for adaptive contrast enhancement.",
        "Bilateral filtering smooths noise while preserving edges.",
        "Normalized pixel values are fed to the detection model.",
      ],
    },
    system: {
      title: "Preprocessing Pipeline",
      bullets: [
        "Pipeline orchestrated by the preprocessing service module.",
        "CLAHE and bilateral filter applied via OpenCV routines.",
        "Processed images written to /storage/jobs/{project}/processed/.",
        "Albumentations used for optional augmentation transforms.",
      ],
    },
  },
  {
    id: "detection",
    label: "Detection & Results",
    icon: ScanSearch,
    process: {
      title: "Defect Detection & Output",
      bullets: [
        "YOLOv11 model infers bounding boxes for defects.",
        "Defects classified by type: crack, spalling, rebar exposure.",
        "Confidence scores and severity ratings assigned per defect.",
        "Annotated images and JSON reports generated for review.",
      ],
    },
    system: {
      title: "Inference & Storage",
      bullets: [
        "Detection service loads the YOLOv11-SAMPLE.pt model at startup.",
        "Inference runs on GPU when available, falls back to CPU.",
        "Results persisted to /storage/jobs/{project}/results/.",
        "API returns annotated images and structured JSON to the frontend.",
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const AlgorithmSection = () => {
  const [archType, setArchType] = useState<ArchType>("process");
  const [activeStage, setActiveStage] = useState(0);

  const current = stages[activeStage];
  const detail = archType === "process" ? current.process : current.system;

  return (
    <section className="w-full py-24 bg-[#101115]" id="algorithm">
      <div className="container max-w-6xl mx-auto px-6">
        {/* ── Header ─────────────────────────────────── */}
        <div className="text-center mb-12 space-y-4">
          <p className="text-sm font-mono text-[#0da6f2] uppercase tracking-widest">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            The Algorithm Behind{" "}
            <span className="bg-gradient-to-r from-[#2ca75d] to-[#0da6f2] bg-clip-text text-transparent">
              viscrete
            </span>
          </h2>
        </div>

        {/* ── Architecture type toggle ────────────────── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg border border-[#1e4032] bg-[#0c0e12] p-1 gap-1">
            <button
              onClick={() => setArchType("process")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                archType === "process"
                  ? "bg-[#2ca75d]/20 text-[#2ca75d] border border-[#2ca75d]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Workflow className="w-4 h-4" />
              Process Architecture
            </button>
            <button
              onClick={() => setArchType("system")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                archType === "system"
                  ? "bg-[#0da6f2]/20 text-[#0da6f2] border border-[#0da6f2]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Network className="w-4 h-4" />
              System Architecture
            </button>
          </div>
        </div>

        {/* ── Pipeline carousel buttons (process only) ── */}
        {archType === "process" && (
          <div className="flex items-center justify-center gap-2 mb-12">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = idx === activeStage;
                const accentColor = "#2ca75d";

                return (
                  <div key={stage.id} className="flex items-center gap-2">
                    {/* stage button */}
                    <button
                      onClick={() => setActiveStage(idx)}
                      className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer"
                      style={{
                        backgroundColor: isActive
                          ? `${accentColor}15`
                          : "#0c0e12",
                        border: `1px solid ${
                          isActive ? `${accentColor}66` : "#1e4032"
                        }`,
                        color: isActive ? accentColor : "#9ca3af",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {stage.label}
                    </button>

                    {/* arrow separator (skip after last) */}
                    {idx < stages.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* ── System Architecture image ──────────────── */}
        {archType === "system" && (
          <div className="rounded-lg border border-[#1e4032] bg-[#0c0e12] p-4 md:p-6">
            <img
              src="/system-architecture.png"
              alt="System Architecture Diagram"
              className="w-full rounded-md"
            />
          </div>
        )}

        {/* ── Process Architecture detail card ───────── */}
        {archType === "process" && (
          <>
            <div
              key={`process-${activeStage}`}
              className="rounded-lg border border-[#1e4032] bg-[#0c0e12] p-8 md:p-10 animate-in fade-in duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "rgba(44,167,93,0.15)" }}
                >
                  <current.icon className="w-5 h-5 text-[#2ca75d]" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {detail.title}
                </h3>
              </div>

              <ul className="space-y-3">
                {detail.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2ca75d]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Stage indicators ───────────────────── */}
            <div className="flex justify-center gap-2 mt-6">
              {stages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className="h-1.5 rounded-full transition-all cursor-pointer"
                  style={{
                    width: idx === activeStage ? "2rem" : "0.375rem",
                    backgroundColor:
                      idx === activeStage ? "#2ca75d" : "#1e4032",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AlgorithmSection;
