'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function uploadResume(data: FormData) {
    const file: File | null = data.get('file') as unknown as File
    if (!file) {
        throw new Error('No file uploaded')
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const rootDir = process.cwd();
    const path = join(rootDir, 'lib', 'data', file.name);

    await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)

    return { filePath: path, success: true }
}