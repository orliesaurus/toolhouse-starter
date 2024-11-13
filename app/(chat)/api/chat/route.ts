import { Toolhouse } from '@toolhouseai/sdk';
import {
  convertToCoreMessages,
  CoreTool,
  Message,
  StreamData,
  streamObject,
  streamText,
} from 'ai';
import { z } from 'zod';


import { customModel } from '@/ai';
import { models } from '@/ai/models';
import { systemPrompt } from '@/ai/prompts';
import {
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

const toolhouse = new Toolhouse({
  apiKey: process.env.TOOLHOUSE_API_KEY,
  provider: 'vercel',
  metadata: {
    timezone: '0',
    id: 'daniele'
  }
});

const getToolhouseTools = async (bundle: string = 'default'): Promise<Record<string, CoreTool<any, any>>> =>
    await toolhouse.getTools(bundle) as Record<string, CoreTool<any, any>>;

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const streamingData = new StreamData();

  const result = await streamText({
    model: model.model,
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 128,
    tools: await getToolhouseTools(),
    onFinish: async ({ responseMessages }) => {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);

        } catch (error) {
          console.error('Failed to save chat');
        }

      streamingData.close();
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}