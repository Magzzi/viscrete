import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Home() {
  return (
    <div className="min-h-screen bg-[white] dark:bg-[#0c0c0c]">
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

        <div className="mt-60 md:mt-72 lg:mt-80">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text */}
            <div className="text-center lg:text-left">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white">
                Lets get<br />you started!
              </h2>
            </div>

            {/* Right Side - Download Card */}
            <div className="bg-black dark:bg-white rounded-3xl p-8 md:p-10 lg:p-12">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <Image
                  src="/viscrete-dark.svg"
                  alt="VISCRETE"
                  width={180}
                  height={60}
                  priority
                  className="dark:hidden"
                />
                <Image
                  src="/viscrete-light.svg"
                  alt="VISCRETE"
                  width={180}
                  height={60}
                  priority
                  className="dark:block"
                />
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold text-white dark:text-black mb-3">
                Download
              </h3>
              
              <p className="text-lg md:text-xl text-white dark:text-black mb-8">
                Fully optimized both windows and mac
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="cursor-pointer bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 px-6 py-6 text-base font-medium"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                  Windows 11 (64-bit)
                </Button>
                
                {/* <Button 
                  size="lg" 
                  className="disabled cursor-pointer bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 px-6 py-6 text-base font-medium"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  MacOS 12+ (64-bit)
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        
      </main>
    </div>
  );
}
