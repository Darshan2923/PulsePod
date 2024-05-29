import { toast } from "react-toastify";
import { addView } from "../api/index";
import React from 'react'

const EpisodeCard = ({ episode, podid, user, type, index }) => {

    const addviewToPodcast = async () => {
        await addviewToPodcast(podid._id).catch((err) => {
            toast.error("An error occured");
        })
    }

    return (
        <>
            <div onClick={async () => {
                await addviewToPodcast();
                if (type === "audio") {
                    // open audio player
                    // dispatch(
                    //     openPlayer({
                    //         type: "audio",
                    //         episode: episode,
                    //         podid: podid,
                    //         index: index,
                    //         currenttime: 0
                    //     })
                    // )
                } else {
                    //open video player
                    // dispatch(
                    //     dispatch(
                    //         openPlayer({
                    //             type: "video",
                    //             episode: episode,
                    //             podid: podid,
                    //             index: index,
                    //             currenttime: 0
                    //         })
                    //     )
                    // )
                }
            }}>
                <div className="flex flex-row gap-5 items-center p-5 rounded-lg bg-card cursor-pointer hover:transform hover:translate-y-[-8px] hover:transition-all hover:duration-400 hover:ease-in-out hover:shadow-lg hover:brightness-125">
                    <div className="relative w-24 h-24">
                        <img src={podid?.thumbnail} alt="Thumbnail" className="w-full h-full rounded-lg bg-secondary object-cover" />
                        <PlayCircleOutlineIcon style={{ position: 'absolute', top: '26px', left: '26px', color: 'white', width: '50px', height: '50px' }} />
                    </div>
                    <div className="flex flex-col gap-2.5 w-full">
                        <div className="text-lg font-extrabold text-primary flex justify-between">{episode.name}</div>
                        <div className="text-sm font-medium text-secondary">{episode.desc}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EpisodeCard