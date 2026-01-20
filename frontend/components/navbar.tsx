"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined"
import Image from "next/image";

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="sticky top-0 md:top-5 z-50 p-2 md:p-2 w-full bg-white dark:bg-black border-b md:border-b-0 border-gray-200 dark:border-gray-800">
      <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-8 w-full">
        <div className="flex items-center">
          {/* Logo */}
          {theme === "dark" ? (
            <Image
          src="/viscrete-dark.svg"
          alt="VISCRETE"
          width={100}
          height={33}
          priority
          className="md:w-[150px] md:h-[50px]"
          />
          ) : (
            <Image
            src="/viscrete-light.svg"
            alt="VISCRETE"
            width={100}
            height={33}
            priority
            className="md:w-[150px] md:h-[50px]"
            />
          )
          }
          
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <LightbulbIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
          ) : (
            <LightbulbOutlinedIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
          )}
        </button>
      </div>
    </nav>
  )
}
