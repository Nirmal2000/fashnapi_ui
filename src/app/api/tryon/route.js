import { initializeTryOnTask, pollTaskStatus } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log("DEI")
    const payload = await request.json();
    const apiToken = request.headers.get('Authorization')?.split(' ')[1];

    if (!apiToken) {
      return NextResponse.json(
        { error: 'API token is required' },
        { status: 401 }
      );
    }

    if (!payload.model_image || !payload.garment_image) {
      return NextResponse.json(
        { error: 'Both model_image and garment_image are required' },
        { status: 400 }
      );
    }

    // Start try-on task
    const taskId = await initializeTryOnTask(payload, apiToken);
    
    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const statusResult = await pollTaskStatus(taskId, apiToken);
      
      if (statusResult.status === 'completed') {
        return NextResponse.json({
          status: 'completed',
          url: statusResult.url
        });
      }
      
      // Wait 2 seconds between polls
      await new Promise(r => setTimeout(r, 2000));
      attempts++;
    }

    return NextResponse.json(
      { error: 'Processing timeout' },
      { status: 408 }
    );

  } catch (error) {
    console.error('Try-on error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message.includes('Failed to start') ? 400 : 500 }
    );
  }
}