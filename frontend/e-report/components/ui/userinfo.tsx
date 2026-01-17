'use client'

import { useTheme } from "@/context/theme/themeprovider";
import { ThemeSwitcher } from "./ThemeToggle";

export default function UserInfo() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex h-fit mb-4 items-center justify-center">
      <div className="flex flex-row items-center max-w-[90%] space-x-4 
                      bg-white dark:bg-zinc-900
                      rounded-2xl ring-1 ring-border shadow-2xl px-2 py-1">

        <div className="flex items-center space-x-3">
          <div className="min-w-7 min-h-7 rounded-full bg-amber-100 cursor-pointer" />
          <p className="text-neutral-800 dark:text-neutral-100 text-xs">
            Anmol Thakur
          </p>
        </div>

        <ThemeSwitcher
          value={theme}
          onChange={setTheme}
        />
      </div>
    </section>
  );
}
