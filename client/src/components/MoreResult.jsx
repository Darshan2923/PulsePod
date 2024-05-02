import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';

const MoreResult = ({ podcast }) => {
    return (
        <Link
            to={`/podcast/${podcast?._id}`}
            className="bg-gray-100 flex items-center p-2 rounded-lg gap-4 hover:cursor-pointer hover:-translate-y-2 hover:shadow-lg hover:brightness-110 transition duration-300 ease-in-out"
        >
            <img
                src={podcast?.thumbnail}
                alt="podcast-thumbnail"
                className="h-20 w-36 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-1">
                <div className="text-primary">{podcast?.name}</div>
                <div className="flex gap-4 text-sm text-secondary">
                    <div className="">{podcast?.creator.name}</div>
                    <div>• {podcast?.views} Views</div>
                    <div>• {format(podcast?.createdAt)}</div>
                </div>
            </div>
        </Link>
    );
};

export default MoreResult;
