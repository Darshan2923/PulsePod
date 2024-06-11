import React from 'react';

export const SearchCard = () => {
    return (
        <div className="h-64 w-64 bg-green-800 p-4 rounded-lg">
            <img
                src="https://imgs.search.brave.com/ehz2Uo5e7s5vqThA4x8MHLLd-td3CpvouiLDGFQnVJg/rs:fit:500:500:1/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTAwMDE5/NzA4ODg4My11emcz/YWEtdDUwMHg1MDAu/anBn"
                alt="eminem picture"
                className="w-24 h-24 rounded-full mx-auto"
            />
            <div className="text-primary mt-4 font-semibold text-xl text-center">
                Eminem
            </div>
            <div className="text-secondary mt-4 text-center">
                Hello I am Eminem
            </div>
        </div>
    )
}
