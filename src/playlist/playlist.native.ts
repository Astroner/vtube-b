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

export interface UserLibrary {
    contents: {
        twoColumnBrowseResultsRenderer: {
            tabs: [
                {
                    tabRenderer: {
                        content: {
                            sectionListRenderer: {
                                contents: Array<{
                                    itemSectionRenderer: {
                                        sectionIdentifier?: "library-recent";
                                        targetId?: "library-playlists-shelf";
                                        contents: [
                                            {
                                                shelfRenderer: {
                                                    content: {
                                                        gridRenderer: {
                                                            items: Array<
                                                                | {
                                                                      gridVideoRenderer: {
                                                                          title: {
                                                                              runs: Array<{
                                                                                  text: string;
                                                                              }>;
                                                                          };
                                                                      };
                                                                      videoId: string;
                                                                      thumbnail: {
                                                                          thumbnails: YTImage[];
                                                                      };
                                                                  }
                                                                | {
                                                                      gridPlaylistRenderer: {
                                                                          title: {
                                                                              simpleText: string;
                                                                          };
                                                                          playlistId: string;
                                                                          thumbnail: {
                                                                              thumbnails: YTImage[];
                                                                          };
                                                                      };
                                                                  }
                                                            >;
                                                        };
                                                    };
                                                };
                                            }
                                        ];
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
