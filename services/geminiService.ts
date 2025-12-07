
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Proposal, QuizQuestion, VerificationReport } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

export const generateQuizForProposal = async (proposal: Proposal): Promise<QuizQuestion[]> => {
  const prompt = `
    Génère un quiz de 3 questions (QCM) pour vérifier si l'utilisateur a bien lu et compris la proposition citoyenne suivante.
    Le quiz doit être impartial et factuel, basé uniquement sur le résumé, les pour et les contre fournis.
    
    Titre: ${proposal.title}
    Résumé: ${proposal.summary}
    Arguments Pour: ${proposal.pros.join(', ')}
    Arguments Contre: ${proposal.cons.join(', ')}
  `;

  const quizSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.INTEGER },
        question: { type: Type.STRING, description: "La question posée au citoyen" },
        options: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "4 choix de réponse possibles"
        },
        correctOptionIndex: { 
          type: Type.INTEGER, 
          description: "L'index (0-3) de la bonne réponse dans le tableau options" 
        }
      },
      required: ["id", "question", "options", "correctOptionIndex"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "Tu es un assistant civique neutre chargé de vérifier la compréhension des électeurs avant un vote. Tes questions doivent être simples mais précises.",
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.3
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("Pas de réponse texte de Gemini");
  } catch (error) {
    console.error("Erreur lors de la génération du quiz:", error);
    return [
      {
        id: 1,
        question: "Question de secours (Erreur IA)",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctOptionIndex: 0
      }
    ];
  }
};

export const verifyAndSummarizeArguments = async (
  title: string, 
  majorityArgs: string, 
  oppositionArgs: string
): Promise<{ summary: string, pros: string[], cons: string[], report: VerificationReport }> => {
  
  const prompt = `
    Analyse les argumentaires politiques suivants concernant la proposition : "${title}".
    
    Argumentaire Majorité : "${majorityArgs}"
    Argumentaire Opposition : "${oppositionArgs}"

    Taches:
    1. Synthétise un résumé neutre et factuel de la proposition globale.
    2. Extrais les arguments "Pour" (bénéfices) clairs et distincts.
    3. Extrais les arguments "Contre" (risques/coûts) clairs et distincts.
    4. VÉRIFICATION DES FAITS (Fact Checking) : Utilise Google Search pour vérifier la véracité des affirmations (chiffres, lois, antécédents).
    Si une affirmation semble exagérée ou fausse, signale-le dans le rapport d'analyse.
    
    Génère une réponse JSON structurée.
  `;

  // We define a loose schema or parse the JSON manually to allow flexibility with grounding chunks
  // But for Gemini 2.5 Flash with Grounding, we often get text + grounding metadata. 
  // However, we can ask for JSON output *and* use tools.

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Search for verification
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            neutralSummary: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            factCheckAnalysis: { type: Type.STRING, description: "Un paragraphe expliquant la véracité des propos, signalant les fake news potentielles ou les contextes manquants." }
          },
          required: ["neutralSummary", "pros", "cons", "factCheckAnalysis"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    
    // Extract sources from grounding metadata if available
    const sources: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach(chunk => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.title ? `${chunk.web.title} (${chunk.web.uri})` : chunk.web.uri);
        }
      });
    }

    return {
      summary: json.neutralSummary,
      pros: json.pros,
      cons: json.cons,
      report: {
        neutralSummary: json.neutralSummary,
        factCheckAnalysis: json.factCheckAnalysis,
        sources: sources
      }
    };

  } catch (error) {
    console.error("Erreur Fact Checking:", error);
    throw error;
  }
};
