import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import SparklesIcon from '../../icons/SparklesIcon';
import Spinner from '../../ui/Spinner';
import { Separator } from '../../ui/Separator';
import { AdCampaignInputs, SocialPlatformFormat } from '../../../types/ads';
import { cn } from '../../../lib/utils';

interface Props {
    inputs: AdCampaignInputs;
    setInputs: (inputs: AdCampaignInputs) => void;
    aiPrompt: string;
    setAiPrompt: (value: string) => void;
    availableFormats: SocialPlatformFormat[];
    selectedFormats: string[];
    setSelectedFormats: (value: string[]) => void;
    isLoading: boolean;
    onGenerate: () => void;
}

const AdCampaignInputForm: React.FC<Props> = ({
    inputs, setInputs, aiPrompt, setAiPrompt, availableFormats, selectedFormats, setSelectedFormats, isLoading, onGenerate
}) => {
    
    const handleInputChange = (field: keyof AdCampaignInputs, value: string) => {
        setInputs({ ...inputs, [field]: value });
    };

    const handleFormatToggle = (formatId: string) => {
        setSelectedFormats(
            selectedFormats.includes(formatId)
                ? selectedFormats.filter(id => id !== formatId)
                : [...selectedFormats, formatId]
        );
    };

    const groupedFormats = availableFormats.reduce((acc, format) => {
        (acc[format.platform] = acc[format.platform] || []).push(format);
        return acc;
    }, {} as Record<string, SocialPlatformFormat[]>);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-2">Ad Content</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" value={inputs.headline} onChange={(e) => handleInputChange('headline', e.target.value)} placeholder="Ad headline" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bodyText">Body Text</Label>
                        <Textarea id="bodyText" value={inputs.bodyText} onChange={(e) => handleInputChange('bodyText', e.target.value)} placeholder="Compelling body text" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cta">Call to Action</Label>
                        <Input id="cta" value={inputs.cta} onChange={(e) => handleInputChange('cta', e.target.value)} placeholder="e.g., Shop Now" />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-lg font-semibold mb-2">Platforms & Formats</h2>
                <div className="space-y-4">
                    {Object.entries(groupedFormats).map(([platform, formats]) => (
                        <div key={platform}>
                            <h3 className="text-md font-medium mb-2">{platform}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {formats.map(format => (
                                    <button
                                        key={format.id}
                                        onClick={() => handleFormatToggle(format.id)}
                                        className={cn(
                                            "p-2 rounded-md border text-sm transition-colors",
                                            selectedFormats.includes(format.id)
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary hover:bg-secondary/80"
                                        )}
                                    >
                                        {format.name} ({format.aspectRatio})
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />
            
            <div>
                <h2 className="text-lg font-semibold mb-2">AI Background</h2>
                <div className="grid gap-2">
                    <Label htmlFor="ai-prompt">Prompt</Label>
                    <Textarea id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., An epic space battle" rows={4} />
                </div>
                <Button onClick={onGenerate} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
                    {isLoading ? 'Generating...' : 'Generate Ads'}
                </Button>
            </div>
        </div>
    );
};

export default AdCampaignInputForm;