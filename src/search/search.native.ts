import { YTImage } from "src/Types";

export type VideoRenderer = {
    videoRenderer: {
        videoId: string;
        thumbnail: {
            thumbnails: YTImage[];
        };
        title: {
            runs: [
                {
                    text: string;
                }
            ];
        };
        viewCountText: {
            simpleText: string;
        };
        // check for stream
        badges: Array<
            | { randomShit: unknown }
            | {
                  metadataBadgeRenderer: {
                      label: "LIVE";
                  };
              }
        >;
    };
};

export type ShelfRenderer = {
    shelfRenderer: {
        title: {
            simpleText: string;
        };
        content: {
            verticalListRenderer: {
                items: VideoRenderer[];
            };
        };
    };
};

export type ChannelRenderer = {
    channelRenderer: {
        channelId: string;
        title: {
            simpleText: string;
        };
        thumbnail: {
            thumbnails: YTImage[];
        };
        /**
         * channel tag
         */
        subscriberCountText: {
            simpleText: string;
        };
        descriptionSnippet?: {
            runs: [
                {
                    text: string;
                }
            ];
        };
        videoCountText: {
            simpleText: string;
        };
        subscriptionButton: {
            subscribed: boolean;
        };
    };
};

export type PlaylistRenderer = {
    playlistRenderer: {
        playlistId: string;
        title: {
            simpleText: string;
        };
        thumbnails: [
            {
                thumbnails: YTImage[];
            }
        ];
    };
};

export type YoutubeSearchResult = {
    contents: {
        twoColumnSearchResultsRenderer: {
            primaryContents: {
                sectionListRenderer: {
                    contents: [
                        {
                            itemSectionRenderer: {
                                // here also can be reels and reels shelf
                                contents: Array<
                                    | ChannelRenderer
                                    | ShelfRenderer
                                    | VideoRenderer
                                    | PlaylistRenderer
                                    | { randomShit: unknown }
                                >;
                            };
                        }
                    ];
                };
            };
        };
    };
};

export type AudioTemplate = {
    musicResponsiveListItemRenderer: {
        thumbnail: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        playlistItemData: {
            videoId: string;
        };
        flexColumns: [
            {
                musicResponsiveListItemFlexColumnRenderer: {
                    text: {
                        runs: [
                            {
                                text: string;
                            }
                        ];
                    };
                };
            }
        ];
    };
};

export type ArtistTemplate = {
    musicResponsiveListItemRenderer: {
        thumbnail: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        flexColumns: [
            {
                musicResponsiveListItemFlexColumnRenderer: {
                    text: {
                        runs: [
                            {
                                text: string;
                            }
                        ];
                    };
                };
            }
        ];
        navigationEndpoint: {
            browseEndpoint: {
                /**
                 * channel id
                 */
                browseId: string;
                browseEndpointContextSupportedConfigs: {
                    browseEndpointContextMusicConfig: {
                        pageType: "MUSIC_PAGE_TYPE_ARTIST";
                    };
                };
            };
        };
    };
};

export type MusicPlaylistTemplate = {
    musicResponsiveListItemRenderer: {
        thumbnail: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        flexColumns: [
            {
                musicResponsiveListItemFlexColumnRenderer: {
                    text: {
                        runs: [
                            {
                                text: string;
                            }
                        ];
                    };
                };
            }
        ];
        overlay: {
            musicItemThumbnailOverlayRenderer: {
                content: {
                    musicPlayButtonRenderer: {
                        playNavigationEndpoint: {
                            watchPlaylistEndpoint: {
                                /**
                                 * list
                                 */
                                playlistId: string;
                            };
                        };
                    };
                };
            };
        };
        navigationEndpoint: {
            browseEndpoint: {
                browseEndpointContextSupportedConfigs: {
                    browseEndpointContextMusicConfig: {
                        pageType:
                            | "MUSIC_PAGE_TYPE_ALBUM"
                            | "MUSIC_PAGE_TYPE_PLAYLIST";
                    };
                };
            };
        };
    };
};

export type MusicDynamicPlaylistTemplate = {
    musicResponsiveListItemRenderer: {
        thumbnail: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        flexColumns: [
            {
                musicResponsiveListItemFlexColumnRenderer: {
                    text: {
                        runs: [
                            {
                                text: string;
                            }
                        ];
                    };
                };
            }
        ];
        navigationEndpoint: {
            watchEndpoint: {
                videoId: string;
                playlistId: string;
            };
        };
    };
};

export type MusicSearchResult = {
    contents: {
        tabbedSearchResultsRenderer: {
            tabs: [
                {
                    tabRenderer: {
                        content: {
                            sectionListRenderer: {
                                contents: Array<
                                    | {
                                          itemSectionRenderer: unknown;
                                      }
                                    | {
                                          musicShelfRenderer: {
                                              title: {
                                                  runs: [
                                                      {
                                                          text: string;
                                                      }
                                                  ];
                                              };
                                              contents: Array<
                                                  | AudioTemplate
                                                  | ArtistTemplate
                                                  | MusicPlaylistTemplate
                                                  | MusicDynamicPlaylistTemplate
                                              >;
                                          };
                                      }
                                >;
                            };
                        };
                    };
                }
            ];
        };
    };
};

export const isAudioTemplate = (
    item:
        | AudioTemplate
        | ArtistTemplate
        | MusicPlaylistTemplate
        | MusicDynamicPlaylistTemplate
): item is AudioTemplate => {
    return "playlistItemData" in item.musicResponsiveListItemRenderer;
};

export const isDynamicPlaylistTemplate = (
    item:
        | AudioTemplate
        | ArtistTemplate
        | MusicPlaylistTemplate
        | MusicDynamicPlaylistTemplate
): item is MusicDynamicPlaylistTemplate => {
    return (
        "navigationEndpoint" in item.musicResponsiveListItemRenderer &&
        "watchEndpoint" in
            item.musicResponsiveListItemRenderer.navigationEndpoint
    );
};

export const isArtistTemplate = (
    item:
        | AudioTemplate
        | ArtistTemplate
        | MusicPlaylistTemplate
        | MusicDynamicPlaylistTemplate
): item is ArtistTemplate => {
    return (
        "navigationEndpoint" in item.musicResponsiveListItemRenderer &&
        "browseEndpoint" in
            item.musicResponsiveListItemRenderer.navigationEndpoint &&
        item.musicResponsiveListItemRenderer.navigationEndpoint.browseEndpoint
            .browseEndpointContextSupportedConfigs
            .browseEndpointContextMusicConfig.pageType ===
            "MUSIC_PAGE_TYPE_ARTIST"
    );
};
