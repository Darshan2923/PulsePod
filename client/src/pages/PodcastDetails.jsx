import React, { useEffect, useState } from 'react'
import { favoritePodcast, getPodcastById, getUsers } from '../api/index'
import { useParams } from 'react-router-dom'
import EpisodeCard from '../components/EpisodeCard';
import { format } from 'timeago.js';
import { ToastContainer, toast } from 'react-toastify';



const PodcastDetails = () => {

    const { id } = useParams();
    const [favourite, setFavourite] = useState(false);
    const [podcast, setPodcast] = useState();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState();

    const token = localStorage.getItem("pulsepod-token");
    //user
    // const { currentUser } = useSelector(state => state.user);


    const favouritepodcast = async () => {
        setLoading(true);
        if (podcast !== undefined && podcast !== null) {
            await favoritePodcast(podcast?._id, token).then((res) => {
                if (res.status === 200) {
                    setFavourite(!favourite)
                    setLoading(false)
                }
            }).catch((error) => {
                console.log(error);
                setLoading(false);
                toast.error("An error occured");
            })
        }
    }

    const getUser = async () => {
        setLoading(true);
        await getUsers(token).then((res) => {
            setUser(res.data)
            setLoading(false);
        }).then((err) => {
            console.log(false)
            toast.error("An error occured");
        })
    }

    const getPodcast = async () => {
        setLoading(true);
        await getPodcastById(id).then((res) => {
            if (res.status === 200) {
                setPodcast(res.data)
                setLoading(false)
            }
        }).catch((err) => {
            console.log(err)
            setLoading(false)
            toast.error("An error occured");
        })
    }

    useState(() => {
        getPodcast();
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            getUser();
        }
        if (user?.favorits?.find((fav) => fav._id === podcast?._id)) {
            setFavourite(true)
        }
    }, [currentUser, podcast])

    return (
        <>
            <ToastContainer />
            <div className="p-5 pb-48 h-full overflow-y-scroll flex flex-col gap-5">
                {loading ? (
                    <div className="flex justify-center items-center h-full w-full">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end w-full">
                            <IconButton onClick={() => favoritpodcast()} className="bg-secondary text-primary rounded-full flex items-center">
                                <FavoriteIcon style={{ color: favourite ? '#E30022' : 'currentColor', width: '16px', height: '16px' }} />
                            </IconButton>
                        </div>
                        <div className="flex flex-row gap-5 flex-wrap md:flex-col">
                            <img src={podcast?.thumbnail} alt="Thumbnail" className="w-64 h-64 rounded-lg bg-secondary object-cover" />
                            <div className="flex flex-col gap-2.5 w-full">
                                <div className="text-4xl font-extrabold text-primary flex justify-between">
                                    {podcast?.name}
                                </div>
                                <div className="text-sm font-medium text-secondary">
                                    {podcast?.desc}
                                </div>
                                <div className="flex flex-row gap-2.5 flex-wrap">
                                    {podcast?.tags.map((tag, index) => (
                                        <div key={index} className="bg-secondary-50 text-primary px-3 py-1 rounded-full text-xs">
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-row items-center">
                                    <div className="flex items-center gap-2">
                                        <Avatar src={podcast?.creator?.img} sx={{ width: 26, height: 26 }}>
                                            {podcast?.creator?.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div className="text-xs text-secondary">
                                            {podcast?.creator?.name}
                                        </div>
                                    </div>
                                    <div className="text-xs text-secondary ml-5">
                                        • {podcast?.views} Views
                                    </div>
                                    <div className="text-xs text-secondary ml-5">
                                        • {format(new Date(podcast?.createdAt), 'MMMM d, yyyy')}
                                    </div>
                                    <div className="bg-purple-600 text-white text-xs rounded-full flex items-center justify-center p-1.5 ml-5">
                                        {podcast?.type === 'audio' ? <HeadphonesIcon /> : <PlayArrowIcon />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="text-2xl font-medium text-primary flex justify-between items-center">
                                All Episodes
                            </div>
                            <div className="flex flex-col gap-5">
                                {podcast?.episodes.map((episode, index) => (
                                    <Episodecard key={index} episode={episode} podid={podcast} type={podcast.type} user={user} index={index} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default PodcastDetails