
import React from 'react';

const PolygonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="m12 2 7 7-4 11H9l-4-11Z" />
    </svg>
);

export default PolygonIcon;
