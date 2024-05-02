import React, { useState } from 'react';
import { Category } from '../assets/utils/Data';
import { searchPodcast } from '../api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'toastify';
import { FaSearch } from 'react-icons/fa';
import { LuArrowUpRightFromCircle } from "react-icons/lu";


const Search = () => {

    const [searched, setSearched] = useState("");
    const [searchPodcasts, setSearchPodcasts] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleChange = async (e) => {
        setSearchPodcasts([]);
        setLoading(true);
        setSearched(e.target.value);
        try {
            const data = await searchPodcast(e.target.value);
            setSearchPodcasts(data);
            console.log(data);
        } catch (error) {
            toast.error("Unable to search the results");
        }
        setLoading(false);
    }

    return (
        <div>
            <ToastContainer />
            <div className="p-6 pb-64 h-full overflow-y-scroll overflow-x-hidden flex flex-col gap-6">
                <div className="flex justify-center w-full">
                    <div className="max-w-700px flex w-full border border-text-secondary rounded-full cursor-pointer p-3 items-center gap-3">
                        <FaSearch className="text-inherit" />
                        <input
                            type="text"
                            placeholder="Search Artist/Podcast"
                            className="w-full bg-transparent outline-none"
                            value={searched}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>
                {searched === "" ? (
                    <div className="mt-6">
                        <div className="text-text-primary text-2xl font-semibold">Browse All</div>
                        <div className="flex flex-wrap gap-6 p-4">
                            {Category.map((category) => (
                                <Link key={category.name} to={`/showpodcasts/${category.name.toLowerCase()}`} className="text-decoration-none">
                                    <DefaultCard category={category} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <LuArrowUpRightFromCircle className="text-primary animate-spin" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {searchPodcasts.length === 0 ? (
                                    <div className="flex justify-center items-center h-full text-text-primary">
                                        No Podcasts Found
                                    </div>
                                ) : (
                                    <>
                                        <TopResult podcast={searchPodcasts[0]} />
                                        <div className="flex flex-col gap-6">
                                            {searchPodcasts.map((podcast, index) => (
                                                <MoreResult key={index} podcast={podcast} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search