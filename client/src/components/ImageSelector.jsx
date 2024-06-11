import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi'; // Import the desired icon from react-icons library

const ImageSelector = ({ podcast, setPodcast }) => {
    const [base64Image, setBase64Image] = useState("");

    const handleOnCompleted = (files) => {
        setPodcast((prev) => {
            return { ...prev, thumbnail: files[0].base64_file };
        });
    };

    const CustomisedButton = ({ triggerInput }) => {
        return (
            <button
                className="text-primary font-semibold cursor-pointer"
                onClick={triggerInput}
            >
                Browse Image
            </button>
        );
    };

    return (
        <div className="h-120 flex flex-col justify-center items-center gap-6 border-2 border-dashed border-opacity-80 border-primary rounded-lg text-primary">
            {podcast.thumbnail ? (
                <img
                    src={podcast.thumbnail}
                    alt="Thumbnail"
                    className="h-120 w-full object-cover rounded-lg"
                />
            ) : (
                <>
                    <FiUpload className="text-4xl" />
                    <div className="font-semibold text-sm">Click here to upload thumbnail</div>
                    <div className="flex gap-6 items-center">
                        <div className="font-semibold text-sm">or</div>
                        <ReactImageFileToBase64
                            onCompleted={handleOnCompleted}
                            CustomisedButton={CustomisedButton}
                            multiple={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageSelector;
