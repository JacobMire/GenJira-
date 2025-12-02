import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";
import { AIResponse, Priority } from '../types';

// Safe access to process.env
const env = typeof process !== 'undefined' ? process.env : {};
const apiKey = env.API_KEY || '';

// Schema for a SINGLE task enhancement
const enhanceTaskSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    improvedTitle: { type: Type.STRING, description: "A concise, action-oriented title for the task." },
    improvedDescription: { type: Type.STRING, description: "A professional, detailed description of the task using agile user story format if applicable." },
    acceptanceCriteria: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of 3-5 clear acceptance criteria."
    },
    suggestedTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-4 relevant short tags (e.g., 'Frontend', 'Bug', 'Optimization')."
    },
    estimatedStoryPoints: {
      type: Type.INTEGER,
      description: "Fibonacci number estimation (1, 2, 3, 5, 8, 13) based on complexity."
    }
  },
  required: ["improvedTitle", "improvedDescription", "acceptanceCriteria", "suggestedTags", "estimatedStoryPoints"]
};

// Schema for BULK task generation
const taskListSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      priority: { type: Type.STRING, enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL] },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      storyPoints: { type: Type.INTEGER }
    },
    required: ["title", "description", "priority", "tags"]
  }
};

export const enhanceTaskWithAI = async (title: string, description: string): Promise<AIResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert Agile Product Manager. Please analyze the following task draft and enhance it.
      
      Current Title: "${title}"
      Current Description: "${description}"
      
      Provide a more professional title, a structured description (User Story format), acceptance criteria, relevant tags, and story point estimation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: enhanceTaskSchema,
        systemInstruction: "You are a helpful assistant that improves Jira tickets. Be concise but thorough.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("AI Enhancement failed:", error);
    throw error;
  }
};

export interface BulkTaskResponse {
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  storyPoints: number;
}

export const generateTasksFromText = async (rawText: string): Promise<BulkTaskResponse[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Analyze the following raw text/notes and break them down into individual actionable tasks.
      For each task, provide a title, a brief description, an estimated priority, relevant tags, and story points (Fibonacci).
      
      Raw Input:
      "${rawText}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: taskListSchema,
        systemInstruction: "You are a project manager converting meeting notes into Jira tickets. Split distinct items into separate tasks.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as BulkTaskResponse[];
  } catch (error) {
    console.error("Bulk Generation failed:", error);
    throw error;
  }
};