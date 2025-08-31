import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdCampaignInputForm from '../../../components/generator/ads/AdCampaignInputForm';
import AdPreview from '../../../components/generator/ads/AdPreview';
import AdStyleControls from '../../../components/generator/ads/AdStyleControls';
import { AdCampaignInputs, AdStyle, SocialPlatformFormat } from '../../../types/ads';
import { ai } from '../../../lib/gemini';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';
import ListForSaleModal, { ListingDetails } from '../../../components/marketplace/ListForSaleModal';

const availableFormats: SocialPlatformFormat[] = [
    { id: 'ig-story', name: 'Story', platform: 'Instagram', width: 1080, height: 1920, aspectRatio: '9:16' },
    { id: 'ig-post', name: 'Post', platform: 'Instagram', width: 1080, height: 1080, aspectRatio: '1:1' },
    { id: 'fb-post', name: 'Post', platform: 'Facebook', width: 1080, height: 1080, aspectRatio: '1:1' },
    { id: 'yt-ad', name: 'Video Ad', platform: 'YouTube', width: 1920, height: 1080, aspectRatio: '16:9' },
];

const SocialMediaAdGeneratorPage = () => {
    const { toast } = useToast();
    const [inputs, setInputs] = useState<AdCampaignInputs>({
        headline: 'Unlock Your Potential',
        bodyText: 'Discover our new course and start learning today. Limited time offer!',
        cta: 'Learn More',
    });
    const [style, setStyle] = useState<AdStyle>({
        textColor: '#FFFFFF',
        fontSize: 80,
    });
    const [aiPrompt, setAiPrompt] = useState('Abstract background with vibrant gradients and geometric shapes, professional and clean');
    const [selectedFormats, setSelectedFormats] = useState<string[]>(['ig-story', 'ig-post']);
    const [generatedBackgrounds, setGeneratedBackgrounds] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [designPreviewUrl, setDesignPreviewUrl] = useState('');

    const handleGenerateAds = async () => {
        if (selectedFormats.length === 0) {
            toast({ title: "Error", description: "Please select at least one ad format.", variant: "destructive" });
            return;
        }
        if (!aiPrompt) {
            toast({ title: "Error", description: "Please enter a prompt for the ad background.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setGeneratedBackgrounds({});

        try {
            const generationPromises = selectedFormats.map(async (formatId) => {
                const format = availableFormats.find(f => f.id === formatId);
                if (!format) return;

                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: `${aiPrompt} --ar ${format.aspectRatio}`,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: format.aspectRatio,
                    },
                });
                const base64ImageBytes = response.generatedImages[0].image.imageBytes;
                return { formatId, imageUrl: `data:image/jpeg;base64,${base64ImageBytes}` };
            });

            const results = await Promise.all(generationPromises);
            const newBackgrounds = results.reduce((acc, result) => {
                if (result) {
                    acc[result.formatId] = result.imageUrl;
                }
                return acc;
            }, {} as Record<string, string>);

            setGeneratedBackgrounds(newBackgrounds);
            toast({ title: "Success", description: "Ads generated successfully!" });
        } catch (error) {
            console.error("Error generating ads:", error);
            toast({ title: "Generation Failed", description: "Could not generate ads. Please try again.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenListModal = () => {
        // Conceptual: In a real app, you'd let the user select which ad to list.
        // For now, we'll use the first available generated background as a preview.
        const firstPreviewUrl = Object.values(generatedBackgrounds)[0];
        if (firstPreviewUrl) {
            setDesignPreviewUrl(firstPreviewUrl);
            setIsListModalOpen(true);
        } else {
            toast({ title: "Error", description: "Please generate some ads first to list one.", variant: "destructive" });
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
                <h1 className="text-lg font-semibold md:text-2xl">Social Media Ad Generator</h1>
                <Button variant="outline" onClick={handleOpenListModal}>List on Marketplace</Button>
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                <div className="lg:col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                    <AdCampaignInputForm
                        inputs={inputs}
                        setInputs={setInputs}
                        aiPrompt={aiPrompt}
                        setAiPrompt={setAiPrompt}
                        availableFormats={availableFormats}
                        selectedFormats={selectedFormats}
                        setSelectedFormats={setSelectedFormats}
                        isLoading={isLoading}
                        onGenerate={handleGenerateAds}
                    />
                </div>
                <div className="lg:col-span-9 flex flex-col p-4 bg-muted/20 rounded-lg">
                    <AdPreview
                        formats={availableFormats.filter(f => selectedFormats.includes(f.id))}
                        backgrounds={generatedBackgrounds}
                        inputs={inputs}
                        style={style}
                        isLoading={isLoading}
                    />
                     <div className="lg:w-1/3 p-4 rounded-lg mt-4 self-center">
                        <AdStyleControls style={style} setStyle={setStyle} />
                    </div>
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

export default SocialMediaAdGeneratorPage;