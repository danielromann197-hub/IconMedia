export default async function handler(req, res) {
  const key = process.env.YOUTUBE_API_KEY;

  if (!key) {
    return res.status(500).json({ error: "Falta configurar YOUTUBE_API_KEY en Vercel." });
  }

  try {
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.search = new URLSearchParams({
      part: "contentDetails",
      forHandle: "@iconmediamx",
      key
    });

    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok || !channelData.items?.length) {
      return res.status(502).json({ error: "No se encontró el canal de ICON MEDIA en YouTube." });
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
      return res.status(502).json({ error: "YouTube no pudo devolver los videos.", details: playlistData.error?.message });
    }

    const videos = (playlistData.items || []).map(item => {
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

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ channel: "@iconmediamx", videos });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo cargar el feed de YouTube.", details: error.message });
  }
}
