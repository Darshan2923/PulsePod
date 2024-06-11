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
        <div>Upload</div>
    )
}

export default Upload