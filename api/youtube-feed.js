async function getChannelIdFromPublicPage() {
  const response = await fetch("https://www.youtube.com/@iconmediamx", {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  if (!response.ok) throw new Error("YouTube no respondió al canal público.");
  const html = await response.text();

  const matches = [
    html.match(/"channelId":"(UC[a-zA-Z0-9_-]{20,})"/),
    html.match(/channelId\\?":\\?"(UC[a-zA-Z0-9_-]{20,})/),
    html.match(/<meta itemprop="channelId" content="(UC[a-zA-Z0-9_-]{20,})"/)
  ];

  const match = matches.find(Boolean);
  if (!match) throw new Error("No se pudo obtener el ID público del canal.");
  return match[1];
}

async function getFromRss() {
  const channelId = await getChannelIdFromPublicPage();
  const rssResponse = await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + encodeURIComponent(channelId), {
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  if (!rssResponse.ok) throw new Error("No se pudo consultar el feed público de YouTube.");

  const xml = await rssResponse.text();
  const entries = [...xml.matchAll(/<entry>([\\s\\S]*?)<\/entry>/g)];

  const decode = value => value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return entries.map(match => {
    const entry = match[1];
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([\\s\\S]*?)<\/title>/)?.[1];
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!id) return null;

    return {
      id,
      title: title ? decode(title) : "Short de ICON MEDIA",
      publishedAt: publishedAt || "",
      thumbnail: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg",
      url: "https://www.youtube.com/shorts/" + id
    };
  }).filter(Boolean);
}

async function getFromApi(key) {
  const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelUrl.search = new URLSearchParams({
    part: "contentDetails",
    forHandle: "@iconmediamx",
    key
  });

  const channelResponse = await fetch(channelUrl);
  const channelData = await channelResponse.json();

  if (!channelResponse.ok || !channelData.items?.length) {
    throw new Error(channelData.error?.message || "No se encontró el canal de ICON MEDIA en YouTube.");
  }

  const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
  const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
  playlistUrl.search = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: "12",
    key
  });

  const playlistResponse = await fetch(playlistUrl);
  const playlistData = await playlistResponse.json();

  if (!playlistResponse.ok) {
    throw new Error(playlistData.error?.message || "YouTube no pudo devolver los videos.");
  }

  return (playlistData.items || []).map(item => {
    const snippet = item.snippet || {};
    const videoId = snippet.resourceId?.videoId;
    if (!videoId) return null;
    return {
      id: videoId,
      title: snippet.title || "Short de ICON MEDIA",
      publishedAt: snippet.publishedAt || "",
      thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.standard?.url || snippet.thumbnails?.high?.url || "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg",
      url: "https://www.youtube.com/shorts/" + videoId
    };
  }).filter(Boolean);
}

export default async function handler(req, res) {
  try {
    let videos = [];
    let source = "rss";

    if (process.env.YOUTUBE_API_KEY) {
      try {
        videos = await getFromApi(process.env.YOUTUBE_API_KEY);
        source = "youtube-api";
      } catch (apiError) {
        console.warn("YouTube Data API falló; usando feed público:", apiError.message);
      }
    }

    if (!videos.length) videos = await getFromRss();

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ channel: "@iconmediamx", source, videos });
  } catch (error) {
    console.error("ICON FEED:", error);
    return res.status(502).json({
      error: "No pudimos leer los Shorts de @iconmediamx.",
      details: error.message
    });
  }
}
