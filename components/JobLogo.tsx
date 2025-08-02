import React from "react";

function JobLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      {/* Briefcase */}
      <rect
        x="4"
        y="11"
        width="24"
        height="16"
        rx="3"
        fill="currentColor"
        className="opacity-90"
      />
      <rect
        x="6"
        y="13"
        width="20"
        height="2"
        fill="currentColor"
        className="opacity-60"
      />
      <rect
        x="12"
        y="6"
        width="8"
        height="6"
        rx="1"
        fill="currentColor"
        className="opacity-80"
      />

      {/* Search magnifying glass */}
      <circle
        cx="20"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="opacity-100"
      />
      <path
        d="22 10l2 2"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-100"
      />

      {/* Accent dots */}
      <circle
        cx="10"
        cy="19"
        r="1"
        fill="currentColor"
        className="opacity-70"
      />
      <circle
        cx="14"
        cy="19"
        r="1"
        fill="currentColor"
        className="opacity-70"
      />
      <circle
        cx="18"
        cy="19"
        r="1"
        fill="currentColor"
        className="opacity-70"
      />
    </svg>
  );
}

export default JobLogo;
