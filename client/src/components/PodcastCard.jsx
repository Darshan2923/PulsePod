import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { favoritePodcast } from '../api';
// import { openSignin } from '../redux/setSigninSlice';
// import { ReactComponent as FavoriteIcon } from '../icons/FavoriteIcon.svg'; // Assuming you have an SVG file for the FavoriteIcon
// import { ReactComponent as HeadphonesIcon } from '../icons/HeadphonesIcon.svg'; // Assuming you have an SVG file for the HeadphonesIcon
// import { ReactComponent as PlayArrowIcon } from '../icons/PlayArrowIcon.svg'; // Assuming you have an SVG file for the PlayArrowIcon

export const PodcastCard = ({ podcast, user, setSignInOpen }) => {
    const [favourite, setFavourite] = useState(false);
    const dispatch = useDispatch();
    const token = localStorage.getItem("podstreamtoken");

    const favoritpodcast = async () => {
        await favoritePodcast(podcast._id, token)
            .then((res) => {
                if (res.status === 200) {
                    setFavourite(!favourite);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (user?.favorits?.find((fav) => fav._id === podcast._id)) {
            setFavourite(true);
        }
    }, [user]);

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Link to={`/podcast/${podcast._id}`} className="relative text-decoration-none bg-white dark:bg-gray-800 max-w-xs h-72 flex flex-col justify-start items-center p-4 rounded-md shadow-md hover:cursor-pointer transform hover:translate-y-[-2px] transition-all duration-400 ease-in-out hover:shadow-lg hover:brightness-110">
            <div className="relative w-full h-full flex flex-col items-center">
                <div className="absolute top-2 right-2">
                    <button onClick={(e) => {
                        e.preventDefault();
                        if (!currentUser) {
                            //   dispatch(openSignin());
                        } else {
                            favoritpodcast();
                        }
                    }} className={`bg-gray-500 bg-opacity-75 text-white p-1 rounded-full shadow-lg`}>
                        {favourite ? (
                            <FavoriteIcon className="text-red-600 w-4 h-4" />
                        ) : (
                            <FavoriteIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <img src={podcast.thumbnail} className="object-cover w-full h-36 rounded-md shadow-lg mb-2" />
                <div className="flex flex-col w-full">
                    <div className="text-xl text-black dark:text-white font-medium mb-1 line-clamp-2">{podcast.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{podcast.desc}</div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <img src={podcast.creator.img} alt={podcast.creator.name} className="w-6 h-6 rounded-full" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">{podcast.creator.name}</div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">• {podcast.views} Views</div>
                    </div>
                </div>
                <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full shadow-lg hidden group-hover:flex transition-all duration-400 ease-in-out">
                    {podcast?.type === 'video' ? (
                        <PlayArrowIcon className="w-7 h-7" />
                    ) : (
                        <HeadphonesIcon className="w-7 h-7" />
                    )}
                </div>
            </div>
        </Link>
    );
}
