import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  // 1. Check if the user is authenticated
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const platform = searchParams.get("platform")
  const username = searchParams.get("username")

  if (!platform || !username) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
  }

  try {
    // Here you will place your actual API calls (e.g., GitHub API, X API)
    // For now, we return secure mock data tied to the user's request
    const stats = {
      followers: 15420,
      avatar: session.user.image, // Use their real authenticated avatar
      name: session.user.name
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}