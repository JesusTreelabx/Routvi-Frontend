import * as React from "react"
import { cn } from "@/lib/utils"


// Since I don't have cva and radix installed yet, creating a simple button for now
// Actually, I should install clsx and tailwind-merge if I want cn working properly, but I have a simpler cn in utils.ts without dependencies for now.
// Wait, I should stick to simple components first without complex dependencies to keep it lightweight as requested.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm",
            secondary: "bg-primary-100 text-primary-900 hover:bg-primary-200",
            outline: "border border-primary-200 bg-transparent hover:bg-primary-50 text-primary-700",
            ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2 text-sm",
            lg: "h-12 px-8 text-base",
            icon: "h-10 w-10",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    fullWidth ? "w-full" : "",
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
