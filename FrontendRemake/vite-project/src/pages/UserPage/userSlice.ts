import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { defaultAlbumImageBase64 } from "../../assets/imageBase64";
import getDeviceFingerprint from "../../utilities/getDeviceFingerprint";
import encodeToBase64ForUrl from "../../utilities/base64EncodeForUrl";

const APIurl = import.meta.env.VITE_APIServerUrl;

export interface Song {
    id: number;
    uploadDate: string;
    fileName: string;
    name: string;
    artist: string;
    album: string;
    albumImageBase64: string;
    releaseDate: string;
    duration: number;
    size: number;
    favorite: boolean;
}

interface Filter {
    searchValue: string;
    searchBy: string;
    sortBy: string;
    sortDirection: string;
}

interface PlaylistState {
    id: number;
    songs: Song[];
    requireRefetch: boolean;
}

export interface PlaylistComponent {
    id: number;
    name: string;
    createDate: string;
    sumOfSongs: number;
}

export interface PlaylistSongs {
    id: number;
    songs: Song[];
}

export interface UserState {
    profileState: {
        createDate: string;
        numberOfSongs: number | null;
        numberOfPlaylist: number | null;
        availableMemory: number | null;
        fetchProfileStatus: "idle" | "pending" | "success" | "failed";
        fetchUploadUserAvatarStatus: "idle" | "pending" | "success" | "failed";
        fetchUploadUserBackgroundImgStatus:
            | "idle"
            | "pending"
            | "success"
            | "failed";
        fetchDeleteAccountStatus: "idle" | "pending" | "success" | "failed";
    };

    navBarState: {
        userAvatarImage: string; //Share with profile
        username: string; //Share with profile
        fetchPlaylistStatus: "idle" | "pending" | "success" | "failed";
        playlist: PlaylistComponent[];
    };

    homePageState: {
        userBackgroundImage: string; //Share with profile
    };

    musicPageState: {
        totalSongs: number | null;
        totalPage: number | null;
        songs: Song[];
        filter: Filter;
        currentPage: number;
        fetchCurrentPageStatus: "idle" | "pending" | "success" | "failed";
    };

    favoritePageState: {
        totalSongs: number | null;
        totalPage: number | null;
        songs: Song[];
        filter: Filter;
        currentPage: number;
        fetchCurrentPageStatus: "idle" | "pending" | "success" | "failed";
    };

    playListState: PlaylistState[];

    playerState: {
        currentSong: Song;
        songsInTrackList: Song[];
        trackListIndex: number;
    };

    //Playlist state dùng chung với navbar state
}

export const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(`${APIurl}/api/v1/users`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                    Fingerprint: getDeviceFingerprint(),
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchUserAvatarImage = createAsyncThunk(
    "user/fetchUserAvatarImage",
    async (_, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(`${APIurl}/api/v1/users/avatar`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                    Fingerprint: getDeviceFingerprint(),
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchUserPlaylist = createAsyncThunk(
    "user/fetchUserPlaylist",
    async (_, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(`${APIurl}/api/v1/users/lists`, {
                headers: {
                    Authorization: `Bearer ${tokenData.token}`,
                    Fingerprint: getDeviceFingerprint(),
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchUserBackgroundImage = createAsyncThunk(
    "user/fetchUserBackgroundImage",
    async (_, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(
                `${APIurl}/api/v1/users/background`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const uploadUserSongs = createAsyncThunk(
    "user/uploadSongs",
    async (fd: FormData, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.post(
                `${APIurl}/api/v1/users/songs/upload/multi`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const uploadAvatarImage = createAsyncThunk(
    "user/uploadUserAvatar",
    async (fd: FormData, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.post(
                `${APIurl}/api/v1/users/avatar/upload`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const uploadBackgroundImage = createAsyncThunk(
    "user/uploadUserBackgroundImage",
    async (fd: FormData, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.post(
                `${APIurl}/api/v1/users/background/upload`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchDeleteAccout = createAsyncThunk(
    "user/fetchDeleteAccount",
    async (password: string, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.post(
                `${APIurl}/api/v1/users/delete`,
                {
                    password: `${password}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchUserPlaylistSongs = createAsyncThunk(
    "user/fetchUserPlaylistSongs",
    async (playlistId: number, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(
                `${APIurl}/api/v1/users/lists/${playlistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

interface FetchRenameUserPlaylistParams {
    playlistId: number;
    newPlaylistName: string;
}
export const fetchRenameUserPlaylist = createAsyncThunk(
    "user/fetchRenameUserPlaylist",
    async (
        { playlistId, newPlaylistName }: FetchRenameUserPlaylistParams,
        { rejectWithValue }
    ) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.patch(
                `${APIurl}/api/v1/users/lists/${playlistId}`,
                {
                    name: newPlaylistName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

interface params {
    currentPage: number;
    sortBy: string;
    sortDirection: string;
}

export const fetchUserSongsByPage = createAsyncThunk(
    "user/fetchUserSongs",
    async (params: params, { rejectWithValue }) => {
        try {
            const { currentPage, sortBy, sortDirection } = params;
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(
                `${APIurl}/api/v1/users/songs?pageNo=${currentPage}&sortField=${sortBy}&direction=${sortDirection}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchUserFavSongsByPage = createAsyncThunk(
    "user/fetchUserFavSongs",
    async (params: params, { rejectWithValue }) => {
        try {
            const encodeFingerprint = encodeToBase64ForUrl(
                getDeviceFingerprint()
            );
            console.log(encodeFingerprint);
            const { currentPage, sortBy, sortDirection } = params;
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(
                `${APIurl}/api/v1/users/songs/favorites?pageNo=${currentPage}&sortField=${sortBy}&direction=${sortDirection}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

interface searchParams {
    currentPage: number;
    searchValue: string;
    searchBy: string;
    sortBy: string;
    sortDirection: string;
}

export const fetchUserSearchSongsByPage = createAsyncThunk(
    "user/fetchUserSearchSongs",
    async (params: searchParams, { rejectWithValue }) => {
        try {
            const {
                currentPage,
                searchValue,
                searchBy,
                sortBy,
                sortDirection,
            } = params;
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(
                `${APIurl}/api/v1/users/songs/search?${searchBy}=${searchValue}&pageNo=${currentPage}&sortField=${sortBy}&direction=${sortDirection}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchUserSearchFavSongsByPage = createAsyncThunk(
    "user/fetchUserSearchFavSongs",
    async (params: searchParams, { rejectWithValue }) => {
        try {
            const {
                currentPage,
                searchValue,
                searchBy,
                sortBy,
                sortDirection,
            } = params;
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                return;
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.get(
                `${APIurl}/api/v1/users/songs/favorites/search?${searchBy}=${searchValue}&pageNo=${currentPage}&sortField=${sortBy}&direction=${sortDirection}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

interface FetchRemoveSongFromPlaylistParams {
    playlistId: number;
    songId: number;
}

export const fetchAddSongToPlaylist = createAsyncThunk(
    "user/fetchAddSongToPlaylist",
    async (params: FetchRemoveSongFromPlaylistParams, { rejectWithValue }) => {
        try {
            const { playlistId, songId } = params;
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                throw new Error("Token not found");
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.post(
                `${APIurl}/api/v1/users/lists/${playlistId}/songs/${songId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchRemoveSongFromPlaylist = createAsyncThunk(
    "user/fetchRemoveSongsFromPlaylist",
    async (params: FetchRemoveSongFromPlaylistParams, { rejectWithValue }) => {
        try {
            const { playlistId, songId } = params;
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                throw new Error("Token not found");
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.delete(
                `${APIurl}/api/v1/users/lists/${playlistId}/songs/${songId}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchCreatePlaylist = createAsyncThunk(
    "user/fetchCreatePlaylist",
    async (playlistName: string, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                throw new Error("Token not found");
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.post(
                `${APIurl}/api/v1/users/lists`,
                {
                    name: playlistName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

export const fetchDeletePlaylist = createAsyncThunk(
    "user/fetchDeletePlaylist",
    async (playlistId: number, { rejectWithValue }) => {
        try {
            const tokenString = localStorage.getItem("token");
            if (!tokenString) {
                throw new Error("Token not found");
            }
            const tokenData = JSON.parse(tokenString);
            const response = await axios.delete(
                `${APIurl}/api/v1/users/lists/${playlistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenData.token}`,
                        Fingerprint: getDeviceFingerprint(),
                    },
                }
            );
            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return rejectWithValue(error.response?.data);
            } else {
                return rejectWithValue("An unexpected error occurred");
            }
        }
    }
);

const initialState: UserState = {
    profileState: {
        createDate: "",
        numberOfSongs: null,
        numberOfPlaylist: null,
        availableMemory: null,
        fetchProfileStatus: "idle",
        fetchUploadUserAvatarStatus: "idle",
        fetchUploadUserBackgroundImgStatus: "idle",
        fetchDeleteAccountStatus: "idle",
    },
    navBarState: {
        userAvatarImage: "",
        username: "",
        fetchPlaylistStatus: "idle",
        playlist: [],
    },
    homePageState: {
        userBackgroundImage: "",
    },
    musicPageState: {
        totalPage: null,
        totalSongs: null,
        songs: [],
        filter: {
            searchValue: "",
            searchBy: "name",
            sortBy: "uploadDate",
            sortDirection: "asc",
        },
        fetchCurrentPageStatus: "idle",
        currentPage: 0,
    },

    favoritePageState: {
        totalPage: null,
        totalSongs: null,
        songs: [],
        filter: {
            searchValue: "",
            searchBy: "name",
            sortBy: "uploadDate",
            sortDirection: "asc",
        },
        fetchCurrentPageStatus: "idle",
        currentPage: 0,
    },

    playListState: [],

    playerState: {
        currentSong: {
            id: -1,
            uploadDate: "Unknow",
            fileName: "Unknow",
            name: "Unknow",
            artist: "Unknow",
            album: "Unknow",
            albumImageBase64: defaultAlbumImageBase64,
            releaseDate: "Unknow",
            duration: 0,
            size: 0,
            favorite: false,
        },
        songsInTrackList: [],
        trackListIndex: 0,
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        //For log out
        resetState: (state) => {
            Object.assign(state, initialState);
            localStorage.removeItem("token");
        },

        setUsername: (state, action: PayloadAction<string>) => {
            state.navBarState.username = action.payload;
        },

        setBackgroundImage: (state, action: PayloadAction<string>) => {
            state.homePageState.userBackgroundImage = action.payload;
        },

        //+MusicPage
        addSongsInMusicPage: (state, action) => {
            state.musicPageState.songs = [
                ...state.musicPageState.songs,
                ...action.payload,
            ];
        },

        resetSongsInMusicPage: (state) => {
            state.musicPageState.songs = [];
        },

        setFetchStatusInMusicPage: (state) => {
            state.musicPageState.fetchCurrentPageStatus = "idle";
        },

        setCurrentPageInMusicPage: (state, action) => {
            state.musicPageState.currentPage = action.payload;
        },

        setSearchValueInMusicPage: (state, action: PayloadAction<string>) => {
            state.musicPageState.filter.searchValue = action.payload;
        },

        setSearchByInMusicPage: (state, action) => {
            state.musicPageState.filter.searchBy = action.payload;
        },

        setSortByInMusicPage: (state, action) => {
            state.musicPageState.filter.sortBy = action.payload;
        },

        setSortDirectionByInMusicPage: (state, action) => {
            state.musicPageState.filter.sortDirection = action.payload;
        },

        //-MusicPage

        //+FavPage
        addSongsInFavPage: (state, action) => {
            state.favoritePageState.songs = [
                ...state.favoritePageState.songs,
                ...action.payload,
            ];
        },

        resetSongsInFavPage: (state) => {
            state.favoritePageState.songs = [];
        },

        setFetchStatusFavPage: (state) => {
            state.favoritePageState.fetchCurrentPageStatus = "idle";
        },

        setCurrentPageFavPage: (state, action) => {
            state.favoritePageState.currentPage = action.payload;
        },

        setSearchValueInFavPage: (state, action: PayloadAction<string>) => {
            state.favoritePageState.filter.searchValue = action.payload;
        },

        setSearchByInFavPage: (state, action) => {
            state.favoritePageState.filter.searchBy = action.payload;
        },

        setSortByInFavPage: (state, action) => {
            state.favoritePageState.filter.sortBy = action.payload;
        },

        setSortDirectionByInFavPage: (state, action) => {
            state.favoritePageState.filter.sortDirection = action.payload;
        },
        //-FavPage

        //fix when add more tab
        handleFavoriteToggle: (state, action) => {
            state.musicPageState.songs = state.musicPageState.songs.map(
                (song) => {
                    if (song.id === action.payload.id) {
                        return {
                            ...song,
                            favorite: !action.payload.favorite,
                        };
                    }
                    return song;
                }
            );
            state.favoritePageState.fetchCurrentPageStatus = "idle";
        },

        //fix when add more tab
        handleDeleteSong: (state) => {
            state.musicPageState.fetchCurrentPageStatus = "idle";
            state.favoritePageState.fetchCurrentPageStatus = "idle";
        },

        //+Player
        setCurrentSongPlay: (state, action) => {
            state.playerState.currentSong = action.payload;
        },

        setCurrentSongPlayInTracklist: (state, action) => {
            state.playerState.trackListIndex = action.payload;
            state.playerState.currentSong =
                state.playerState.songsInTrackList[
                    state.playerState.trackListIndex
                ];
        },

        setSongInTrackList: (state, action: PayloadAction<Song[]>) => {
            state.playerState.songsInTrackList = action.payload;
        },

        setCurrentTracklistIndex: (state, action: PayloadAction<number>) => {
            state.playerState.trackListIndex = action.payload;
        },

        handlePlayAll: (state, action) => {
            if (action.payload.length === 0) {
                return;
            }
            state.playerState.songsInTrackList = action.payload;
            state.playerState.trackListIndex = 0;
            state.playerState.currentSong =
                state.playerState.songsInTrackList[
                    state.playerState.trackListIndex
                ];
        },

        handleSkipSong: (state) => {
            if (state.playerState.songsInTrackList.length !== 0) {
                if (
                    state.playerState.songsInTrackList.length - 1 ===
                    state.playerState.trackListIndex
                ) {
                    state.playerState.trackListIndex = 0;
                } else {
                    state.playerState.trackListIndex++;
                }
                state.playerState.currentSong =
                    state.playerState.songsInTrackList[
                        state.playerState.trackListIndex
                    ];
            }
        },

        handleBackSong: (state) => {
            if (state.playerState.songsInTrackList.length !== 0) {
                if (state.playerState.trackListIndex === 0) {
                    state.playerState.trackListIndex =
                        state.playerState.songsInTrackList.length - 1;
                } else {
                    state.playerState.trackListIndex--;
                }
                state.playerState.currentSong =
                    state.playerState.songsInTrackList[
                        state.playerState.trackListIndex
                    ];
            }
        },
        //-Player
    },
    extraReducers: (builder) => {
        //FetchUserPlaylist for display navBar and init playlistState
        builder.addCase(fetchUserPlaylist.pending, (state) => {
            state.navBarState.fetchPlaylistStatus = "pending";
        });

        builder.addCase(fetchUserPlaylist.fulfilled, (state, action) => {
            state.navBarState.fetchPlaylistStatus = "success";
            state.navBarState.playlist = action.payload?.data;
        });

        builder.addCase(fetchUserPlaylist.rejected, (state) => {
            state.navBarState.fetchPlaylistStatus = "failed";
        });

        //Fetch songs when search for MusicPage

        builder.addCase(fetchUserSearchSongsByPage.pending, (state) => {
            state.musicPageState.fetchCurrentPageStatus = "pending";
        });

        builder.addCase(
            fetchUserSearchSongsByPage.fulfilled,
            (state, action) => {
                state.musicPageState.totalSongs = action.payload.records;
                state.musicPageState.totalPage = action.payload.totalPage;
                state.musicPageState.songs = action.payload.data;
                state.musicPageState.fetchCurrentPageStatus = "success";
            }
        );

        builder.addCase(fetchUserSearchSongsByPage.rejected, (state) => {
            state.musicPageState.fetchCurrentPageStatus = "failed";
        });

        //Fetch songs for FavPage

        builder.addCase(fetchUserSearchFavSongsByPage.pending, (state) => {
            state.favoritePageState.fetchCurrentPageStatus = "pending";
        });

        builder.addCase(
            fetchUserSearchFavSongsByPage.fulfilled,
            (state, action) => {
                state.favoritePageState.totalSongs = action.payload.records;
                state.favoritePageState.totalPage = action.payload.totalPage;
                state.favoritePageState.songs = action.payload.data;
                state.favoritePageState.fetchCurrentPageStatus = "success";
            }
        );

        builder.addCase(fetchUserSearchFavSongsByPage.rejected, (state) => {
            state.favoritePageState.fetchCurrentPageStatus = "failed";
        });

        //Fetch Data for ProfilePage and NavBar
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.profileState.fetchProfileStatus = "pending";
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.profileState.fetchProfileStatus = "success";
            state.navBarState.username = action.payload.data.username;
            state.profileState.createDate =
                action.payload.data.accountCreateDate;
            state.profileState.numberOfSongs = action.payload.data.numberOfSong;
            state.profileState.numberOfPlaylist =
                action.payload.data.numberOfPlaylist;
            state.profileState.availableMemory =
                action.payload.data.availableMemory;
            state.navBarState.userAvatarImage = action.payload.data.avatarImage === "" ? "/avatardefault_92824.png" : action.payload.data.avatarImage;
            state.homePageState.userBackgroundImage =
                action.payload.data.backgroundImage === "" ? "/danny-howe-bn-D2bCvpik-unsplash.jpg" : action.payload.data.backgroundImage;
        });
        builder.addCase(fetchUserProfile.rejected, (state) => {
            state.profileState.fetchProfileStatus = "failed";
        });

        //Handle upload avatarImg
        builder.addCase(uploadAvatarImage.pending, (state) => {
            state.profileState.fetchUploadUserAvatarStatus = "pending";
        });
        builder.addCase(uploadAvatarImage.fulfilled, (state, action) => {
            state.profileState.fetchUploadUserAvatarStatus = "success";
            state.navBarState.userAvatarImage = action.payload.data;
        });
        builder.addCase(uploadAvatarImage.rejected, (state) => {
            state.profileState.fetchUploadUserAvatarStatus = "failed";
        });

        //Handle upload background
        builder.addCase(uploadBackgroundImage.pending, (state) => {
            state.profileState.fetchUploadUserBackgroundImgStatus = "pending";
        });
        builder.addCase(uploadBackgroundImage.fulfilled, (state, action) => {
            state.profileState.fetchUploadUserBackgroundImgStatus = "success";
            state.homePageState.userBackgroundImage = action.payload.data;
        });
        builder.addCase(uploadBackgroundImage.rejected, (state) => {
            state.profileState.fetchUploadUserBackgroundImgStatus = "failed";
        });

        //Handle upload userSongs
        builder.addCase(uploadUserSongs.fulfilled, (state) => {
            state.musicPageState.fetchCurrentPageStatus = "idle"
        });

        //Handle delete account
        builder.addCase(fetchDeleteAccout.pending, (state) => {
            state.profileState.fetchDeleteAccountStatus = "pending";
        });
        builder.addCase(fetchDeleteAccout.fulfilled, (state) => {
            state.profileState.fetchDeleteAccountStatus = "success";
        });
        builder.addCase(fetchDeleteAccout.rejected, (state) => {
            state.profileState.fetchDeleteAccountStatus = "failed";
        });

        builder.addCase(fetchUserPlaylistSongs.fulfilled, (state, action) => {
            const playlistId = action.meta.arg;
            const newData: PlaylistState = {
                id: playlistId,
                songs: action.payload.data,
                requireRefetch: false,
            };
            state.playListState.push(newData);
        });

        builder.addCase(fetchCreatePlaylist.fulfilled, (state) => {
            state.navBarState.fetchPlaylistStatus = "idle";
        });

        builder.addCase(fetchAddSongToPlaylist.fulfilled, (state, action) => {
            const { playlistId } = action.meta.arg;
            state.playListState = state.playListState.filter(
                (ele) => ele.id !== playlistId
            );
        });

        builder.addCase(
            fetchRemoveSongFromPlaylist.fulfilled,
            (state, action) => {
                const { playlistId, songId } = action.meta.arg;
                state.playListState.forEach((ele) => {
                    if (ele.id == playlistId) {
                        ele.songs = ele.songs.filter(
                            (song) => song.id !== songId
                        );
                        return;
                    }
                });
            }
        );

        builder.addCase(
            fetchRenameUserPlaylist.fulfilled,
            (action, payload) => {
                const { playlistId, newPlaylistName } = payload.meta.arg;
                action.navBarState.playlist = action.navBarState.playlist.map(
                    (ele) => {
                        if (ele.id === playlistId) {
                            ele.name = newPlaylistName;
                        }
                        return ele;
                    }
                );
            }
        );

        builder.addCase(fetchDeletePlaylist.fulfilled, (action, payload) => {
            const playlistId = payload.meta.arg;
            action.navBarState.playlist = action.navBarState.playlist.filter(
                (ele) => ele.id !== playlistId
            );
            action.playListState = action.playListState.filter(
                (ele) => ele.id !== playlistId
            );
        });
    },
});

export default userSlice;
