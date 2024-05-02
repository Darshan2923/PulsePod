import React from 'react';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const TopResult = ({ podcast }) => {
    return (
        <Link
            to={`/podcast/${podcast?._id}`}
            className="w-80 md:w-72 p-4 flex flex-col items-start gap-4 rounded-lg bg-gray-100 shadow-md hover:shadow-lg hover:brightness-110 transition duration-300 ease-in-out"
        >
            <img
                src={podcast?.thumbnail}
                alt="podcast-thumbnail"
                className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <div className="text-xl font-semibold text-gray-800">{podcast?.name}</div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{podcast.views} Views</span>
                <span>• {format(podcast?.createdAt)}</span>
                <span>{podcast?.creator.name}</span>
            </div>
            <div className="text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-pre-line">
                {podcast?.desc}
            </div>
        </Link>
    );
};

export default TopResult;
