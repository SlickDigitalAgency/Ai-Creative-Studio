
import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import SparklesIcon from '../../icons/SparklesIcon';
import Spinner from '../../ui/Spinner';
import { Separator } from '../../ui/Separator';
import { PosterInputs, PosterTemplate } from '../../../types/poster';

interface Props {
    inputs: PosterInputs;
    setInputs: (inputs: PosterInputs) => void;
    aiPrompt: string;
    setAiPrompt: (value: string) => void;
    isLoading: boolean;
    onGenerate: () => void;
    templates: PosterTemplate[];
    onSelectTemplate: (template: PosterTemplate) => void;
}

const PosterInputForm: React.FC<Props> = ({
    inputs, setInputs, aiPrompt, setAiPrompt, isLoading, onGenerate, templates, onSelectTemplate
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (field: keyof PosterInputs, value: string) => {
        setInputs({ ...inputs, [field]: value });
    };

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-2">Templates</h2>
                <div className="mb-2">
                    <Input
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {filteredTemplates.map(template => (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template)}
                            className="aspect-[3/4] rounded-md overflow-hidden relative group border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none transition-all"
                            aria-label={`Select ${template.name} template`}
                        >
                            <img src={template.previewUrl} alt={template.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center p-1">
                                <p className="text-white text-xs font-bold text-center">{template.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-lg font-semibold mb-2">Poster Content</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" value={inputs.headline} onChange={(e) => handleInputChange('headline', e.target.value)} placeholder="e.g., Music Fest 2024" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bodyText">Body Text</Label>
                        <Textarea id="bodyText" rows={5} value={inputs.bodyText} onChange={(e) => handleInputChange('bodyText', e.target.value)} placeholder="Details about your event or promotion..." />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="cta">Call to Action</Label>
                        <Input id="cta" value={inputs.cta} onChange={(e) => handleInputChange('cta', e.target.value)} placeholder="e.g., Get Tickets Now!" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="eventDetails">Event Details</Label>
                        <Input id="eventDetails" value={inputs.eventDetails} onChange={(e) => handleInputChange('eventDetails', e.target.value)} placeholder="e.g., Date, Time, Location" />
                    </div>
                </div>
            </div>

            <Separator />
            
            <div>
                <h2 className="text-lg font-semibold mb-2">AI Background Design</h2>
                <div className="grid gap-2">
                    <Label htmlFor="ai-prompt">Prompt</Label>
                    <Textarea id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., dynamic abstract background" rows={3} />
                </div>
                <Button onClick={onGenerate} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
                    {isLoading ? 'Generating...' : 'Generate Background'}
                </Button>
            </div>
        </div>
    );
};

export default PosterInputForm;