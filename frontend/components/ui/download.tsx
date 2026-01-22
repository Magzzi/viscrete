import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Download() {
  return (
    <section className="mt-8 md:mt-12 lg:mt-24 py-6 md:py-8 px-6 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center max-w-5xl mx-auto">
        {/* Left Side - Text */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white">
            Lets get<br />you started!
          </h2>
        </div>

        {/* Right Side - Download Card */}
        <div className="bg-black dark:bg-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <Image
              src="/viscrete-dark.svg"
              alt="VISCRETE"
              width={120}
              height={40}
              priority
              className="dark:hidden"
            />
            <Image
              src="/viscrete-light.svg"
              alt="VISCRETE"
              width={120}
              height={40}
              priority
              className="hidden dark:block"
            />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white dark:text-black mb-2">
            Download
          </h3>
          
          <p className="text-base md:text-lg text-white dark:text-black mb-6">
            Fully optimized for Windows Devices
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="default"
              className="cursor-pointer bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 px-5 py-5 text-sm font-medium"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
              </svg>
              Windows 11 (64-bit)
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
