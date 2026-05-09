import { Database, ExternalLink } from "lucide-react";

const datasets = [
  {
    label: "BD3-Aug-MOCS",
    description: "MOCS-preprocessed augmented dataset — CLAHE-enhanced images used for model training.",
    href: "https://www.kaggle.com/datasets/ziomagugat/bd3-aug-mocs",
    tag: "MOCS",
  },
  {
    label: "BD3-Aug-Raw",
    description: "Raw augmented dataset — unprocessed source images before CLAHE enhancement.",
    href: "https://www.kaggle.com/datasets/ziomagugat/bd3-aug-raw",
    tag: "RAW",
  },
];

export default function DatasetSection() {
  return (
    <section className="w-full py-16 bg-white dark:bg-[#14171e]" id="dataset">
      <div className="container max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <p className="text-sm font-mono text-emerald-700 dark:text-[#0da6f2] uppercase tracking-widest">
            Open Data
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Training{" "}
            <span className="bg-gradient-to-r from-[#2ca75d] to-[#0da6f2] bg-clip-text text-transparent">
              Datasets
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Publicly available on Kaggle — the concrete defect datasets used to train the YOLOv11 model.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {datasets.map(({ label, description, href, tag }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-xl
                         border border-emerald-100 bg-gray-50
                         hover:border-emerald-300 hover:bg-emerald-50/50
                         dark:border-[#1e4032] dark:bg-[#101115]
                         dark:hover:border-[#2ca75d]/50 dark:hover:bg-[#2ca75d]/[0.04]
                         transition-all duration-200"
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                              bg-emerald-50 group-hover:bg-emerald-100
                              dark:bg-[#1e4032] dark:group-hover:bg-[#2ca75d]/20 transition-colors">
                <Database className="w-5 h-5 text-emerald-600 dark:text-[#2ca75d]" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {label}
                  </span>
                  <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold
                                   bg-emerald-50 dark:bg-[#2ca75d]/10
                                   text-emerald-600 dark:text-[#2ca75d]
                                   border border-emerald-200 dark:border-[#2ca75d]/20">
                    {tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* External link indicator */}
              <ExternalLink className="shrink-0 w-4 h-4 text-gray-300 dark:text-gray-600
                                       group-hover:text-emerald-500 dark:group-hover:text-[#2ca75d]
                                       transition-colors mt-0.5" />
            </a>
          ))}
        </div>

        {/* Kaggle attribution */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Hosted on{" "}
          <a
            href="https://www.kaggle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#20BEFF] hover:underline font-medium"
          >
            Kaggle
          </a>
        </p>

      </div>
    </section>
  );
}
