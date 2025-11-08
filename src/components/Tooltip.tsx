import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

type Props = { content: React.ReactNode; children: React.ReactNode };

export default function Tooltip({ content, children }: Props) {
  return (
    <BrowserOnly fallback={<span>{children}</span>}>
      {() => {
        const Tippy = require("@tippyjs/react").default;
        require("tippy.js/dist/tippy.css");
        return (
          <Tippy content={content} delay={[100, 0]} maxWidth={350} interactive>
            <span
              style={{
                borderBottom: "1px dotted var(--ifm-color-emphasis-300)",
                cursor: "help",
              }}>
              {children}
            </span>
          </Tippy>
        );
      }}
    </BrowserOnly>
  );
}
