// src/components/SvgBalloon.js
import React from 'react';
import './SvgBalloon.css'; 

const SvgBalloon = ({ textLines = [] }) => {
    return (
        <div className="balloon-container">
            <svg 
                viewBox="0 0 100 130" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path className="balloon-string" />

                <path 
                    d="M50 25 C 20 25, 5 45, 50 85 C 95 45, 80 25, 50 25 Z" 
                    fill="lightpink" 
                />

                <text className="balloon-text" y="43">
                    {textLines.map((line, index) => (
                        <tspan 
                            key={index} 
                            x="50" 
                            dy={index > 0 ? "1em" : undefined}
                        >
                            {line}
                        </tspan>
                    ))}
                </text>
            </svg>
        </div>
    );
};

export default SvgBalloon;