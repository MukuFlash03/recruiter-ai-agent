import speechToText from '@/lib/operations/speechToText'
import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
    const data = await request.json()
    const audioData = data.audioData
    // const fileName = `interview_audio_${Date.now()}.mp3`
    const fileName = `interview_audio.mp3`
    const filePath = path.join(process.cwd(), 'lib', 'data', 'audio', fileName)
    speechToText(filePath)

    try {
        const buffer = Buffer.from(audioData.split(',')[1], 'base64')
        fs.writeFileSync(filePath, buffer)
        return NextResponse.json({ message: 'File saved successfully', fileName })
    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json({ message: 'Error saving file' }, { status: 500 })
    }
}
export const dynamic = 'force-static'; 