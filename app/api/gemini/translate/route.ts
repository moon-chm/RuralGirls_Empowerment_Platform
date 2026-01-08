import { NextResponse } from "next/server"

// Language code mapping
const languageCodeMap = {
  "Hindi": "hi",
  "English": "en",
  "Bengali": "bn",
  "Telugu": "te",
  "Marathi": "mr",
  "Tamil": "ta",
  "Gujarati": "gu",
  "Kannada": "kn",
  "Malayalam": "ml",
  "Punjabi": "pa",
  "Odia": "or",
  "Assamese": "as",
  "Urdu": "ur",
}

export async function POST(request) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    // Get language code
    const langCode = languageCodeMap[targetLanguage] || targetLanguage.toLowerCase()
    
    console.log(`Translating to ${targetLanguage} (${langCode})`)

    // Use MyMemory Translation API (free, no API key needed)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok || data.responseStatus !== 200) {
      console.error("MyMemory API error:", data)
      return NextResponse.json(
        { error: "Translation service error", details: data },
        { status: 500 }
      )
    }

    const translatedText = data.responseData?.translatedText

    if (!translatedText) {
      return NextResponse.json(
        { error: "No translation received" },
        { status: 500 }
      )
    }

    console.log("✅ Translation successful")
    return NextResponse.json({ translatedText })

  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}