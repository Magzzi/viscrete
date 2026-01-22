import {
  Brain,
  Camera,
  Drone,
  Layers,
  MapPinned,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "YOLO-Based Defect Detection",
    description:
      "Automatically detects concrete surface defects such as cracks, spalling, and exposed rebars using YOLO-based deep learning models.",
  },
  {
    icon: Camera,
    title: "Image & Video Processing",
    description:
      "Processes images and video feeds from cameras or drones using computer vision and traditional image processing techniques.",
  },
  {
    icon: Drone,
    title: "Drone & Mobile Integration",
    description:
      "Supports aerial and handheld data capture for inspecting hard-to-reach concrete structures like bridges, railways, and buildings.",
  },
  {
    icon: Layers,
    title: "Defect Classification & Analysis",
    description:
      "Classifies detected defects by type and severity to assist engineers in prioritizing maintenance and structural assessment.",
  },
  {
    icon: MapPinned,
    title: "Geotagged Inspection Records",
    description:
      "Stores detected defects with location data, timestamps, and visual evidence for inspection tracking and documentation.",
  },
  {
    icon: Users,
    title: "Engineer-Centered Workflow",
    description:
      "Designed to assist civil engineers by reducing manual inspection effort while improving safety, consistency, and accuracy.",
  },
];


const Details = () => {
  return (
    <div id="details" className="min-h-screen flex items-center justify-center py-12">
      <div>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-center">
          The Technology Behind <span>
            <img 
                src="/viscrete-dark.svg" 
                alt="Viscrete" 
                className="inline-block h-20 w-auto align-middle dark:block hidden"
            />
            <img 
                src="/viscrete-light.svg" 
                alt="Viscrete" 
                className="inline-block h-20 w-auto align-middle dark:hidden"
            />
          </span>
        </h2>
        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-(--breakpoint-lg) mx-auto px-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="transform transition duration-500 hover:scale-105 cursor-pointer flex flex-col border rounded-xl py-6 px-5"
            >
              <div className="mb-4 h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                <feature.icon className="size-5" />
              </div>
              <span className="text-lg font-semibold">{feature.title}</span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
