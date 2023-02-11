import { YTImage } from "src/Types";

export type YTChannelBasic = {
    header: {
        c4TabbedHeaderRenderer: {
            channelId: string;
            title: string;
            avatar: {
                thumbnails: YTImage[];
            };
            banner: {
                thumbnails: YTImage[];
            };
        };
    };
    metadata: {
        channelMetadataRenderer: {
            description?: string;
        };
    };
    microformat: {
        microformatDataRenderer: {
            tags: string[];
        };
    };
};

export type YTChannelVideos = YTChannelBasic & {
    contents: {
        twoColumnBrowseResultsRenderer: {
            tabs: Array<{
                tabRenderer: {
                    title: string;
                    content?: {
                        richGridRenderer: {
                            contents: Array<
                                | {
                                      richItemRenderer: {
                                          content: {
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
                                                  thumbnailOverlays: Array<
                                                      | { randomShit: unknown }
                                                      | {
                                                            thumbnailOverlayTimeStatusRenderer: {
                                                                /**
                                                                 * If style === LIVE then its actual live stream.
                                                                 */
                                                                style: string;
                                                            };
                                                        }
                                                  >;
                                              };
                                          };
                                      };
                                  }
                                | {
                                      continuationItemRenderer: {
                                          continuationEndpoint: {
                                              continuationCommand: {
                                                  token: string;
                                              };
                                          };
                                      };
                                  }
                            >;
                        };
                    };
                };
            }>;
        };
    };
};

export type YTChannelVideosContinuation = {
    onResponseReceivedActions: [
        {
            appendContinuationItemsAction: {
                continuationItems: Array<
                    | {
                          richItemRenderer: {
                              content: {
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
                                  };
                              };
                          };
                      }
                    | {
                          continuationItemRenderer: {
                              continuationEndpoint: {
                                  continuationCommand: {
                                      token: string;
                                  };
                              };
                          };
                      }
                >;
            };
        }
    ];
};

export type YTChannelPlaylists = YTChannelBasic & {
    contents: {
        twoColumnBrowseResultsRenderer: {
            tabs: Array<{
                tabRenderer: {
                    title: string;
                    content?: {
                        sectionListRenderer: {
                            contents: [
                                {
                                    itemSectionRenderer: {
                                        contents: [
                                            {
                                                gridRenderer: {
                                                    items: Array<
                                                        | {
                                                              gridPlaylistRenderer: {
                                                                  playlistId: string;
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
                                                              };
                                                          }
                                                        | {
                                                              continuationItemRenderer: {
                                                                  continuationEndpoint: {
                                                                      continuationCommand: {
                                                                          token: string;
                                                                      };
                                                                  };
                                                              };
                                                          }
                                                    >;
                                                };
                                            }
                                        ];
                                    };
                                }
                            ];
                        };
                    };
                };
            }>;
        };
    };
};

export type YTChannelPlaylistsContinuation = {
    onResponseReceivedActions: [
        {
            appendContinuationItemsAction: {
                continuationItems: Array<
                    | {
                          gridPlaylistRenderer: {
                              playlistId: string;
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
                          };
                      }
                    | {
                          continuationItemRenderer: {
                              continuationEndpoint: {
                                  continuationCommand: {
                                      token: string;
                                  };
                              };
                          };
                      }
                >;
            };
        }
    ];
};

export type CarouselArtist = {
    musicTwoRowItemRenderer: {
        title: {
            runs: [
                {
                    text: string;
                }
            ];
        };
        thumbnailRenderer: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        navigationEndpoint: {
            browseEndpoint: {
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

export type CarouselAlbum = {
    musicTwoRowItemRenderer: {
        title: {
            runs: [
                {
                    text: string;
                }
            ];
        };
        thumbnailRenderer: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: YTImage[];
                };
            };
        };
        thumbnailOverlay: {
            musicItemThumbnailOverlayRenderer: {
                content: {
                    musicPlayButtonRenderer: {
                        playNavigationEndpoint: {
                            watchPlaylistEndpoint: {
                                playlistId: string;
                            };
                        };
                    };
                };
            };
        };
    };
};

export type CarouselPlaylist = {
    musicTwoRowItemRenderer: {
        title: {
            runs: [
                {
                    text: string;
                }
            ];
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
                videoId: string;
                playlistId: string;
            };
        };
    };
};

export type MusicChannelResponse = {
    header: {
        musicImmersiveHeaderRenderer: {
            title: {
                runs: [
                    {
                        text: string;
                    }
                ];
            };
            description: {
                runs: [
                    {
                        text: string;
                    }
                ];
            };
            thumbnail: {
                musicThumbnailRenderer: {
                    thumbnail: {
                        thumbnails: YTImage[];
                    };
                };
            };
        };
    };
    contents: {
        singleColumnBrowseResultsRenderer: {
            tabs: [
                {
                    tabRenderer: {
                        content: {
                            sectionListRenderer: {
                                contents: Array<
                                    | { randomShitGo: unknown }
                                    | {
                                          musicShelfRenderer: {
                                              title: {
                                                  runs: [
                                                      {
                                                          text: string;
                                                      }
                                                  ];
                                              };
                                              contents: Array<{
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
                                              }>;
                                          };
                                      }
                                    | {
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
                                                  | CarouselArtist
                                                  | CarouselPlaylist
                                                  | CarouselAlbum
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

export const isCarouselArtist = (
    item: CarouselArtist | CarouselPlaylist | CarouselAlbum
): item is CarouselArtist => {
    return (
        "navigationEndpoint" in item.musicTwoRowItemRenderer &&
        "browseEndpoint" in item.musicTwoRowItemRenderer.navigationEndpoint &&
        item.musicTwoRowItemRenderer.navigationEndpoint.browseEndpoint
            .browseEndpointContextSupportedConfigs
            .browseEndpointContextMusicConfig.pageType ===
            "MUSIC_PAGE_TYPE_ARTIST"
    );
};

export const isCarouselAlbum = (
    item: CarouselArtist | CarouselPlaylist | CarouselAlbum
): item is CarouselAlbum => {
    return "thumbnailOverlay" in item.musicTwoRowItemRenderer;
};

export const isCarouselPlaylist = (
    item: CarouselArtist | CarouselPlaylist | CarouselAlbum
): item is CarouselPlaylist => {
    return (
        "navigationEndpoint" in item.musicTwoRowItemRenderer &&
        "watchEndpoint" in item.musicTwoRowItemRenderer.navigationEndpoint
    );
};
