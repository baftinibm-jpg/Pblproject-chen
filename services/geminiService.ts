
import { GoogleGenAI, Chat } from "@google/genai";

// Per Gemini API guidelines, the API key is retrieved directly from environment variables.
// The app's UI is responsible for handling cases where the key might be missing.
const API_KEY = process.env.API_KEY;
export const isApiKeySet = !!API_KEY;

let chat: Chat | null = null;

if (isApiKeySet) {
  // FIX: Initialize the AI client and chat session only if the API key is available.
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a friendly and encouraging AI Study Tutor named 'FocusFlow'. 
    Your goal is to help users understand concepts, solve problems, and stay motivated. 
    Keep your answers clear, concise, and easy to understand. 
    Use formatting like markdown for lists, code blocks, and emphasis to improve readability. 
    Be supportive and patient.`,
    },
  });
}

export const chatSession = chat;
