import { GoogleGenAI, Chat } from "@google/genai";
import { UserData, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
let chat: Chat | null = null;

const initializeChat = (userData: UserData) => {
    const systemInstruction = `You are an expert AI Fitness Coach. Your user's profile is as follows:
- Fitness Goal: ${userData.fitness_goal || 'Not set'}
- Fitness Level: ${userData.fitness_level || 'Not set'}
- Age: ${userData.age || 'Not set'}
- Current Weight (kg): ${userData.current_weight || 'Not set'}
- Goal Weight (kg): ${userData.goal_weight || 'Not set'}
- Height (cm): ${userData.height || 'Not set'}

Your role is to provide encouraging, helpful, and safe fitness advice. Keep your responses concise and motivational. Base your advice on the user's profile. Do not give medical advice.`;

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

export const generateChatResponseStream = async (
    newMessage: string,
    history: ChatMessage[],
    userData: UserData
) => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    try {
        if (!chat) {
            initializeChat(userData);
        }
        
        const response = await chat!.sendMessageStream({ message: newMessage });
        return response;

    } catch (error) {
        console.error("Error generating chat response from Gemini:", error);
        chat = null; // Reset chat on error
        throw new Error("I'm having some trouble connecting. Please try again later.");
    }
};