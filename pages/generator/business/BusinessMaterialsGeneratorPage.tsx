

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Konva from 'konva';
import { useToast } from '../../../components/ui/Toast';
import { ai } from '../../../lib/gemini';
import { BusinessCardInputs, BusinessCardStyle, BusinessCardTemplate } from '../../../types/business';
import BusinessCardInputForm from '../../../components/generator/business/BusinessCardInputForm';
import BusinessCardPreview from '../../../components/generator/business/BusinessCardPreview';
import BusinessCardStyleControls from '../../../components/generator/business/BusinessCardStyleControls';
import { Button } from '../../../components/ui/Button';
import ListForSaleModal, { ListingDetails } from '../../../components/marketplace/ListForSaleModal';

const templates: BusinessCardTemplate[] = [
    {
        id: 'template-1', name: 'Modern Minimalist', industry: 'Tech',
        previewUrl: 'https://i.imgur.com/L8J09p7.png',
        data: {
            inputs: { name: 'Alex Johnson', title: 'Senior Developer', company: 'Innovate Inc.', phone: '555-0101', email: 'alex.j@innovate.co', website: 'innovate.co' },
            style: { textColor: '#111827', fontSize: 9, background: '#F9FAFB' },
            aiPrompt: 'Clean, minimalist light grey background with a single, thin blue line accent'
        }
    },
    {
        id: 'template-2', name: 'Creative Bold', industry: 'Creative',
        previewUrl: 'https://i.imgur.com/pS8Tz8B.png',
        data: {
            inputs: { name: 'Samantha Bee', title: 'Art Director', company: 'Vivid Designs', phone: '555-0102', email: 'sam@vivid.design', website: 'vivid.design' },
            style: { textColor: '#FFFFFF', fontSize: 10, background: '#1F2937' },
            aiPrompt: 'A vibrant splash of abstract colors like magenta and cyan on a dark charcoal background'
        }
    },
    {
        id: 'template-3', name: 'Classic Professional', industry: 'Corporate',
        previewUrl: 'https://i.imgur.com/8V5XgG0.png',
        data: {
            inputs: { name: 'Benjamin Carter', title: 'Financial Advisor', company: 'Prestige Financial', phone: '555-0103', email: 'b.carter@prestige.fi', website: 'prestige.fi' },
            style: { textColor: '#1E3A8A', fontSize: 8, background: '#FFFFFF' },
            aiPrompt: 'A subtle, elegant cream-colored background with a classic serif font texture'
        }
    }
];

const BusinessMaterialsGeneratorPage = () => {
    const { toast } = useToast();
    const stageRef = useRef<Konva.Stage>(null);
    const [inputs, setInputs] = useState<BusinessCardInputs>(templates[0].data.inputs);
    const [style, setStyle] = useState<BusinessCardStyle>(templates[0].data.style);
    const [aiPrompt, setAiPrompt] = useState(templates[0].data.aiPrompt);
    const [background, setBackground] = useState<string | null>(templates[0].data.style.background || null);
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
                  aspectRatio: '1.75:1', // Close to 3.5 / 2 aspect ratio
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
            link.download = 'business-card.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast({ title: "Success", description: "Business card exported successfully!" });
        } else {
             toast({ title: "Export Failed", description: "Could not export business card.", variant: "destructive" });
        }
    };
    
    const handleSelectTemplate = (template: BusinessCardTemplate) => {
        setInputs(template.data.inputs);
        setStyle(template.data.style);
        setAiPrompt(template.data.aiPrompt);
        setBackground(template.data.style.background || null);
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
        // Here you would typically make an API call to save the listing to your backend/database.
        // For now, we'll just show a success message.
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
                <h1 className="text-lg font-semibold md:text-2xl">Business Card Generator</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleOpenListModal}>List on Marketplace</Button>
                    <Button onClick={handleExport}>Export as PNG</Button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                   <BusinessCardInputForm 
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
                    <BusinessCardPreview 
                        stageRef={stageRef}
                        inputs={inputs}
                        style={style}
                        background={background}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg">
                    <BusinessCardStyleControls style={style} setStyle={setStyle} />
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

export default BusinessMaterialsGeneratorPage;