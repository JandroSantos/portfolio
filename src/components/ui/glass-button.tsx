import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Liquid-glass displacement map served as a static asset (kept out of the JS
// bundle to slim the chunk; the browser caches it independently).
const WEBP_DISPLACEMENT_MAP = "/liquid-glass.webp";

const glassButtonVariants = cva(
  "relative isolate inline-flex items-center justify-center gap-2 rounded-full cursor-pointer transition-transform duration-300 ease-out tracking-tight disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  {
    variants: {
      size: {
        default: "px-6 py-3.5 text-base font-medium",
        sm: "px-4 py-2 text-sm font-medium",
        lg: "px-8 py-4 text-lg font-medium",
        icon: "h-10 w-10 p-0 gap-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
  glassColor?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, glassColor, ...props }, ref) => {
    const filterId = React.useId().replace(/:/g, "");

    return (
      <>
        <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <filter id={`liquid-glass-${filterId}`} primitiveUnits="objectBoundingBox">
            <feImage
              result="map"
              width="100%"
              height="100%"
              x="0"
              y="0"
              href={WEBP_DISPLACEMENT_MAP}
              preserveAspectRatio="none"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur" />
            <feDisplacementMap
              in="blur"
              in2="map"
              scale="0.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        <style>{`
          .btn-liquid {
            appearance: none;
            border: none;
            background: transparent;
            color: rgba(255,255,255,0.95);
          }
          .btn-liquid-lens {
            background-color: ${glassColor || "rgba(255,255,255,0.07)"};
            backdrop-filter: blur(8px) url(#liquid-glass-${filterId}) saturate(150%);
            -webkit-backdrop-filter: blur(8px) saturate(150%);
            box-shadow:
              inset 0 0 0 1px rgba(255,255,255,0.10),
              inset 1.8px 3px 0px -2px rgba(255,255,255,0.90),
              inset -2px -2px 0px -2px rgba(255,255,255,0.80),
              inset -3px -8px 1px -6px rgba(255,255,255,0.60),
              inset -0.3px -1px 4px 0px rgba(0,0,0,0.12),
              inset -1.5px 2.5px 0px -2px rgba(0,0,0,0.20),
              inset 0px 3px 4px -2px rgba(0,0,0,0.20),
              inset 2px -6.5px 1px -4px rgba(0,0,0,0.10),
              0px 1px 5px 0px rgba(0,0,0,0.10),
              0px 6px 16px 0px rgba(0,0,0,0.08);
            transition: background-color 400ms cubic-bezier(1,0,0.4,1), box-shadow 400ms cubic-bezier(1,0,0.4,1);
          }
          .btn-liquid-text {
            text-shadow: 0 1px 2px rgba(0,0,0,0.30);
            transition: color 400ms cubic-bezier(1,0,0.4,1);
          }
          @media (hover: hover) {
            .btn-liquid:not(:disabled):hover { transform: scale(1.03); }
          }
          .btn-liquid:not(:disabled):active { transform: scale(0.96); }
        `}</style>

        <button
          className={cn(glassButtonVariants({ size }), "btn-liquid", className)}
          ref={ref}
          {...props}
        >
          <span className="btn-liquid-lens absolute inset-0 -z-10 rounded-[inherit] pointer-events-none" />
          <span className={cn("btn-liquid-text relative z-10 w-full flex items-center justify-center gap-[inherit] select-none", contentClassName)}>
            {children}
          </span>
        </button>
      </>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
