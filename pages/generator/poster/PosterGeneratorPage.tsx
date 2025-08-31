

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Konva from 'konva';
import { useToast } from '../../../components/ui/Toast';
import { ai } from '../../../lib/gemini';
import { PosterInputs, PosterStyle, PosterTemplate } from '../../../types/poster';
import { Button } from '../../../components/ui/Button';
import PosterInputForm from '../../../components/generator/poster/PosterInputForm';
import PosterPreview from '../../../components/generator/poster/PosterPreview';
import PosterStyleControls from '../../../components/generator/poster/PosterStyleControls';
import ListForSaleModal, { ListingDetails } from '../../../components/marketplace/ListForSaleModal';

const templates: PosterTemplate[] = [
    {
        id: 'poster-1', name: 'Music Fest', theme: 'Music',
        previewUrl: 'https://i.imgur.com/g8f4G5e.png',
        data: {
            inputs: { headline: 'Summer Soundwave', bodyText: 'An unforgettable weekend of live music, art, and good vibes under the sun.', cta: 'Buy Tickets', eventDetails: 'July 19-21 | Oceanfront Park' },
            style: { headlineColor: '#FFFFFF', headlineFontSize: 140, bodyColor: '#FBBF24', bodyFontSize: 55 },
            aiPrompt: 'Vibrant, psychedelic abstract background for a summer music festival, with sunset colors and wavy lines'
        }
    },
    {
        id: 'poster-2', name: 'Tech Conference', theme: 'Corporate',
        previewUrl: 'https://i.imgur.com/yX9H9jT.png',
        data: {
            inputs: { headline: 'Innovate 2024', bodyText: 'The future of technology is here. Join global innovators and explore the next generation of tech.', cta: 'Register Today', eventDetails: 'November 12-14 | Metro Convention Center' },
            style: { headlineColor: '#0EA5E9', headlineFontSize: 160, bodyColor: '#F8FAFC', bodyFontSize: 60 },
            aiPrompt: 'A futuristic, dark blue background with glowing digital circuit lines and a subtle world map overlay'
        }
    },
    {
        id: 'poster-3', name: 'Art Exhibition', theme: 'Art',
        previewUrl: 'https://i.imgur.com/nI4pL1K.png',
        data: {
            inputs: { headline: 'Modern Abstract', bodyText: 'A curated collection of contemporary abstract art from emerging artists.', cta: 'Visit the Gallery', eventDetails: 'Oct 1st - Nov 30th | City Art Gallery' },
            style: { headlineColor: '#1F2937', headlineFontSize: 130, bodyColor: '#4B5563', bodyFontSize: 50 },
            aiPrompt: 'A minimal, textured gallery wall background in an off-white color with soft, realistic shadows'
        }
    }
];

const PosterGeneratorPage = () => {
    const { toast } = useToast();
    const stageRef = useRef<Konva.Stage>(null);
    const [inputs, setInputs] = useState<PosterInputs>(templates[0].data.inputs);
    const [style, setStyle] = useState<PosterStyle>(templates[0].data.style);
    const [aiPrompt, setAiPrompt] = useState(templates[0].data.aiPrompt);
    const [background, setBackground] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [designPreviewUrl, setDesignPreviewUrl] = useState('');

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
                  aspectRatio: '3:4', // 18x24 aspect ratio
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
    
    const handleExport = () => {
        if (stageRef.current) {
            const uri = stageRef.current.toDataURL({ mimeType: 'image/png', quality: 1, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = 'poster.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Success", description: "Poster exported successfully!" });
        } else {
             toast({ title: "Export Failed", description: "Could not export poster.", variant: "destructive" });
        }
    };

    const handleSelectTemplate = (template: PosterTemplate) => {
        setInputs(template.data.inputs);
        setStyle(template.data.style);
        setAiPrompt(template.data.aiPrompt);
        setBackground(null);
        toast({ title: "Template Applied", description: `"${template.name}" selected.` });
    };

    const handleOpenListModal = () => {
        if (stageRef.current) {
            const uri = stageRef.current.toDataURL({ mimeType: 'image/png', quality: 1 });
            setDesignPreviewUrl(uri);
            setIsListModalOpen(true);
        } else {
            toast({ title: "Error", description: "Could not capture design preview.", variant: "destructive" });
        }
    };

    const handleConfirmListing = (details: ListingDetails) => {
        console.log("Listing details:", details);
        toast({ title: "Success!", description: "Your design has been listed on the Marketplace." });
        setIsListModalOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
        >
             <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Poster Generator</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleOpenListModal}>List on Marketplace</Button>
                    <Button onClick={handleExport}>Export as PNG</Button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                   <PosterInputForm 
                     inputs={inputs}
                     setInputs={setInputs}
                     aiPrompt={aiPrompt}
                     setAiPrompt={setAiPrompt}
                     isLoading={isLoading}
                     onGenerate={handleGenerateBackground}
                     templates={templates}
                     onSelectTemplate={handleSelectTemplate}
                   />
                </div>
                <div className="lg:col-span-6 flex items-center justify-center p-4 bg-muted/20 rounded-lg">
                    <PosterPreview 
                        stageRef={stageRef}
                        inputs={inputs}
                        style={style}
                        background={background}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg">
                    <PosterStyleControls style={style} setStyle={setStyle} />
                </div>
            </div>
             <ListForSaleModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                onConfirm={handleConfirmListing}
                designPreviewUrl={designPreviewUrl}
             />
        </motion.div>
    );
};

export default PosterGeneratorPage;