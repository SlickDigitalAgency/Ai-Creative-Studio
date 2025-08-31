import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Konva from 'konva';
import ThumbnailInputForm from '../../../components/generator/youtube/ThumbnailInputForm';
import ThumbnailPreview from '../../../components/generator/youtube/ThumbnailPreview';
import StyleControls from '../../../components/generator/youtube/StyleControls';
import { ai } from '../../../lib/gemini';
import { useToast } from '../../../components/ui/Toast';
import { Modality, Type } from '@google/genai';
import { Button } from '../../../components/ui/Button';

export interface ThumbnailStyle {
  titleColor: string;
  titleFontSize: number;
  subtitleColor: string;
  subtitleFontSize: number;
}

export interface ThumbnailTemplate {
    id: string;
    name: string;
    previewUrl: string;
    data: {
        title: string;
        subtitle: string;
        aiPrompt: string;
        style: ThumbnailStyle;
    };
}

export interface AssetMetadata {
    tags: string[];
    category: string;
    colorPalette: string[];
}


const templates: ThumbnailTemplate[] = [
    {
        id: 'template-1',
        name: 'Modern Tech',
        previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=400&auto=format&fit=crop',
        data: {
            title: 'NEW GADGET!',
            subtitle: 'This Changes Everything',
            aiPrompt: 'Clean, minimalist technology background with a blue and purple gradient',
            style: {
                titleColor: '#FFFFFF',
                titleFontSize: 90,
                subtitleColor: '#a7ff83',
                subtitleFontSize: 60,
            },
        },
    },
    {
        id: 'template-2',
        name: 'Gaming Clash',
        previewUrl: 'https://images.unsplash.com/photo-1542773998-9325f0a098d7?q=80&w=400&auto=format&fit=crop',
        data: {
            title: 'EPIC BATTLE',
            subtitle: 'WORLD RECORD GAME',
            aiPrompt: 'Explosive, high-energy gaming background with fire and lightning effects',
            style: {
                titleColor: '#FFD166',
                titleFontSize: 100,
                subtitleColor: '#FFFFFF',
                subtitleFontSize: 45,
            },
        },
    },
     {
        id: 'template-3',
        name: 'Lifestyle Vlog',
        previewUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=400&auto=format&fit=crop',
        data: {
            title: 'A DAY IN MY LIFE',
            subtitle: 'Come with me!',
            aiPrompt: 'Aesthetic, cozy and warm interior of a modern apartment, with soft lighting',
            style: {
                titleColor: '#333333',
                titleFontSize: 85,
                subtitleColor: '#555555',
                subtitleFontSize: 55,
            },
        },
    },
];


const ThumbnailGeneratorPage = () => {
    const { toast } = useToast();
    const stageRef = useRef<Konva.Stage>(null);
    const [title, setTitle] = useState('My Awesome Video');
    const [subtitle, setSubtitle] = useState('You WON\'T BELIEVE what happens next!');
    const [headshot, setHeadshot] = useState<string | null>(null);
    const [background, setBackground] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('A neon hologram of a cat driving at top speed');
    const [isLoading, setIsLoading] = useState(false);
    const [isRemovingBackground, setIsRemovingBackground] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [assetMetadata, setAssetMetadata] = useState<AssetMetadata | null>(null);
    const [style, setStyle] = useState<ThumbnailStyle>({
        titleColor: '#FFFFFF',
        titleFontSize: 80,
        subtitleColor: '#FFD166',
        subtitleFontSize: 50,
    });

    const handleGenerateBackground = async () => {
        if (!aiPrompt) {
            toast({ title: "Error", description: "Please enter a prompt for the background.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setBackground(null);
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: aiPrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '16:9',
                },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setBackground(imageUrl);
            toast({ title: "Success", description: "Background generated successfully!" });
        } catch (error) {
            console.error("Error generating image:", error);
            toast({ title: "Generation Failed", description: "Could not generate background. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveBackground = async () => {
        if (!headshot) {
            toast({ title: "Error", description: "Please upload a headshot first.", variant: "destructive" });
            return;
        }
        setIsRemovingBackground(true);
        try {
            const match = headshot.match(/^data:(image\/\w+);base64,(.*)$/);
            if (!match) {
                throw new Error("Invalid image format.");
            }
            const [, mimeType, data] = match;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data, mimeType } },
                        { text: 'Remove the background of the main subject. The output must have a transparent background.' },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

            if (imagePart && imagePart.inlineData) {
                const newMimeType = imagePart.inlineData.mimeType;
                const newBase64Data = imagePart.inlineData.data;
                const newImageUrl = `data:${newMimeType};base64,${newBase64Data}`;
                setHeadshot(newImageUrl);
                toast({ title: "Success", description: "Background removed successfully!" });
            } else {
                const textPart = response.candidates?.[0]?.content?.parts.find(part => part.text);
                const errorMessage = textPart?.text || "Could not find the edited image in the response.";
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error("Error removing background:", error);
            toast({ title: "Background Removal Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
        } finally {
            setIsRemovingBackground(false);
        }
    };

    const handleAnalyzeAsset = async (base64Image: string) => {
        setIsAnalyzing(true);
        setAssetMetadata(null);
        try {
            const match = base64Image.match(/^data:(image\/\w+);base64,(.*)$/);
            if (!match) throw new Error("Invalid image format.");
            const [, mimeType, data] = match;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: {
                    parts: [
                        { inlineData: { data, mimeType } },
                        { text: "Analyze this image for an asset management system. Provide relevant tags, a single category, and the 5 most dominant hex color codes. Respond ONLY with a valid JSON object." }
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            tags: { type: Type.ARRAY, items: { type: Type.STRING, description: "Relevant tags for the image content." } },
                            category: { type: Type.STRING, description: "A single, descriptive category for the image." },
                            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING, description: "An array of 5 dominant hex color codes." } }
                        },
                        required: ["tags", "category", "colorPalette"]
                    },
                },
            });

            const parsed = JSON.parse(response.text);
            setAssetMetadata(parsed);
            toast({ title: "Analysis Complete", description: "AI has tagged and categorized your asset." });
        } catch (error: any) {
            console.error("Error analyzing asset:", error);
            toast({ title: "Asset Analysis Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExport = () => {
        if (stageRef.current) {
            const uri = stageRef.current.toDataURL({ mimeType: 'image/png', quality: 1, pixelRatio: 1 });
            const link = document.createElement('a');
            link.download = 'thumbnail.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Success", description: "Thumbnail exported successfully!" });
        } else {
            toast({ title: "Export Failed", description: "Could not export thumbnail. Please try again.", variant: "destructive" });
        }
    };

     const handleSelectTemplate = (template: ThumbnailTemplate) => {
        setTitle(template.data.title);
        setSubtitle(template.data.subtitle);
        setAiPrompt(template.data.aiPrompt);
        setStyle(template.data.style);
        setBackground(null);
        setHeadshot(null);
        setAssetMetadata(null);
        toast({ title: "Template Applied", description: `"${template.name}" template has been loaded.` });
    };

    const handleHeadshotUpload = (base64: string) => {
        setHeadshot(base64);
        handleAnalyzeAsset(base64);
    }

    const clearHeadshot = () => {
        setHeadshot(null);
        setAssetMetadata(null);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
        >
             <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">YouTube Thumbnail Generator</h1>
                <Button onClick={handleExport}>Export as PNG</Button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                    <ThumbnailInputForm
                        title={title}
                        setTitle={setTitle}
                        subtitle={subtitle}
                        setSubtitle={setSubtitle}
                        headshot={headshot}
                        onHeadshotUpload={handleHeadshotUpload}
                        onClearHeadshot={clearHeadshot}
                        aiPrompt={aiPrompt}
                        setAiPrompt={setAiPrompt}
                        isLoading={isLoading}
                        onGenerate={handleGenerateBackground}
                        isRemovingBackground={isRemovingBackground}
                        onRemoveBackground={handleRemoveBackground}
                        templates={templates}
                        onSelectTemplate={handleSelectTemplate}
                        assetMetadata={assetMetadata}
                        isAnalyzing={isAnalyzing}
                        // Fix: Pass style object to allow ThumbnailInputForm to correctly update it.
                        style={style}
                        setStyle={setStyle}
                    />
                </div>
                <div className="lg:col-span-6 flex items-center justify-center p-4 bg-muted/20 rounded-lg">
                    <ThumbnailPreview
                        stageRef={stageRef}
                        title={title}
                        subtitle={subtitle}
                        headshot={headshot}
                        background={background}
                        isLoading={isLoading}
                        style={style}
                    />
                </div>
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg">
                    <StyleControls style={style} setStyle={setStyle} />
                </div>
            </div>
        </motion.div>
    );
};

export default ThumbnailGeneratorPage;