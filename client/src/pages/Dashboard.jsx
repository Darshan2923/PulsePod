import React, { useState } from 'react'
// import { useSelector } from 'react-redux';
import { getMostPopularPodcast, getUsers } from '../api/index';

const Dashboard = ({ setSignInOpen }) => {
    const [mostPopular, setMostPopular] = useState([]);
    const [user, setUser] = useState();
    const [comedy, setComedy] = useState([]);
    const [news, setNews] = useState([]);
    const [sports, setSports] = useState([]);
    const [crime, setCrime] = useState([]);
    const [loading, setLoading] = useState(false);

    // user
    // const {currentUser}=useSelector(state=>state.user);

    const token = localStorage.getItem("pulsepodtoken");
    const getUser = async () => {
        await getUsers(token).then((res) => {
            setUser(res.data)
        }).then((err) => {
            console.log(err);
        });
    }

    const getPopularPodcast = async () => {
        await getMostPopularPodcast()
            .then((res) => {
                setMostPopular(res.data);
                console.log(res.data);
            }).catch((error) => {
                console.log(error)
            });
    }

    const getCommedyPodcasts = async () => {
        getPodcastByCategory("comedy")
            .then((res) => {
                setComedy(res.data)
                console.log(res.data)
            })
            .catch((error) => console.log(error));
    }
    const getNewsPodcasts = async () => {
        getPodcastByCategory("news")
            .then((res) => {
                setNews(res.data)
                console.log(res.data)
            })
            .catch((error) => console.log(error));
    }

    const getSportsPodcasts = async () => {
        getPodcastByCategory("sports")
            .then((res) => {
                setSports(res.data)
                console.log(res.data)
            })
            .catch((error) => console.log(error));
    }

    const getCrimePodcasts = async () => {
        getPodcastByCategory("crime")
            .then((res) => {
                setCrime(res.data)
                console.log(res.data)
            })
            .catch((error) => console.log(error));
    }

    const getallData = async () => {
        setLoading(true);
        if (currentUser) {
            setLoading(true);
            await getUser();
        }
        await getPopularPodcast();
        await getCommedyPodcasts();
        await getNewsPodcasts();
        await getCommedyPodcasts();
        await getCrimePodcasts();
        await getSportsPodcasts();
        setLoading(false);
    }

    useEffect(() => {
        getallData();
    }, [currentUser]);

    return (
        <div className="p-5 pb-50 h-full overflow-y-scroll flex flex-col gap-5 sm:p-1.5 sm:pb-50">
            {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {currentUser && user?.podcasts?.length > 0 && (
                        <div className="bg-gray-100 rounded-xl p-5 sm:p-2.5">
                            <div className="flex justify-between items-center text-2xl font-medium text-black sm:text-lg">
                                Your Uploads
                                <Link to={`/profile`} className="text-blue-500 hover:transition duration-200 ease-in-out">
                                    <span>Show All</span>
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-3 p-4 sm:justify-center">
                                {user?.podcasts.slice(0, 10).map((podcast) => (
                                    <PodcastCard key={podcast.id} podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="bg-gray-100 rounded-xl p-5 sm:p-2.5">
                        <div className="flex justify-between items-center text-2xl font-medium text-black sm:text-lg">
                            Most Popular
                            <Link to={`/showpodcasts/mostpopular`} className="text-blue-500 hover:transition duration-200 ease-in-out">
                                <span>Show All</span>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-3 p-4 sm:justify-center">
                            {mostPopular.slice(0, 10).map((podcast) => (
                                <PodcastCard key={podcast.id} podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-5 sm:p-2.5">
                        <div className="flex justify-between items-center text-2xl font-medium text-black sm:text-lg">
                            Comedy
                            <Link to={`/showpodcasts/comedy`} className="text-blue-500 hover:transition duration-200 ease-in-out">
                                <span>Show All</span>
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-3 p-4 sm:justify-center">
                            {comedy.slice(0, 10).map((podcast) => (
                                <PodcastCard key={podcast.id} podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-5 sm:p-2.5">
                        <Link to={`/showpodcasts/news`} className="text-blue-500 hover:transition duration-200 ease-in-out">
                            <div className="flex justify-between items-center text-2xl font-medium text-black sm:text-lg">
                                News
                                <span>Show All</span>
                            </div>
                        </Link>
                        <div className="flex flex-wrap gap-3 p-4 sm:justify-center">
                            {news.slice(0, 10).map((podcast) => (
                                <PodcastCard key={podcast.id} podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-5 sm:p-2.5">
                        <Link to={`/showpodcasts/crime`} className="text-blue-500 hover:transition duration-200 ease-in-out">
                            <div className="flex justify-between items-center text-2xl font-medium text-black sm:text-lg">
                                Crime
                                <span>Show All</span>
                            </div>
                        </Link>
                        <div className="flex flex-wrap gap-3 p-4 sm:justify-center">
                            {crime.slice(0, 10).map((podcast) => (
                                <PodcastCard key={podcast.id} podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-5 sm:p-2.5">
                        <Link to={`/showpodcasts/sports`} className="text-blue-500 hover:transition duration-200 ease-in-out">
                            <div className="flex justify-between items-center text-2xl font-medium text-black sm:text-lg">
                                Sports
                                <span>Show All</span>
                            </div>
                        </Link>
                        <div className="flex flex-wrap gap-3 p-4 sm:justify-center">
                            {sports.slice(0, 10).map((podcast) => (
                                <PodcastCard key={podcast.id} podcast={podcast} user={user} setSignInOpen={setSignInOpen} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>

    );

}

export default Dashboard