'use client';

// REACT
import { useParams } from 'next/navigation';
import { useRef, useState, useEffect } from "react";

// MUI
import SettingsIcon from '@mui/icons-material/Settings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { Download } from 'lucide-react';
import { Grid3x3 } from 'lucide-react';
import { ChevronDown } from 'lucide-react';






export default function ResultPage() {
    const params = useParams();
    const jobId = params.job_id;

    // Project Validity
    const [isValidProject, setIsValidProject] = useState(true);

    useEffect(() => {
        // Here you would typically fetch project data using the jobId
        // For demonstration, we'll assume the project is valid if jobId is "valid-job"
        if (jobId !== "valid-job") {
            setIsValidProject(false);
        }
    }, [jobId]);

    // Results
    const [result, setResult] = useState(null);
    const [riskScore, setRiskScore] = useState(null);
    const [totalDefectCount , setTotalDefectCount] = useState(null);
    const [cracksCount, setCracksCount] = useState(0);
    const [spallingCount, setSpallingCount] = useState(0);
    const [peelingCount, setPeelingCount] = useState(0);
    const [algaeCount, setAlgaeCount] = useState(0);
    const [stainCount, setStainCount] = useState(0);

    // Project Info
    const [projectDate, setProjectDate] = useState("February 10, 2026; 6:07 PM");
    const [projectName, setProjectName] = useState("Construction Site 1 Upper Deck");
    const [modelName, setModelName] = useState("YOLOv11-STRUCTURAL.pt");
    const [projectImages, setProjectImages] = useState([]);


    return (
        <div className='flex flex-col min-h-screen overflow-hidden'>
            {/* HEADER */}
            <header className="bg-black dark:bg-black border-b border-gray-800">
                <div className="container mx-4 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        
                        <div>
                            <h1 className="text-xl font-bold text-white">VIEW RESULTS</h1>
                            <p className="text-sm text-gray-400">
                                Detection Results for {projectName}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 items-center justify-end'>
                        <h3 className='p-2 text-gray-400'>
                            <span className="flex items-center gap-1">
                                <SettingsIcon fontSize="small" />
                                {modelName}
                            </span>
                        </h3>
                        <h3 className='p-2 text-gray-400'>
                            <span className="flex items-center gap-1">
                                <CalendarMonthIcon fontSize="small" />
                                {projectDate}
                            </span>
                        </h3>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <div className='flex flex-1'>
                {/* Main Image Viewer */}
                <div className='flex-1 bg-gray-900 relative'>
                    {/* Overlay buttons will go here */}
                </div>

                {/* Right Sidebar */}
                <div className='w-96 bg-gray-950 border-l border-gray-800 p-6 overflow-y-auto'>
                    {/* Risk Score Section */}
                    <div className='mb-6'>
                        <div className='text-xs text-gray-400 uppercase mb-2'>Overall Risk Score</div>
                        <div className='flex items-end gap-2 mb-2'>
                            <div className='text-5xl font-bold text-red-500'>0</div>
                            <div className='text-gray-500 text-lg mb-2'>/ 100</div>
                        </div>
                        <div className='w-full h-2 bg-gray-800 rounded-full overflow-hidden'>
                            <div className='h-full bg-red-500' style={{ width: '0%' }}></div>
                        </div>
                    </div>

                    {/* Defect Type Cards Grid */}
                    <div className='grid grid-cols-2 gap-3 mb-6'>
                        {/* Total Defects */}
                        <div className='bg-blue-950/30 border border-blue-900/50 rounded-lg p-4'>
                            <div className='text-blue-400 text-3xl font-bold mb-1'>0</div>
                            <div className='text-blue-300 text-sm'>Total Defects</div>
                        </div>

                        {/* Cracks */}
                        <div className='bg-red-950/30 border border-red-900/50 rounded-lg p-4'>
                            <div className='text-red-400 text-3xl font-bold mb-1'>0</div>
                            <div className='text-red-300 text-sm'>Cracks</div>
                        </div>

                        {/* Spalling */}
                        <div className='bg-yellow-950/30 border border-yellow-900/50 rounded-lg p-4'>
                            <div className='text-yellow-400 text-3xl font-bold mb-1'>0</div>
                            <div className='text-yellow-300 text-sm'>Spalling</div>
                        </div>

                        {/* Peeling */}
                        <div className='bg-orange-950/30 border border-orange-900/50 rounded-lg p-4'>
                            <div className='text-orange-400 text-3xl font-bold mb-1'>0</div>
                            <div className='text-orange-300 text-sm'>Peeling</div>
                        </div>

                        {/* Algae */}
                        <div className='bg-green-950/30 border border-green-900/50 rounded-lg p-4'>
                            <div className='text-green-400 text-3xl font-bold mb-1'>0</div>
                            <div className='text-green-300 text-sm'>Algae</div>
                        </div>

                        {/* Stain */}
                        <div className='bg-purple-950/30 border border-purple-900/50 rounded-lg p-4'>
                            <div className='text-purple-400 text-3xl font-bold mb-1'>0</div>
                            <div className='text-purple-300 text-sm'>Stain</div>
                        </div>
                    </div>

                    {/* Detected Defects List */}
                    <div className='mb-6'>
                        <div className='text-xs text-blue-400 uppercase mb-4 tracking-wider'>Detected Defects (0)</div>
                        <div className='text-gray-500 text-sm'>No defects detected</div>
                    </div>

                    {/* Export */}
                    <div className='mt-8'>
                        <div className='text-xs text-blue-400 uppercase mb-4 tracking-wider'>Export Report</div>
                        <Button className='w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mb-3'>
                            <Download className='w-4 h-4 mr-2' />
                            Download PDF Report
                        </Button>
                        <Button variant='outline' className='w-full bg-black border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-950/20'>
                            <Grid3x3 className='w-4 h-4 mr-2' />
                            More Export Options
                            <ChevronDown className='w-4 h-4 ml-auto' />
                        </Button>
                    </div>
                </div>
            </div>

            
            
        </div>
    );
}