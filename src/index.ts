import OpenAI from "openai";
require("dotenv").config()
import express, { Application, NextFunction, Request, Response } from "express";


const app: Application = express();
app.use(express.json());

let conversationHistory: string = "";

const openai = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
});

const modelGPT = "gpt-3.5-turbo";

app.post("/api", async (req: Request, res: Response) => {

  const message: string = req.body.message;
  conversationHistory += message + "\n";
  let aiResponse: string = "";

  try {
    const response: any = await openai.chat.completions.create({
      model: modelGPT,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        // { role: "user", content: "You are a helpful assistant." },
        { role: "assistant", content: conversationHistory },
      ],
      // response_format: { "type": "json_object" },
      stream: true,
      temperature: 0.2
    });

    for await (const part of response) {
      aiResponse = part.choices[0]?.delta?.content || "";
      conversationHistory += aiResponse + "\n";
      res.write(aiResponse);
    };

    res.end();

  } catch (error: any) {
    res.status(500).send("error al procesar la solicitud");
    console.log(error.message);
  }
});


export default app;
