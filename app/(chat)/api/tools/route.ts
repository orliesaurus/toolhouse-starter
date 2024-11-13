import { Toolhouse } from '@toolhouseai/sdk';
import { CoreTool } from 'ai';
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

export async function GET(request: Request) {
  const tools = await getToolhouseTools();
  return Response.json(Object.keys(tools), { status: 200 });
}