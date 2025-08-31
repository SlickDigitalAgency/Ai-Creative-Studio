
import React from 'react';

const LassoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M11.12 6.12a2.5 2.5 0 1 0-3.24 3.24" />
        <path d="M12 10c-3.5 0-6.2-2 -8-5" />
        <path d="M12.75 4.75a2.5 2.5 0 1 1-3.5-3.5" />
        <path d="M14 12c0 3.5-2 6.2-5 8" />
        <path d="M19.25 12.75a2.5 2.5 0 1 1-3.5-3.5" />
        <path d="M21 12c-1.8 2.8-4.5 5-8 5" />
    </svg>
);

export default LassoIcon;
