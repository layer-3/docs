import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import "./tooltip.css";

type Props = { content: React.ReactNode; children: React.ReactNode };

export default function Tooltip({ content, children }: Props) {
  return (
    <BrowserOnly fallback={<span className="TooltipTrigger">{children}</span>}>
      {() => {
        const Tippy = require("@tippyjs/react").default;
        require("tippy.js/dist/tippy.css");
        require("tippy.js/animations/shift-away-subtle.css");

        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        return (
          <Tippy
            content={content}
            theme="docusaurus"
            placement="top"
            delay={[100, 0]}                // unchanged default feel
            duration={prefersReducedMotion ? 0 : 150}
            maxWidth={360}
            interactive
            offset={[0, 8]}
            arrow
            appendTo={() => document.body} // prevents clipping in tables/modals
            trigger="mouseenter focus click" // hover, keyboard, touch
            hideOnClick
            inertia={!prefersReducedMotion}
            animation={prefersReducedMotion ? undefined : "shift-away-subtle"}
            zIndex={9999}
          >
            <span className="TooltipTrigger" tabIndex={0}>
              {children}
            </span>
          </Tippy>
        );
      }}
    </BrowserOnly>
  );
}
