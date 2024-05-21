import OpenAI from "openai";
import express, { Application, Request, Response } from "express";
import { verifyHeader } from "./middleware";
import { Readable } from "stream"
import { toFile } from "openai/uploads";
import "dotenv/config"


const app: Application = express();
app.use(express.json());
app.use(verifyHeader);

const port = process.env.PORT || " 3000"

const modelGPT = "gpt-3.5-turbo";

let conversationHistory: string = "";

const openai = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
});

app.post("/api", async (req: Request, res: Response) => {

  const message: string = req.body.message;
  conversationHistory += message + "\n";
  let aiResponse: string = ""

  try {
    const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
      model: modelGPT,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        // { role: "user", content: "You are a helpful assistant." },
        { role: "assistant", content: conversationHistory },
      ],
      // response_format: { "type": "json_object" },
      temperature: 0.2
    });

    if (response) {
      aiResponse = response?.choices[0]?.message?.content || "";
      conversationHistory += aiResponse + "\n";

      res.status(200).send(aiResponse);
      res.end();
    }
    res.end();

  } catch (error: any) {
    res.status(500).send(`error al procesar la solicitud--> ${error.message}`);
  }
});


app.post("/api/atranscription", async (req: Request, res: Response) => {
  try {
    const chunks: Buffer[] = []
    req.on('data', async (chunk: Buffer) => {
      chunks.push(chunk)
    });
    req.on('end', async () => {
      const buffer: Buffer = Buffer.concat(chunks)
      const convertedAudio = await toFile(Readable.from(buffer), 'audio.mp3') as File;
      const transcription: OpenAI.Audio.Transcription = await openai.audio.transcriptions.create({
        file: convertedAudio,
        model: "whisper-1"
      });
      res.status(200).send(transcription.text);
    })

  } catch (error: any) {
    res.status(500).send(`Error alprocesar el audio-->${error.message}`)
  }
});


app.listen(port, () => {
  console.log(`App en el puerto ${port}`);
});

export default app;
