import { NextResponse } from 'next/server';
import axios from 'axios';

type Roadmap = {
  phases: Array<{
    name: string;
    timeline: string;
    tasks: string[];
  }>;
};

export async function POST(request: Request) {
  try {
    const { appName, purpose, features } = await request.json();

    // Optimized prompt for DeepSeek
    const prompt = `
    Act as a senior product manager and generate a comprehensive MVP roadmap for a ${appName} app. 
    Purpose: ${purpose}. 
    Features: ${features.join(", ")}. 
    
    Your response must be in JSON format with the following structure:
    {
      "phases": [
        {
          "name": "Phase name",
          "timeline": "Estimated duration",
          "tasks": [
            "Task 1 ",
            "Task 2 "
          ],
          "milestones": [
            "Milestone 1 ",
            "Milestone 2 "
          ]
        }
      ]
    }
    
    Key Requirements:
    - Use clear and simple language suitable for all audiences, avoiding jargon or technical terms.
    - Break down tasks into small, actionable steps that are easy to execute.
    - Include measurable and specific milestones for each phase to track progress.
    - Be creative and professional, ensuring the roadmap balances strategic vision with practicality.
    - The roadmap should prioritize delivering a functional MVP with the smallest viable set of features.
    - Ensure the plan is realistic and actionable for a cross-functional team.
    
    Remember, the goal is to create a roadmap that sets clear expectations, minimizes risks, and facilitates iterative development while focusing on delivering value to users.
    `;
    

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions', // DeepSeek endpoint
      {
        model: 'deepseek-chat', // Confirm correct model name
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Validate response
    const rawData = response.data.choices[0].message.content;
    const parsedData: Roadmap = JSON.parse(rawData);

    if (!parsedData.phases || !Array.isArray(parsedData.phases)) {
      throw new Error("Invalid roadmap format from DeepSeek");
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("DeepSeek API Error:", {
      error: error.message,
      response: error.response?.data,
    });
    return NextResponse.json(
      { error: 'Failed to generate roadmap. Contact support if billing is active.' },
      { status: 500 }
    );
  }
}