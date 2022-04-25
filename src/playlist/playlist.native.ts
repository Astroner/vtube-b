import { YTImage } from "src/Types";

export interface PlaylistData {
    metadata: {
        playlistMetadataRenderer: {
            title: string;
        };
    };
    contents: {
        twoColumnBrowseResultsRenderer: {
            tabs: [
                {
                    tabRenderer: {
                        content: {
                            sectionListRenderer: {
                                contents: [
                                    {
                                        itemSectionRenderer: {
                                            contents: [
                                                {
                                                    playlistVideoListRenderer: {
                                                        contents: Array<{
                                                            playlistVideoRenderer: {
                                                                videoId: string;
                                                                isPlayable: true;
                                                                title: {
                                                                    runs: [
                                                                        {
                                                                            text: string;
                                                                        }
                                                                    ];
                                                                };
                                                                thumbnail: {
                                                                    thumbnails: YTImage[];
                                                                };
                                                            };
                                                        }>;
                                                    };
                                                }
                                            ];
                                        };
                                    }
                                ];
                            };
                        };
                    };
                }
            ];
        };
    };
    microformat: {
        microformatDataRenderer: {
            thumbnail: {
                thumbnails: YTImage[];
            };
        };
    };
}

export interface PlaylistError {
    alerts: [
        {
            alertRenderer: {
                text: {
                    runs: [{ text: string }];
                };
            };
        }
    ];
}

export interface DynamicPlaylist {
    contents: {
        twoColumnWatchNextResults: {
            playlist: {
                playlist: {
                    title: string;
                    contents: Array<{
                        playlistPanelVideoRenderer: {
                            title: {
                                simpleText: string;
                            };
                            thumbnail: {
                                thumbnails: YTImage[];
                            };
                            navigationEndpoint: {
                                watchEndpoint: {
                                    videoId: string;
                                    playlistId: string;
                                };
                            };
                        };
                    }>;
                };
            };
        };
    };
}
