import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const isDarkMode = theme === "dark";

    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
    }

    return <Button className="h-6 w-11 hover:ring-primary hover:ring-1 overflow-hidden relative rounded-full bg-accent dark:bg-secondary dark:hover:bg-secondary/80" onClick={toggleTheme} variant="outline" size="icon">
        <div className={cn("rounded-full absolute bg-background shadow-2xl size-5 top-px left-px grid place-items-center !transition-transform duration-200", isDarkMode ? "translate-x-5" : "translate-x-0.5")}>
            {isDarkMode ? <Moon className="size-3" /> : <Sun className="size-3" />}
        </div>
    </Button>
}
