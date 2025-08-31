import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../../components/ui/Toast';
import { ai } from '../../../lib/gemini';
import { Type } from '@google/genai';
import { LogoGenerationInputs, GeneratedLogo } from '../../../types/logo';
import LogoInputForm from '../../../components/generator/logo/LogoInputForm';
import LogoPreviewGrid from '../../../components/generator/logo/LogoPreviewGrid';

const LogoGeneratorPage = () => {
    const { toast } = useToast();
    const [inputs, setInputs] = useState<LogoGenerationInputs>({
        companyName: 'Starlight Innovations',
        industry: 'Technology',
        style: 'modern',
        colors: 'Deep blue and vibrant purple',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [logos, setLogos] = useState<GeneratedLogo[]>([]);

    const handleGenerateLogos = async () => {
        setIsLoading(true);
        setLogos([]);
        try {
            const prompt = `Generate 4 unique, professional SVG logo concepts for a company named '${inputs.companyName}'.
The company is in the '${inputs.industry}' industry.
The desired style is '${inputs.style}'.
Use a color palette based on '${inputs.colors}'.
The output must be a valid JSON array where each object has a single key "svg" containing the complete, clean, and optimized SVG code as a string. Do not include any backticks or 'svg' language specifiers in the SVG string.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                svg: {
                                    type: Type.STRING,
                                    description: "The complete SVG code for the logo as a string.",
                                },
                            },
                            required: ["svg"],
                        },
                    },
                },
            });

            const parsedLogos = JSON.parse(response.text);
            if (Array.isArray(parsedLogos)) {
                setLogos(parsedLogos);
                toast({ title: "Success", description: "Logo concepts generated successfully!" });
            } else {
                 throw new Error("Invalid response format from AI.");
            }
        } catch (error: any) {
            console.error("Error generating logos:", error);
            toast({ title: "Generation Failed", description: error.message || "Could not generate logos. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
        >
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">AI Logo Generator</h1>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                    <LogoInputForm
                        inputs={inputs}
                        setInputs={setInputs}
                        isLoading={isLoading}
                        onGenerate={handleGenerateLogos}
                    />
                </div>
                <div className="lg:col-span-9 flex flex-col p-4 bg-muted/20 rounded-lg">
                    <LogoPreviewGrid logos={logos} isLoading={isLoading} />
                </div>
            </div>
        </motion.div>
    );
};

export default LogoGeneratorPage;
