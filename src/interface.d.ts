export interface OpenAIResp {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: string;
}

export interface Choice {
  index: number;
  message: Message;
  logprobs: null;
  finish_reason: string;
}

export interface Message {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export type DestinationCallback = (error: Error | null, destination: string) => void
export type FileNameCallback = (error: Error | null, filename: string) => void
