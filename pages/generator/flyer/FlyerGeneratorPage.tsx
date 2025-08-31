

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Konva from 'konva';
import { useToast } from '../../../components/ui/Toast';
import { ai } from '../../../lib/gemini';
import { FlyerInputs, FlyerStyle, FlyerTemplate } from '../../../types/flyer';
import { Button } from '../../../components/ui/Button';
import FlyerInputForm from '../../../components/generator/flyer/FlyerInputForm';
import FlyerPreview from '../../../components/generator/flyer/FlyerPreview';
import FlyerStyleControls from '../../../components/generator/flyer/FlyerStyleControls';
import ListForSaleModal, { ListingDetails } from '../../../components/marketplace/ListForSaleModal';

const templates: FlyerTemplate[] = [
    {
        id: 'flyer-1', name: 'Corporate Event', eventType: 'Business',
        previewUrl: 'https://i.imgur.com/vBq2FzL.png',
        data: {
            inputs: { headline: 'Annual Tech Summit', bodyText: 'Join industry leaders for a day of innovation, networking, and insightful talks.', cta: 'Register Now', eventDetails: 'October 25th | 9 AM | Grand Hall' },
            style: { headlineColor: '#1E3A8A', headlineFontSize: 90, bodyColor: '#333333', bodyFontSize: 38 },
            aiPrompt: 'Clean and professional geometric background with shades of blue and white, suitable for a corporate event'
        }
    },
    {
        id: 'flyer-2', name: 'Music Night', eventType: 'Music',
        previewUrl: 'https://i.imgur.com/kP8yD0J.png',
        data: {
            inputs: { headline: 'Acoustic Night', bodyText: 'Experience an intimate evening of live music with our featured local artists.', cta: 'Book Your Spot', eventDetails: 'Every Friday | 8 PM | The Coffee House' },
            style: { headlineColor: '#FFFFFF', headlineFontSize: 120, bodyColor: '#FDE68A', bodyFontSize: 42 },
            aiPrompt: 'Dark, moody background with subtle stage lights and a vintage microphone silhouette'
        }
    },
    {
        id: 'flyer-3', name: 'Grand Opening', eventType: 'Retail',
        previewUrl: 'https://i.imgur.com/R3zY3G5.png',
        data: {
            inputs: { headline: 'GRAND OPENING', bodyText: 'Celebrate the launch of our new flagship store! Enjoy exclusive discounts and giveaways.', cta: 'Get Directions', eventDetails: 'Saturday, Nov 5th | 10 AM | 456 Market St.' },
            style: { headlineColor: '#B91C1C', headlineFontSize: 110, bodyColor: '#1F2937', bodyFontSize: 40 },
            aiPrompt: 'Bright, celebratory background with exploding confetti and balloons in red and gold'
        }
    }
];


const FlyerGeneratorPage = () => {
    const { toast } = useToast();
    const stageRef = useRef<Konva.Stage>(null);
    const [inputs, setInputs] = useState<FlyerInputs>(templates[0].data.inputs);
    const [style, setStyle] = useState<FlyerStyle>(templates[0].data.style);
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
                  aspectRatio: '3:4', // Close to 8.5 / 11 aspect ratio
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
            link.download = 'flyer.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Success", description: "Flyer exported successfully!" });
        } else {
             toast({ title: "Export Failed", description: "Could not export flyer.", variant: "destructive" });
        }
    };

    const handleSelectTemplate = (template: FlyerTemplate) => {
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
                <h1 className="text-lg font-semibold md:text-2xl">Flyer Generator</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleOpenListModal}>List on Marketplace</Button>
                    <Button onClick={handleExport}>Export as PNG</Button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                   <FlyerInputForm 
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
                    <FlyerPreview 
                        stageRef={stageRef}
                        inputs={inputs}
                        style={style}
                        background={background}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg">
                    <FlyerStyleControls style={style} setStyle={setStyle} />
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

export default FlyerGeneratorPage;