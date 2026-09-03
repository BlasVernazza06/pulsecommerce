import * as React from "react";
import { cn } from "../../lib/utils";

export type ChartThemeName = "default" | "cyberpunk" | "emerald" | "sunset" | "custom";

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: ChartThemeName;
  customColors?: {
    chart1?: string;
    chart2?: string;
    chart3?: string;
    chart4?: string;
    chart5?: string;
  };
}

/**
 * ChartContainer wraps any chart component (e.g. Recharts, Visx)
 * and dynamically injects customizable CSS color variables.
 */
export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, theme = "default", customColors, style, children, ...props }, ref) => {
    const customStyles: React.CSSProperties = {
      ...(customColors?.chart1 ? { "--chart-1": customColors.chart1 } : {}),
      ...(customColors?.chart2 ? { "--chart-2": customColors.chart2 } : {}),
      ...(customColors?.chart3 ? { "--chart-3": customColors.chart3 } : {}),
      ...(customColors?.chart4 ? { "--chart-4": customColors.chart4 } : {}),
      ...(customColors?.chart5 ? { "--chart-5": customColors.chart5 } : {}),
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        data-chart-theme={theme !== "default" ? theme : undefined}
        style={customStyles}
        className={cn("w-full h-full font-sans transition-all duration-300", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";
