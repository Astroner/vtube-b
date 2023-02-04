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
                                              contents: Array<{
                                                  musicResponsiveListItemRenderer: {
                                                      thumbnail: {
                                                          musicThumbnailRenderer: {
                                                              thumbnail: {
                                                                  thumbnails: YTImage[];
                                                              };
                                                          };
                                                      };
                                                      playlistItemData?: {
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
                                >;
                            };
                        };
                    };
                }
            ];
        };
    };
};
