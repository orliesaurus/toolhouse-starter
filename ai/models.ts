// Define your models here.
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { LanguageModelV1 } from "ai";

export interface Model {
  id: string;
  label: string;
  model: LanguageModelV1;
}

export const models: Array<Model> = [
  {
    id: 'llama-3.2-90b-vision-preview',
    label: 'Llama 3.2 90B Preview (Groq)',
    model: groq('llama-3.2-90b-vision-preview'),
  },
  {
    id: 'llama-3.2-11b-vision-preview',
    label: 'Llama 3.2 11B Preview (Groq)',
    model: groq('llama-3.2-11b-vision-preview'),
  },
  {
    id: 'llama-3.2-3b-preview',
    label: 'Llama 3.2 3B (Groq)',
    model: groq('llama-3.2-3b-preview'),
  },
  {
    id: 'llama-3.2-1b-preview',
    label: 'Llama 3.2 1B (Groq)',
    model: groq('llama-3.2-1b-preview'),
  },
  {
    id: 'claude-3-5-sonnet-latest',
    label: 'Claude 3.5 Sonnet',
    model: anthropic('claude-3-5-sonnet-latest'),
  },
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    model: openai('gpt-4o-mini'),
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    model: openai('gpt-4o'),
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'claude-3-5-sonnet-latest';
