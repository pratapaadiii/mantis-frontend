import { NextResponse } from 'next/server';
import axios from 'axios';

type RoadmapPhase = {
  name: string;
  timeline: string;
  tasks: string[];
  milestones: string[];
};

type Roadmap = {
  phases: RoadmapPhase[];
};

type RoadmapRequest = {
  appName: string;
  purpose: string;
  features: string[];
  preferences?: {
    timeline?: 'aggressive' | 'moderate' | 'conservative';
    complexity?: 'basic' | 'standard' | 'advanced';
    teamSize?: number;
  };
};

type DeepSeekError = {
  code: number;
  message: string;
  type?: string;
  param?: string;
};

const DEEPSEEK_ERROR_MAP: { [key: number]: string } = {
  400: 'Invalid request parameters - check your input format',
  401: 'Authentication failed - check your API key',
  402: 'Payment required - insufficient balance',
  403: 'Forbidden - check model permissions',
  404: 'Model not found',
  429: 'Rate limit exceeded - slow down requests',
  500: 'Internal server error - try again later',
  503: 'Service unavailable - check system status',
};

const JSON_RETRY_PROMPT = `Fix this JSON syntax error and return only valid JSON:`;

export async function POST(request: Request) {
  try {
    const { appName, purpose, features, preferences = {} }: RoadmapRequest = await request.json();

    // Enhanced input validation with more specific feedback
    if (!appName?.trim() || appName.length < 3) {
      return NextResponse.json(
        { 
          error: 'Invalid app name',
          requirements: {
            minLength: 3,
            example: "Coffee Tracker Pro"
          }
        },
        { status: 400 }
      );
    }

    if (!purpose?.trim() || purpose.length < 20) {
      return NextResponse.json(
        { 
          error: 'Purpose must be at least 20 characters',
          example: "Create a fitness app that tracks workouts and provides personalized recommendations",
          currentLength: purpose?.length || 0
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(features) || features.length < 3 || features.some(f => typeof f !== 'string')) {
      return NextResponse.json(
        { 
          error: 'Please provide 3-5 core features as strings',
          example: ["Workout Tracking", "Meal Planner", "Progress Analytics"],
          requirements: {
            minFeatures: 3,
            maxFeatures: 5,
            type: 'string array'
          }
        },
        { status: 400 }
      );
    }

    // Optimized system prompt
    const systemMessage = {
      role: 'system',
      content: `You are a JSON API endpoint. Respond ONLY with:
      {
        "phases": [
          {
            "name": "Phase Name",
            "timeline": "Duration (e.g., "2 weeks")",
            "tasks": ["Day 1: Action", "Day 2: Action"],
            "milestones": ["Complete X", "Launch Y"]
          }
        ]
      }
      RULES:
      1. Timeline format: <number>[optional -<number>] weeks
      2. Milestones start with verbs
      3. No markdown/comments
      4. Escape special characters
      5. Validate JSON syntax
      6. Adjust complexity based on team size and preferences`
    };

    const userPrompt = `Generate MVP roadmap for ${appName}
    Purpose: ${purpose}
    Features: ${features.join(', ')}
    Timeline Preference: ${preferences.timeline || 'moderate'}
    Project Complexity: ${preferences.complexity || 'standard'}
    Team Size: ${preferences.teamSize || 'not specified'}
    
    Required:
    - Phases with clear timelines
    - Daily actionable tasks
    - Measurable milestones
    - Complexity-appropriate tasks`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-reasoner',
        messages: [systemMessage, { role: 'user', content: userPrompt }],
        temperature: 0.3,
        max_tokens: 4096,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 50000
      }
    );

    // Process response
    let rawData = response.data.choices[0].message.content;
    rawData = sanitizeJsonResponse(rawData);
    
    const parsedData = await parseWithRetry(rawData);
    validateRoadmapStructure(parsedData);

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Roadmap Generation Error:", error.message);
    return handleErrorResponse(error);
  }
}

function sanitizeJsonResponse(rawData: string): string {
  return rawData
    .replace(/```json|```/g, '')
    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
    .replace(/'/g, '"')
    .replace(/(\d+)\s*-\s*(\d+)/g, '$1-$2')
    .replace(/,\s*([}\]])/g, '$1')
    .trim();
}

async function parseWithRetry(rawData: string): Promise<Roadmap> {
  try {
    return JSON.parse(rawData);
  } catch (parseError) {
    console.warn('JSON Parse Error - Attempting correction...');
    
    try {
      const correctionResponse = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-reasoner',
          messages: [
            { role: 'user', content: `${JSON_RETRY_PROMPT}\n${rawData}` }
          ],
          temperature: 0.1,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );

      const correctedData = sanitizeJsonResponse(
        correctionResponse.data.choices[0].message.content
      );
      
      return JSON.parse(correctedData);
    } catch (retryError) {
      throw new Error(`Failed to parse JSON after retry: ${retryError.message}`);
    }
  }
}

function validateRoadmapStructure(data: Roadmap): void {
  if (!data?.phases?.length) {
    throw new Error('No phases generated in roadmap');
  }

  let totalWeeks = 0;
  
  data.phases.forEach((phase, index) => {
    if (!/^\d+(-\d+)?\s+weeks?$/i.test(phase.timeline)) {
      throw new Error(
        `Invalid timeline in "${phase.name}": "${phase.timeline}". ` +
        `Expected format like "2 weeks" or "3-4 weeks".`
      );
    }

    const [min, max] = phase.timeline.match(/\d+/g)!.map(Number);
    totalWeeks += max || min;

    if (!phase.tasks?.length || phase.tasks.length < 3) {
      throw new Error(`Phase "${phase.name}" requires at least 3 tasks`);
    }

    if (!phase.milestones?.length || phase.milestones.length < 2) {
      throw new Error(`Phase "${phase.name}" requires at least 2 milestones`);
    }

    if (!phase.milestones.every(m => /^[A-Z]/.test(m))) {
      throw new Error(`Milestones in "${phase.name}" must start with verbs`);
    }
  });

  if (totalWeeks > 52) {
    throw new Error('Total roadmap duration exceeds 1 year - please reduce scope');
  }
}

function handleErrorResponse(error: any): NextResponse {
  // Handle timeline validation errors
  if (error.message.includes('Invalid timeline')) {
    return NextResponse.json(
      {
        error: error.message,
        examples: ["2 weeks", "3-4 weeks", "1 week"],
        fixTip: "Use numbers followed by 'week(s)' without dates"
      },
      { status: 422 }
    );
  }

  if (error.message.includes('exceeds 1 year')) {
    return NextResponse.json(
      {
        error: error.message,
        suggestion: 'Consider breaking the project into smaller releases',
        maxDuration: '52 weeks'
      },
      { status: 422 }
    );
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: 'Invalid JSON format from API',
        commonIssues: [
          'Special characters in feature names',
          'Missing quotes around keys'
        ],
        solutions: [
          'Wrap special terms in quotes',
          'Simplify complex descriptions'
        ]
      },
      { status: 422 }
    );
  }

  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status || 500;
    const errorData: DeepSeekError = error.response?.data?.error || {
      code: statusCode,
      message: error.message,
    };

    return NextResponse.json(
      {
        error: DEEPSEEK_ERROR_MAP[statusCode] || errorData.message,
        code: errorData.code,
        type: errorData.type,
        documentation: `https://api-docs.deepseek.com/errors/${errorData.code}`
      },
      { status: statusCode }
    );
  }

  // Handle custom validation errors
  if (error.message.includes('requires at least')) {
    return NextResponse.json(
      { error: error.message },
      { status: 422 }
    );
  }

  // Fallback error
  return NextResponse.json(
    { 
      error: 'Failed to generate roadmap',
      supportContact: 'support@mantis.com',
      incidentCode: Date.now()
    },
    { status: 500 }
  );
}