
import React from 'react';

const IdCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <circle cx="8" cy="10" r="2" />
        <path d="M14 10h4" />
        <path d="M14 14h4" />
        <path d="M6 14h2" />
    </svg>
);

export default IdCardIcon;
