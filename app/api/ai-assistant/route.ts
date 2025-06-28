import { NextRequest, NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-4.1';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'GitHub API token not set.' }, { status: 500 });
    }

    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );

    const systemPrompt = 'You are a helpful AI writing assistant for a personal blog. Your tone is modest, cozy, and professional. Always keep responses friendly, clear, and supportive.';

    const response = await client.path('/chat/completions').post({
      body: {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        top_p: 1,
        model: model
      }
    });

    if (isUnexpected(response)) {
      return NextResponse.json({ error: response.body.error?.message || 'GitHub AI API error.' }, { status: 500 });
    }

    const aiContent = response.body.choices?.[0]?.message?.content || '';
    return NextResponse.json({ content: aiContent });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 