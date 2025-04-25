import React from 'react';

function AppLogoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            {/* K */}
            <path
                d="M10 5L10 35M10 20L25 5M10 20L25 35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* K */}
            <path
                d="M35 5L35 35M35 20L50 5M35 20L50 35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* K */}
            <path
                d="M60 5L60 35M60 20L75 5M60 20L75 35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* X */}
            <path d="M85 5L110 35M110 5L85 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}

export default AppLogoIcon;
