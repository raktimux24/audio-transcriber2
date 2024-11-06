import { NextResponse } from 'next/server';
import getConfig from 'next/config';

export async function GET() {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
  
  return NextResponse.json({
    processEnv: !!process.env.GOOGLE_API_KEY,
    processEnvLength: process.env.GOOGLE_API_KEY?.length,
    serverConfig: !!serverRuntimeConfig.GOOGLE_API_KEY,
    serverConfigLength: serverRuntimeConfig.GOOGLE_API_KEY?.length,
    publicConfig: !!publicRuntimeConfig.GOOGLE_API_KEY,
    publicConfigLength: publicRuntimeConfig.GOOGLE_API_KEY?.length,
    nodeEnv: process.env.NODE_ENV
  });
} 