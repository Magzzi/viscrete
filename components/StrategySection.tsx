import { Shield, Zap, TrendingUp, Layers } from "lucide-react";

const strategies = [
  {
    icon: Shield,
    title: "Safety-First Inspections",
    description: "Minimize on-site risk by automating visual inspections of hazardous infrastructure.",
  },
  {
    icon: Zap,
    title: "Rapid Assessment",
    description: "Accelerate inspection workflows with real-time defect detection and instant reporting.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Maintenance",
    description: "Leverage historical defect data to forecast structural degradation trends.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description: "Extend and customize the framework with pluggable modules for any inspection scenario.",
  },
];

const StrategySection = () => {
  return (
    <section className="w-full py-24 bg-[#14171e]">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Strengthen Your Strategy
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Enhance your strategy with intelligent tools designed for success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategies.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-lg border border-[#4a411e]/50 bg-[#4a411e]/10 hover:border-[#e5ac0c]/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-[#4a411e] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#e5ac0c]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
