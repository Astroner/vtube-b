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

export interface Playlist {
    title: string;
    display: YTImage[];
    list: ListItem[];
}

export interface ListItem {
    title: string;
    code: string;
    display: YTImage[];
}
