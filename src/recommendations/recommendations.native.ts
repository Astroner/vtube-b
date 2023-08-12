import { YTImage } from "src/Types";

export interface VideoRenderer {
    videoRenderer: {
        title: {
            runs: [
                {
                    text: string;
                }
            ];
        };
        videoId: string;
        thumbnail: {
            thumbnails: YTImage[];
        };
    };
}

export interface RadioRenderer {
    radioRenderer: {
        title: {
            simpleText: string;
        };
        thumbnail: {
            thumbnails: YTImage[];
        };
        navigationEndpoint: {
            watchEndpoint: {
                playlistId: string;
                videoId: string;
            };
            commandMetadata: {
                webCommandMetadata: {
                    url: string;
                };
            };
        };
    };
}

export interface YoutubeRecommendations {
    contents: {
        twoColumnBrowseResultsRenderer: {
            tabs: [
                {
                    tabRenderer: {
                        content: {
                            richGridRenderer: {
                                contents: Array<
                                    | {
                                        richItemRenderer: {
                                            content: VideoRenderer | RadioRenderer
                                        }
                                    }
                                    | {
                                        richSectionRenderer: unknown
                                    }
                                >;
                            };
                        };
                    };
                }
            ];
        };
    };
}

export interface MusicTwoRowItemRenderer {
    musicTwoRowItemRenderer: {
        title: {
            runs: [{ text: string }];
        };
        thumbnailRenderer: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        navigationEndpoint: {
            watchEndpoint: {
                playlistId?: string;
                videoId: string;
            };
        };
    };
}

export interface MusicResponsiveListItemRenderer {
    musicResponsiveListItemRenderer: {
        thumbnail: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        overlay: {
            musicItemThumbnailOverlayRenderer: {
                content: {
                    musicPlayButtonRenderer: {
                        playNavigationEndpoint: {
                            watchEndpoint: {
                                playlistId: string;
                                videoId: string;
                            };
                        };
                    };
                };
            };
        };
        flexColumns: [
            {
                musicResponsiveListItemFlexColumnRenderer: {
                    text: {
                        runs: [{ text: string }];
                    };
                };
            }
        ];
    };
}

export interface MusicRecommendations {
    contents: {
        singleColumnBrowseResultsRenderer: {
            tabs: [
                {
                    tabRenderer: {
                        content: {
                            sectionListRenderer: {
                                contents: Array<{
                                    musicCarouselShelfRenderer: {
                                        header: {
                                            musicCarouselShelfBasicHeaderRenderer: {
                                                title: {
                                                    runs: [
                                                        {
                                                            text: string;
                                                        }
                                                    ];
                                                };
                                            };
                                        };
                                        contents: Array<
                                            | MusicTwoRowItemRenderer
                                            | MusicResponsiveListItemRenderer
                                        >;
                                    };
                                }>;
                            };
                        };
                    };
                }
            ];
        };
    };
}
