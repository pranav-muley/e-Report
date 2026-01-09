import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/ui/ThemeToggle"
import { useTheme } from "@/context/theme/themeprovider"


export default function Header() {

    const { theme, setTheme } = useTheme();

    return <header className="h-14 flex items-center px-4">
        <div className="flex w-full items-center justify-between">
            <SidebarTrigger />
            <ThemeSwitcher value={theme} onChange={setTheme} />
        </div>
    </header>
}