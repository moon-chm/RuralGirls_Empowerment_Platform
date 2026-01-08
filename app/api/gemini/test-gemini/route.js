// Create this file: app/api/test-gemini/route.js

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "GEMINI_API_KEY not found" 
      })
    }

    // Test with a simple request
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Say hello in one word"
          }]
        }]
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        status: response.status,
        error: data.error?.message || "Unknown error",
        details: data
      }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      message: "API key is working!",
      response: data.candidates?.[0]?.content?.parts?.[0]?.text
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}