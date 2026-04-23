import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
// The API key is automatically injected by the AI Studio environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeGameVibe(gameTitle: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un editor experto de videojuegos de ChronsGamingtv. Resume la "vibra" o esencia del juego "${gameTitle}" en un párrafo corto y atractivo de no más de 3 oraciones. Usa un tono entusiasta y profesional.`,
    });
    
    return response.text || 'No se pudo generar el resumen.';
  } catch (error) {
    console.error('Error generating game vibe:', error);
    return 'Error al conectar con el asistente de IA.';
  }
}
