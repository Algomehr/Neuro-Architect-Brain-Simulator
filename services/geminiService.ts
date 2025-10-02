import { GoogleGenAI, Type, Chat } from "@google/genai";
import { BrainParameters, GeminiResponse, ScenarioSimulation } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formulaExplanationSchema = {
    type: Type.OBJECT,
    properties: {
        formula: { type: Type.STRING, description: "فرمول ترکیبی خطی استفاده شده برای محاسبه. باید به صورت یک رشته LaTeX معتبر باشد. مثال: 'C = (D \\times 0.6) + (P \\times 0.4)'" },
        calculation: { type: Type.STRING, description: "محاسبه گام به گام با مقادیر ورودی. باید به صورت یک رشته LaTeX معتبر باشد. مثال: 'C = (75 \\times 0.6) + (80 \\times 0.4) = 45 + 32 = 77'" },
        explanation: { type: Type.STRING, description: "توجیه علمی مختصر برای فرمول و وزن‌های انتخاب شده." }
    },
    required: ["formula", "calculation", "explanation"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        narrativeReport: { 
            type: Type.STRING, 
            description: "داستانی خلاقانه و اول شخص از یک روز معمولی این فرد. افکار، احساسات، تعاملات اجتماعی و رویکردهای حل مسئله او را توصیف کنید. باید حدود ۳-۴ پاراگراف باشد."
        },
        researcherReport: {
            type: Type.OBJECT,
            properties: {
                cognitiveAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["strengths", "weaknesses"]
                },
                bigFiveProfile: {
                    type: Type.OBJECT,
                    properties: {
                        openness: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        conscientiousness: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        extraversion: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        agreeableness: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        neuroticism: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" }
                    },
                    required: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
                },
                predispositions: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "استعدادهای بالقوه مانند اضطراب، خلاقیت بالا، افسردگی، تمرکز و غیره را فهرست کنید."
                }
            },
            required: ["cognitiveAnalysis", "bigFiveProfile", "predispositions"]
        },
        chartsData: {
            type: Type.OBJECT,
            properties: {
                radarProfile: {
                    type: Type.OBJECT,
                    properties: {
                        memory: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        creativity: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        attention: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        logic: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                        emotionalIntelligence: { type: Type.NUMBER, description: "امتیاز از ۰ تا ۱۰۰" },
                    },
                    required: ["memory", "creativity", "attention", "logic", "emotionalIntelligence"]
                },
                neurotransmitterBalance: {
                    type: Type.ARRAY,
                    description: "موجودی انتقال‌دهنده‌های عصبی. نام باید به فارسی باشد.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.NUMBER }
                        },
                        required: ["name", "value"]
                    }
                },
                stressResponseCurve: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            time: { type: Type.NUMBER, description: "نقطه زمانی، به عنوان مثال، ۰، ۱، ۲..." },
                            cortisol: { type: Type.NUMBER },
                            dopamine: { type: Type.NUMBER }
                        },
                        required: ["time", "cortisol", "dopamine"]
                    },
                    description: "سطوح را در ۸ تا ۱۰ نقطه زمانی پس از یک رویداد استرس‌زا شبیه‌سازی کنید."
                },
                brainActivityMap: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            area: { type: Type.STRING, description: "مثلاً قشر پیش‌فرونتال، آمیگدال، هیپوکامپ، استریاتوم" },
                            x: { type: Type.NUMBER, description: "مختصات بین -۱۰ و ۱۰" },
                            y: { type: Type.NUMBER, description: "مختصات بین -۱۰ و ۱۰" },
                            activity: { type: Type.NUMBER, description: "سطح فعالیت از ۰ تا ۱۰۰" },
                        },
                        required: ["area", "x", "y", "activity"]
                    },
                    description: "داده‌ها را برای ۵-۷ ناحیه کلیدی مغز ارائه دهید."
                }
            },
            required: ["radarProfile", "neurotransmitterBalance", "stressResponseCurve", "brainActivityMap"]
        },
        scientificAnalysis: {
            type: Type.OBJECT,
            properties: {
                cognitiveMetrics: {
                    type: Type.OBJECT,
                    description: "محاسبات برای هر معیار در پروفایل راداری.",
                    properties: {
                        memory: formulaExplanationSchema,
                        creativity: formulaExplanationSchema,
                        attention: formulaExplanationSchema,
                        logic: formulaExplanationSchema,
                        emotionalIntelligence: formulaExplanationSchema,
                    },
                     required: ["memory", "creativity", "attention", "logic", "emotionalIntelligence"]
                },
                personalityTraits: {
                    type: Type.OBJECT,
                    description: "محاسبات برای هر ویژگی شخصیتی Big Five.",
                    properties: {
                        openness: formulaExplanationSchema,
                        conscientiousness: formulaExplanationSchema,
                        extraversion: formulaExplanationSchema,
                        agreeableness: formulaExplanationSchema,
                        neuroticism: formulaExplanationSchema,
                    },
                    required: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]
                },
                summary: { type: Type.STRING, description: "خلاصه‌ای از مدل محاسباتی و محدودیت‌های آن." }
            },
            required: ["cognitiveMetrics", "personalityTraits", "summary"]
        }
    },
    required: ["narrativeReport", "researcherReport", "chartsData", "scientificAnalysis"]
};

const createPrompt = (params: BrainParameters): string => `
شما یک شبیه‌ساز پیشرفته علوم اعصاب و روانشناسی به نام Neuro-Architect هستید.
وظیفه شما ایجاد یک پروفایل دقیق از یک شخص بر اساس یک مغز مهندسی‌شده سفارشی است.
پارامترهای نوروشیمیایی و ساختاری زیر (که ۰ به معنای بسیار کم و ۱۰۰ به معنای بسیار زیاد است) و تعاملات پیچیده آنها را تحلیل کنید.

**پارامترهای مغز:**
- دوپامین: ${params.dopamine} (انگیزه، پاداش، تمرکز)
- سروتونین: ${params.serotonin} (خلق‌وخو، کنترل تکانه، تنظیم اضطراب)
- استیل‌کولین: ${params.acetylcholine} (یادگیری، حافظه، توجه)
- گابا (GABA): ${params.gaba} (مهارکننده، آرام‌بخش، کاهش اضطراب)
- گلوتامات: ${params.glutamate} (تحریک‌کننده، یادگیری، فعال‌سازی عصبی)
- پلاستیسیته سیناپسی: ${params.synapticPlasticity} (توانایی یادگیری و تشکیل خاطرات جدید)
- حساسیت گیرنده‌ها: ${params.receptorSensitivity} (قدرت واکنش نورون‌ها به انتقال‌دهنده‌های عصبی)
- اتصال پری‌فرونتال-آمیگدال: ${params.pfcAmygdalaConnectivity} (کنترل از بالا به پایین هیجانات و تکانه‌ها)
- کورتیزول: ${params.cortisol} (هورمون استرس، هوشیاری)
- اکسی‌توسین: ${params.oxytocin} (پیوند اجتماعی، اعتماد، همدلی)

بر اساس این پارامترها، یک تحلیل دقیق و از نظر علمی قابل قبول در قالب JSON خواسته شده تولید کنید.
تحلیل باید روشنگرانه باشد و تعامل بین پارامترهای مختلف را منعکس کند.

**بخش جدید مورد نیاز: تحلیل علمی**
علاوه بر گزارش‌های روایی و پژوهشگر، یک بخش «تحلیل علمی» ارائه دهید. در این بخش، برای هر معیار کلیدی شناختی (از پروفایل راداری) و هر ویژگی شخصیتی Big Five، یک فرمول ترکیبی خطی قابل قبول بر اساس پارامترهای ورودی ابداع کنید. فرمول و محاسبه باید به صورت رشته‌های LaTeX معتبر ارائه شوند. همچنین یک توجیه علمی مختصر برای وزن‌های انتخاب شده را نشان دهید. این بخش برای مخاطبان متخصص است، بنابراین از اصطلاحات مناسب استفاده کنید. خروجی باید کاملاً محاسباتی و تحلیلی باشد.

نکته بسیار مهم: کل خروجی JSON، شامل تمام مقادیر رشته‌ای، باید به زبان فارسی باشد.
`;

export const generateBrainProfile = async (params: BrainParameters): Promise<GeminiResponse> => {
    const prompt = createPrompt(params);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.8,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (!parsedJson.narrativeReport || !parsedJson.researcherReport || !parsedJson.chartsData || !parsedJson.scientificAnalysis) {
            throw new Error("Invalid JSON structure received from API.");
        }

        return parsedJson as GeminiResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate brain profile from Gemini API.");
    }
};

const createChatPrompt = (params: BrainParameters, result: GeminiResponse): string => `
شما یک دستیار متخصص علوم اعصاب هستید.
وظیفه شما پاسخ به سؤالات در مورد یک پروفایل مغزی شبیه‌سازی شده خاص است.
تمام پاسخ‌های شما باید کاملاً بر اساس داده‌های زیر باشد. اطلاعاتی را از خودتان اضافه نکنید و فقط بر اساس زمینه ارائه شده پاسخ دهید.
شما می‌توانید از مارک‌داون برای قالب‌بندی (مانند **پررنگ کردن**، *کج کردن*، لیست‌ها و بلوک‌های کد) و از LaTeX برای فرمول‌های ریاضی (مانند $E=mc^2$ یا $$...$$) برای ارائه پاسخ‌های واضح‌تر و غنی‌تر استفاده کنید.

اینجا داده‌ها هستند:

**1. پارامترهای ورودی مغز:**
${JSON.stringify(params, null, 2)}

**2. نتایج شبیه‌سازی:**
${JSON.stringify(result, null, 2)}

اکنون، به سؤالات کاربر در مورد این پروفایل پاسخ دهید. پاسخ‌هایتان را به زبان فارسی، واضح و آموزنده ارائه دهید.
`;

export const createChatSession = (params: BrainParameters, result: GeminiResponse): Chat => {
    const systemInstruction = createChatPrompt(params, result);
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        },
    });
    return chat;
};


// New schema for scenario simulation
const scenarioSimulationSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "روایتی دقیق و اول شخص از واکنش فرد در سناریو. شامل افکار درونی، احساسات، دیالوگ‌ها و اقدامات کلیدی او باشد. حداقل ۳ پاراگراف."
        },
        outcome: {
            type: Type.STRING,
            description: "خلاصه نتیجه نهایی سناریو و پیامدهای اصلی برای فرد."
        },
        emotionalResponseCurve: {
            type: Type.ARRAY,
            description: "نوسانات هیجانی و شناختی فرد در طول سناریو در سه نقطه کلیدی: 'شروع'، 'اواسط' و 'پایان'. مقادیر از ۰ تا ۱۰۰ هستند.",
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING }, // "شروع", "اواسط", "پایان"
                    stress: { type: Type.NUMBER },
                    focus: { type: Type.NUMBER },
                    confidence: { type: Type.NUMBER }
                },
                required: ["time", "stress", "focus", "confidence"]
            }
        },
        performanceMetrics: {
            type: Type.ARRAY,
            description: "ارزیابی عملکرد فرد در ۲-۳ معیار کلیدی مرتبط با سناریو. مقادیر از ۰ تا ۱۰۰ هستند.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.NUMBER },
                    explanation: { type: Type.STRING, description: "توضیح مختصر چرایی این امتیاز بر اساس پروفایل شخصیتی." }
                },
                required: ["name", "value", "explanation"]
            }
        }
    },
    required: ["narrative", "outcome", "emotionalResponseCurve", "performanceMetrics"]
};

const createScenarioPrompt = (params: BrainParameters, result: GeminiResponse, scenario: string): string => `
شما شبیه‌ساز پیشرفته Neuro-Architect هستید.
وظیفه شما شبیه‌سازی واکنش یک فرد با پروفایل شخصیتی و مغزی مشخص در یک سناریوی خاص است.
این شبیه‌سازی باید مستقیماً از داده‌های ارائه شده نشأت بگیرد.

**پروفایل فرد:**
1.  **پارامترهای ورودی مغز:** ${JSON.stringify(params, null, 2)}
2.  **نتایج شبیه‌سازی (گزارش پژوهشگر و شخصیت):** ${JSON.stringify(result.researcherReport, null, 2)}

**سناریوی مورد نظر:**
"${scenario}"

بر اساس این پروفایل، واکنش فرد را در سناریوی بالا شبیه‌سازی کنید.
خروجی باید یک تحلیل داستانی و داده-محور در قالب JSON خواسته شده باشد.
تمام خروجی باید به زبان فارسی باشد.
`;

export const simulateScenario = async (params: BrainParameters, result: GeminiResponse, scenario: string): Promise<ScenarioSimulation> => {
    const prompt = createScenarioPrompt(params, result, scenario);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: scenarioSimulationSchema,
                temperature: 0.9, // Higher temperature for more creative scenarios
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (!parsedJson.narrative || !parsedJson.emotionalResponseCurve) {
            throw new Error("Invalid JSON structure for scenario simulation received from API.");
        }

        return parsedJson as ScenarioSimulation;

    } catch (error) {
        console.error("Error calling Gemini API for scenario simulation:", error);
        throw new Error("Failed to generate scenario simulation from Gemini API.");
    }
};