
import Image from "next/image";

import { Button } from "@/components/ui/button";
import Details from "@/components/ui/details";
import Features from "@/components/ui/features";
import Download from "@/components/ui/download";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Home() {
  return (
    <div className="min-h-screen bg-[white] dark:bg-[#0c0c0c]">
      
      
      <main className="container mx-auto px-4 py-8">
        <div className="absolute inset-0 bg-white dark:bg-[#0c0c0c]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </div>

        {/* Hero Section*/}
        <section className="relative min-h-[700px] w-full -mx-4 px-4">
          
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center items-center space-y-6 md:space-y-8 pt-10 md:pt-20">
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-lg font-medium bg-black dark:bg-white text-white dark:text-black rounded-full">
              Automated Structural Inspection Framework
            </span>
            
            <h1 className="text-4xl font-bold tracking-tighter max-w-2xl lg:max-w-5xl xl:max-w-6xl text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white px-4">
              Ensure safety with early concrete defect detection
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 dark:text-gray-400 max-w-3xl lg:max-w-4xl xl:max-w-5xl text-center px-4">
              A pluggable, modular system designed to automate concrete wall defect detection using vision-based model and traditional image processing for safer infrastructure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" className="transform transition duration-500 hover:scale-105 cursor-pointer bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-6 text-lg" asChild>
                <a href="/login">
                  Start Inspection
                  <ChevronRightIcon className="h-6 w-6" />
                </a>
                </Button>
              <Button size="lg" variant="outline" className="transform transition duration-500 hover:scale-105 cursor-pointer border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 px-8 py-6 text-lg">
                See How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Other Info */}
        
        
        <section className="relative z-10 flex mt-12 max-w-3xl mx-auto opacity-100 px-4">
              <div className="flex flex-col sm:flex-row max-w-3xl mx-auto gap-6 sm:gap-x-12 w-full">
              <div className="flex-1 text-center">  
                <div className="text-2xl md:text-3xl font-bold text-black dark:text-white">1,000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Images Analyzed</div>
              </div>
              <div className="sm:block w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 text-center">
                <div className="text-2xl md:text-3xl font-bold text-black dark:text-white">10+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Infrastructure Samples Evaluated</div>
              </div>
              <div className="sm:block w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex-1 text-center">
                <div className="text-2xl md:text-3xl font-bold text-black dark:text-white">92%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Detection Accuracy</div>
              </div>
              </div>
            </section>

        <Details/>

        <Features/>

        <Download/>
        
      </main>
    </div>
  );
}