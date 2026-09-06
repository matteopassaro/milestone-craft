// app/api/stats/route.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const platform = searchParams.get("platform")
  // Accept both 'handle' (from frontend) and 'username' just in case
  const username = searchParams.get("handle") || searchParams.get("username")

  if (!platform || !username) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  try {
    let current = 0
    let metric = "followers"
    let avatarUrl = ""

    switch (platform) {
      case "github":
        const ghRes = await fetch(`https://api.github.com/users/${username}`)
        if (!ghRes.ok) throw new Error("GitHub user not found")
        const ghData = await ghRes.json()
        current = ghData.followers
        avatarUrl = ghData.avatar_url
        metric = "followers"
        break;

      case "x":
        // Replace with actual X/Twitter API logic (Requires Bearer Token)
        // const xRes = await fetch(`https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,profile_image_url`, { headers: { Authorization: `Bearer ${process.env.X_BEARER_TOKEN}` } })
        metric = "followers"
        break;

      case "youtube":
        // Replace with actual YouTube API logic (Requires API Key)
        // const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forUsername=${username}&key=${process.env.YOUTUBE_API_KEY}`)
        metric = "subscribers"
        break;

      case "newsletter":
        metric = "subscribers"
        break;

      default:
        throw new Error("Unsupported platform")
    }

    return NextResponse.json({ current, metric, avatarUrl })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}