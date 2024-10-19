import fs from "fs";
import Groq from "groq-sdk";
import * as path from 'path';

const groq = new Groq();

async function speechToText(filePath: string) {
  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "distil-whisper-large-v3-en",
    response_format: "json",
    language: "en",
    temperature: 0.0,
  });

  console.log("Checking filePath in speechToText:", filePath);

  console.log(transcription.text);
  writeToFile(transcription.text, filePath);
}

function writeToFile(content: string, filePathMP3: string): void {
  try {
    // const filePath = path.join(process.cwd(), 'lib', 'data', 'audio', 'interview_audio.txt');
    const filePath = filePathMP3.replace('.mp3', '.txt')
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File written successfully: ${filePath}`);
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

export default speechToText;