import { YTImage } from "src/Types";

export interface ChannelRenderer {
    channelRenderer: {
        channelId: string;
        title: {
            simpleText: string;
        };
        thumbnail: {
            thumbnails: YTImage[];
        };
    };
}

export interface Subscriptions {
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
                                                    shelfRenderer: {
                                                        content: {
                                                            expandedShelfContentsRenderer: {
                                                                items: ChannelRenderer[];
                                                            };
                                                        };
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
}
