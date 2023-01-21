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
