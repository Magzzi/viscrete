import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center space-y-6 md:space-y-8">
          <span className="inline-block mt-10 md:mt-20 px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base lg:text-lg font-medium bg-black dark:bg-white text-white dark:text-black rounded-full">Automated Structural Inspection Framework</span>
          <h1 className="text-4xl font-bold tracking-tighter max-w-2xl lg:max-w-5xl xl:max-w-6xl text-center sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent dark:from-white dark:via-gray-300 dark:to-white px-4">Ensure safety with early concrete defect detection</h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-gray-600 dark:text-gray-400 max-w-3xl lg:max-w-4xl xl:max-w-5xl text-center px-4">
            A pluggable, modular system designed to automate concrete wall defect detection using vision-based model and traditional image processing for safer infrastructure.
          </p>


          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button size="lg" className="cursor-pointer bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-6 text-lg">
              Start Inspection
              <ChevronRightIcon className="ml-2 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="cursor-pointer border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 px-8 py-6 text-lg">
              See How It Works
            </Button>
          </div>
        </div>
        
      </main>
    </div>
  );
}
