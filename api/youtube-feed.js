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
    const key = process.env.YOUTUBE_API_KEY;

    if (!key) {
      return res.status(500).json({
        error: "Falta YOUTUBE_API_KEY en Vercel.",
        code: "MISSING_API_KEY"
      });
    }

    let videos;
    try {
      videos = await getFromApi(key);
    } catch (apiError) {
      console.error("ICON FEED YouTube API:", apiError.message);
      return res.status(502).json({
        error: "YouTube Data API rechazó la consulta.",
        code: apiError.code || "YOUTUBE_API_ERROR",
        details: apiError.message
      });
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ channel: "@iconmediamx", source: "youtube-api", videos });
  } catch (error) {
    console.error("ICON FEED:", error);
    return res.status(500).json({
      error: "Error interno de ICON LOOP.",
      details: error.message
    });
  }
}
