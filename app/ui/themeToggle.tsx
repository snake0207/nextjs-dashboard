"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="hidden md:block cursor-pointer p-1 text-slate-900 dark:text-white">
      {/*     <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select> */}
      {theme === "dark" && (
        <SunIcon className="w-10" onClick={() => setTheme("light")} />
      )}
      {theme === "light" && (
        <MoonIcon className="w-10" onClick={() => setTheme("dark")} />
      )}
    </div>
  );
}
