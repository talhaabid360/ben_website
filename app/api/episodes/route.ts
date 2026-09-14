import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 900;

const THEME_NAMES: Record<string, string> = {
  purpose: "Purpose",
  culture: "Culture",
  family: "Family",
  wellness: "Wellness",
  marriage: "Marriage",
  truth: "Truth",
  faith: "Faith",
};

type PlaylistItemsResponse = {
  nextPageToken?: string;
  items?: Array<{
    contentDetails?: {
      videoId?: string;
    };
  }>;
};

type VideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    tags?: string[];
    thumbnails?: Record<string, { url?: string }>;
  };
};

type VideosResponse = {
  items?: VideoItem[];
};

async function youtubeRequest<T>(
  resource: string,
  parameters: Record<string, string>,
): Promise<T> {
  const url = new URL(
    `https://www.googleapis.com/youtube/v3/${resource}`,
  );

  Object.entries(parameters).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`YouTube API returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function parseEpisodeTitle(rawTitle: string) {
  const completeMatch = rawTitle.match(
    /^(.*?)\s+Ft\.?\s+(.+?)\s*\|\s*EP\.?\s*0*(\d+)\s*$/i,
  );

  if (completeMatch) {
    return {
      title: completeMatch[1].trim(),
      guest: completeMatch[2].trim(),
      number: completeMatch[3].padStart(2, "0"),
    };
  }

  const numberMatch = rawTitle.match(
    /\|\s*EP\.?\s*0*(\d+)\s*$/i,
  );

  return {
    title: rawTitle
      .replace(/\s*\|\s*EP\.?\s*0*\d+\s*$/i, "")
      .trim(),
    guest: "Featured Guest",
    number: (numberMatch?.[1] ?? "0").padStart(2, "0"),
  };
}

function extractThemes(tags: string[] = []) {
  const matchedThemes = tags
    .map((tag) => {
      const normalized = tag.trim().toLowerCase();

      if (!normalized.startsWith("theme-")) {
        return undefined;
      }

      return THEME_NAMES[normalized.slice(6)];
    })
    .filter((theme): theme is string => Boolean(theme));

  return Array.from(new Set(matchedThemes));
}

function extractSummary(description: string) {
  return (
    description
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .find(Boolean) ??
    "Watch the newest conversation from To My Sons & Daughters."
  );
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID;

  if (!apiKey || !playlistId) {
    return NextResponse.json(
      { error: "YouTube integration is not configured." },
      { status: 500 },
    );
  }

  try {
    const videoIds: string[] = [];
    let pageToken: string | undefined;

    do {
      const playlistPage =
        await youtubeRequest<PlaylistItemsResponse>(
          "playlistItems",
          {
            part: "contentDetails",
            maxResults: "50",
            playlistId,
            key: apiKey,
            ...(pageToken ? { pageToken } : {}),
          },
        );

      for (const item of playlistPage.items ?? []) {
        const videoId = item.contentDetails?.videoId;

        if (videoId) {
          videoIds.push(videoId);
        }
      }

      pageToken = playlistPage.nextPageToken;
    } while (pageToken);

    const videos: VideoItem[] = [];

    for (let index = 0; index < videoIds.length; index += 50) {
      const videoPage = await youtubeRequest<VideosResponse>(
        "videos",
        {
          part: "snippet",
          id: videoIds.slice(index, index + 50).join(","),
          key: apiKey,
        },
      );

      videos.push(...(videoPage.items ?? []));
    }

    const episodes = videos
      .filter((video) => video.id && video.snippet?.title)
      .sort((first, second) => {
        const firstDate = Date.parse(
          first.snippet?.publishedAt ?? "",
        );
        const secondDate = Date.parse(
          second.snippet?.publishedAt ?? "",
        );

        return (secondDate || 0) - (firstDate || 0);
      })
      .map((video) => {
        const snippet = video.snippet!;
        const parsedTitle = parseEpisodeTitle(snippet.title!);
        const themes = extractThemes(snippet.tags);
        const thumbnails = snippet.thumbnails ?? {};

        return {
          id: video.id,
          number: parsedTitle.number,
          guest: parsedTitle.guest,
          title: parsedTitle.title,
          theme: themes[0] ?? "Episode",
          themes,
          image:
            thumbnails.maxres?.url ??
            thumbnails.standard?.url ??
            thumbnails.high?.url ??
            thumbnails.medium?.url ??
            `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          summary: extractSummary(snippet.description ?? ""),
          publishedAt: snippet.publishedAt ?? "",
        };
      });

    return NextResponse.json(
      { episodes },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=900, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error(
      "YouTube episode sync failed:",
      error instanceof Error ? error.message: "Unknown error",
    );

    return NextResponse.json(
      { error: "The episode archive could not be refreshed." },
      { status: 500 },
    );
  }
}


