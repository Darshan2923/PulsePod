import React, { useEffect, useState } from 'react'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage'
import app from '../firebase-config/firebase';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../../redux/snackbarSlice';
import { createPodcast } from '../api';
import { Category } from '../utils/Data';

const Upload = ({ setUploadOpen }) => {
    const [podcast, setPodcast] = useState({
        name: "",
        desc: "",
        thumbnail: "",
        tags: [],
        category: "",
        type: "audio",
        episodes: [{
            name: "",
            desc: "",
            type: "audio",
            file: "",
        }],
    });
    const [showEpisode, setShowEpisode] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [backDisabled, setBackDisabled] = useState(false);
    const [createDisabled, setCreateDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const token = localStorage.getItem("podstreamtoken");

    const goToAddEpisodes = () => {
        setShowEpisode(true);
    };

    const goToPodcast = () => {
        setShowEpisode(false);
    };

    useEffect(() => {
        if (podcast === null) {
            setDisabled(true);
            setPodcast({
                name: "",
                desc: "",
                thumbnail: "",
                tags: [],
                episodes: [
                    {
                        name: "",
                        desc: "",
                        type: "audio",
                        file: "",
                    }
                ],
            });
        } else {
            if (podcast.name === "" && podcast.desc === "") {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
        }
    }, [podcast]);

    const uploadFile = (file, index) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                podcast.episodes[index].file.uploadProgress = Math.round(progress);
                setPodcast({ ...podcast, episodes: podcast.episodes });
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const newEpisodes = podcast.episodes;
                    newEpisodes[index].file = downloadURL;
                    setPodcast({ ...podcast, episodes: newEpisodes });
                })
            }
        )
    };

    const createpodcast = async () => {
        console.log(podcast);
        setLoading(true);
        await createPodcast(podcast, token).then((res) => {
            console.log(res);
            setDisabled(true);
            setBackDisabled(true);
            setUploadOpen(false);
            setLoading(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Podcast created successfully",
                    severity: "success",
                })
            )
        }
        ).catch((err) => {
            setDisabled(false);
            setBackDisabled(false);
            setLoading(false);
            console.log(err);
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error creating podcast",
                    severity: "error",
                })
            )
        });
    };

    useEffect(() => {
        if (podcast.episodes.length > 0 && podcast.episodes.every(episode => episode.file !== "" && episode.name !== "" && episode.desc !== "" && podcast.name !== "" && podcast.desc !== "" && podcast.tags !== "" && podcast.image !== "" && podcast.image !== undefined && podcast.image !== null)) {
            if (podcast.episodes.every(episode => episode.file.name === undefined))
                setCreateDisabled(false);
            else
                setCreateDisabled(true);
        }
    }, [podcast]);


    return (
        <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-70 flex items-top justify-center overflow-y-scroll">
            <div className="max-w-500px w-full rounded-lg mx-20 my-50px min-content bg-white text-primary py-10 px-20 flex flex-col relative">
                <div
                    className="absolute top-24px right-30px cursor-pointer"
                    onClick={() => setUploadOpen(false)}
                >
                    <CloseRounded />
                </div>
                <div className="text-22px font-semibold text-primary mb-12px">Upload Podcast</div>
                {!showEpisode ? (
                    <>
                        <div className="text-16px font-semibold text-primary-80 mb-12px">Podcast Details:</div>

                        <ImageSelector podcast={podcast} setPodcast={setPodcast} />
                        <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-12px">
                            <input
                                className="w-full border-none text-14px bg-transparent outline-none text-secondary"
                                placeholder="Podcast Name*"
                                type="text"
                                value={podcast?.name}
                                onChange={(e) => setPodcast({ ...podcast, name: e.target.value })}
                            />
                        </div>
                        <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-6px">
                            <textarea
                                className="w-full border-none text-14px bg-transparent outline-none px-0 py-10px text-secondary"
                                placeholder="Podcast Description* "
                                name="desc"
                                rows={5}
                                value={podcast?.desc}
                                onChange={(e) => setPodcast({ ...podcast, desc: e.target.value })}
                            />
                        </div>
                        <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-6px">
                            <textarea
                                className="w-full border-none text-14px bg-transparent outline-none px-0 py-10px text-secondary"
                                placeholder="Tags separate by ,"
                                name="tags"
                                rows={4}
                                value={podcast?.tags}
                                onChange={(e) => setPodcast({ ...podcast, tags: e.target.value.split(",") })}
                            />
                        </div>
                        <div className="flex gap-6px w-full">
                            <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-6px w-full">
                                <select
                                    className="w-full border-none text-14px bg-transparent outline-none text-secondary"
                                    onChange={(e) => setPodcast({ ...podcast, type: e.target.value })}
                                >
                                    <option value="audio">Audio</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                            <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-6px w-full">
                                <select
                                    className="w-full border-none text-14px bg-transparent outline-none text-secondary"
                                    onChange={(e) => setPodcast({ ...podcast, category: e.target.value })}
                                >
                                    <option value="" disabled hidden>Select Category</option>
                                    {Category.map((category) => (
                                        <option value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div
                            className="min-h-48px rounded-lg border border-none bg-primary text-white font-semibold text-16px flex items-center justify-center mt-22px"
                            onClick={() => { !disabled && goToAddEpisodes(); }}
                        >
                            Next
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-16px font-semibold text-primary-80 mb-12px">Episode Details:</div>
                        {podcast.episodes.map((episode, index) => (
                            <>
                                <label
                                    htmlFor={"fileField" + index}
                                    className="flex min-h-48px rounded-lg border border-secondary items-center justify-center gap-12px cursor-pointer"
                                >
                                    {podcast.episodes[index].file === "" ? (
                                        <div>
                                            <BackupRounded />
                                            Select Audio / Video
                                        </div>
                                    ) : (
                                        <div>
                                            {podcast.episodes[index].file.name === undefined ? (
                                                <div className="flex gap-6px items-center">
                                                    <CloudDoneRounded className="text-green" />
                                                    File Uploaded Successfully
                                                </div>
                                            ) : (
                                                <>
                                                    File: {podcast.episodes[index].file.name}
                                                    <div className="w-full h-3 bg-success rounded-lg">
                                                        <div className="h-full bg-primary" style={{ width: `${podcast.episodes[index].file.uploadProgress}%` }}></div>
                                                    </div>
                                                    {podcast.episodes[index].file.uploadProgress}% Uploaded
                                                </>
                                            )}
                                        </div>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id={"fileField" + index}
                                    className="hidden"
                                    accept="file_extension|audio/*|video/*|media_type"
                                    onChange={(e) => {
                                        podcast.episodes[index].file = e.target.files[0];
                                        setPodcast({ ...podcast, episodes: podcast.episodes });
                                        uploadFile(podcast.episodes[index].file, index);
                                    }}
                                />
                                <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-16px">
                                    <input
                                        className="w-full border-none text-14px bg-transparent outline-none text-secondary"
                                        placeholder="Episode Name*"
                                        type="text"
                                        value={episode.name}
                                        onChange={(e) => {
                                            const newEpisodes = podcast.episodes;
                                            newEpisodes[index].name = e.target.value;
                                            setPodcast({ ...podcast, episodes: newEpisodes });
                                        }}
                                    />
                                </div>
                                <div className="min-h-48px rounded-lg border border-secondary flex items-center gap-14px mt-6px">
                                    <textarea
                                        className="w-full border-none text-14px bg-transparent outline-none px-0 py-10px text-secondary"
                                        placeholder="Episode Description* "
                                        name="desc"
                                        rows={5}
                                        value={episode.desc}
                                        onChange={(e) => {
                                            const newEpisodes = podcast.episodes;
                                            newEpisodes[index].desc = e.target.value;
                                            setPodcast({ ...podcast, episodes: newEpisodes });
                                        }}
                                    />
                                </div>
                                <div
                                    className="min-h-48px rounded-lg border border-none bg-red-500 text-white font-semibold text-16px flex items-center justify-center mt-6px"
                                    onClick={() => setPodcast({ ...podcast, episodes: podcast.episodes.filter((_, i) => i !== index) })}
                                >
                                    Delete
                                </div>
                            </>
                        ))}
                        <div
                            className="min-h-48px rounded-lg border border-none bg-primary text-white font-semibold text-16px flex                     items-center justify-center mt-4px"
                            onClick={() => setPodcast({ ...podcast, episodes: [...podcast.episodes, { name: "", desc: "", file: "" }] })}
                        >
                            Add Episode
                        </div>

                        <div className="flex gap-12px items-center mt-6px">
                            <div
                                className="min-h-48px rounded-lg border border-none bg-primary text-white font-semibold text-16px flex items-center justify-center w-full"
                                onClick={() => { !backDisabled && goToPodcast(); }}
                            >
                                Back
                            </div>
                            <div
                                className="min-h-48px rounded-lg border border-none bg-primary text-white font-semibold text-16px flex items-center justify-center w-full"
                                onClick={() => { !disabled && createpodcast(); }}
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                ) : (
                                    "Create"
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

    )
}

export default Upload