import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
// The API key is automatically injected by the AI Studio environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI(apiKey) : null;

export async function summarizeGameVibe(gameTitle: string): Promise<string> {
  try {
    if (!ai) {
      console.warn('GEMINI_API_KEY is not set.');
      return 'Resumen no disponible (falta clave de API).';
    }
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`Eres un editor experto de videojuegos de ChronsGamingtv. Resume la "vibra" o esencia del juego "${gameTitle}" en un párrafo corto y atractivo de no más de 3 oraciones. Usa un tono entusiasta y profesional.`);
    const response = await result.response;
    return response.text() || 'No se pudo generar el resumen.';
  } catch (error) {
    console.error('Error generating game vibe:', error);
    return 'Error al conectar con el asistente de IA.';
  }
}
