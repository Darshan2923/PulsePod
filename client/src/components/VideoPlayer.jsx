import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { MdClose, MdPlayArrow, MdPause, MdVolumeUp } from 'react-icons/md';
import { closePlayer, openPlayer, setCurrentTime } from '../redux/audioplayerSlice';
import { openSnackbar } from '../redux/snackbarSlice';

const VideoPlayer = ({ episode, podid, currenttime, index }) => {
    const dispatch = useDispatch();
    const videoref = useRef(null);

    const handleTimeUpdate = () => {
        const currentTime = videoref.current.currentTime;
        dispatch(
            setCurrentTime({
                currenttime: currentTime
            })
        );
    };

    const goToNextPodcast = () => {
        if (podid.episodes.length === index + 1) {
            dispatch(
                openSnackbar({
                    message: "This is the last episode",
                    severity: "info",
                })
            );
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    type: "video",
                    podid: podid,
                    index: index + 1,
                    currenttime: 0,
                    episode: podid.episodes[index + 1]
                })
            );
        }, 10);
    };

    const goToPreviousPodcast = () => {
        if (index === 0) {
            dispatch(
                openSnackbar({
                    message: "This is the first episode",
                    severity: "info",
                })
            );
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    type: "video",
                    podid: podid,
                    index: index - 1,
                    currenttime: 0,
                    episode: podid.episodes[index - 1]
                })
            );
        }, 10);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center overflow-y-auto transition-all duration-500 z-50">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg m-4 p-4 relative">
                <MdClose
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    size={24}
                    onClick={() => dispatch(closePlayer())}
                />
                <video
                    ref={videoref}
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={goToNextPodcast}
                    autoPlay
                    onPlay={() => { videoref.current.currentTime = currenttime }}
                    className="w-full max-h-[500px] rounded-lg mt-4"
                >
                    <source src={episode.file} type="video/mp4" />
                    <source src={episode.file} type="video/webm" />
                    <source src={episode.file} type="video/ogg" />
                    Your browser does not support the video tag.
                </video>
                <div className="mt-4 px-4">
                    <h2 className="text-2xl font-semibold text-gray-800">{episode.name}</h2>
                    <p className="text-gray-600 mt-2">{episode.desc}</p>
                </div>
                <div className="flex justify-between mt-4 px-4">
                    <button
                        onClick={goToPreviousPodcast}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Previous
                    </button>
                    <button
                        onClick={goToNextPodcast}
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
