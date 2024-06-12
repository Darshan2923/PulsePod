import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaVolumeUp, FaStepBackward, FaStepForward } from 'react-icons/fa';

const AudioPlayer = ({ episode, podid, currenttime, index }) => {
    const [progressWidth, setProgressWidth] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const dispatch = useDispatch();

    const handleTimeUpdate = () => {
        const duration = audioRef.current.duration;
        const currentTime = audioRef.current.currentTime;
        const progress = (currentTime / duration) * 100;
        setProgressWidth(progress);
        setDuration(duration);
        dispatch(
            setCurrentTime({
                currenttime: currentTime
            })
        )
    }

    const handleVolumeChange = (event) => {
        const volume = event.target.value;
        setVolume(volume);
        audioRef.current.volume = volume;
    };

    const goToNextPodcast = () => {
        // from podid and index,get the next podcast
        // dispatch the next podcast
        if (podid.episodes.length === index + 1) {
            dispatch(
                openSnackbar({
                    message: "This is the last episode",
                    severity: "info",
                })
            )
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    type: "audio",
                    podid: podid,
                    index: index + 1,
                    currenttime: 0,
                    episode: podid.episodes[index + 1]
                })
            )
        }, 10);
    }

    const goToPreviousPodcast = () => {
        //from the podid and index, get the next podcast
        //dispatch the next podcast
        if (index === 0) {
            dispatch(
                openSnackbar({
                    message: "This is the first episode",
                    severity: "info",
                })
            )
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    type: "audio",
                    podid: podid,
                    index: index - 1,
                    currenttime: 0,
                    episode: podid.episodes[index - 1]
                })
            )
        }, 10);
    }

    return (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center justify-between px-4 py-2 transition-all duration-500 z-50 md:h-14 md:gap-1 md:px-1">
            <div className="flex items-center gap-5 ml-5 flex-[0.2] md:gap-2 md:ml-2">
                <img src={podid?.thumbnail} alt="Podcast Thumbnail" className="w-15 h-15 rounded-md object-cover md:w-8 md:h-8" />
                <div className="flex flex-col">
                    <span className="text-base font-medium overflow-hidden overflow-ellipsis whitespace-nowrap md:text-sm">{episode?.name}</span>
                    <span className="text-sm mt-1 md:text-xs">{episode?.creator.name}</span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 flex-[0.6] w-full max-w-xl md:flex-[0.8]">
                <div className="flex items-center gap-7 w-full md:gap-2">
                    <button onClick={() => goToPreviousPodcast()} className="bg-gray-700 text-white p-2 rounded-full text-4xl md:text-xl md:p-1">
                        <FaStepBackward />
                    </button>
                    <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => goToNextPodcast()}
                        autoPlay
                        controls
                        onPlay={() => { audioRef.current.currentTime = currenttime }}
                        src={episode?.file}
                        className="w-full h-11 text-xs md:h-10 md:text-xs"
                    />
                    <button onClick={() => goToNextPodcast()} className="bg-gray-700 text-white p-2 rounded-full text-4xl md:text-xl md:p-1">
                        <FaStepForward />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 w-[50%] max-w-xs justify-between mr-5 flex-[0.2] md:hidden md:mr-2">
                <FaVolumeUp />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 rounded-full bg-gray-500 appearance-none outline-none"
                />
            </div>
        </div>
    );
}

export default AudioPlayer