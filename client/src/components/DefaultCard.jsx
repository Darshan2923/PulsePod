import React from 'react';

export const DefaultCard = ({ category }) => {
    return (
        <div className="w-64 h-64 rounded-lg p-4 hover:cursor-pointer hover:-translate-y-8 transition-transform duration-400 ease-in-out hover:shadow-lg hover:brightness-110 bg-gray-800 relative">
            <div className="text-white text-lg font-semibold">
                {category.name}
            </div>
            <div className="absolute inset-0 flex justify-end items-end">
                <img
                    className="h-32 w-32 object-cover clip-path-[0 0 100% 0 100% 66% 0 98%] transform rotate-20"
                    src={category.img}
                    alt="podcast-image"
                />
            </div>
        </div>
    );
};
