import React, { useState } from 'react';

const CompanyLogo = ({ name, size = "md", className = "" }) => {
    const [error, setError] = useState(false);

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-lg",
        lg: "w-16 h-16 text-2xl",
        xl: "w-20 h-20 text-3xl"
    };

    if (!name) return <div className={`${sizeClasses[size]} ${className} bg-gray-100 rounded-lg`} />;

    // Improved domain guessing
    const cleanName = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const domain = `${cleanName}.com`;

    // Using Google Favicons API - highly reliable for almost all domains
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    if (error) {
        return (
            <div className={`${sizeClasses[size]} ${className} flex-shrink-0 bg-gradient-to-br from-amrita-maroon to-amrita-burgundy text-white flex items-center justify-center font-black uppercase shadow-sm`}>
                {name[0]}
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} ${className} flex-shrink-0 bg-white p-[2px] flex items-center justify-center overflow-hidden shadow-sm border border-gray-100`}>
            <img
                src={logoUrl}
                alt={`${name} logo`}
                onError={(e) => {
                    // Start of fallback chain logic if needed, but simplified to just show initial on error
                    setError(true);
                }}
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default CompanyLogo;
