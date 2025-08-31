

import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import SparklesIcon from '../../icons/SparklesIcon';
import Spinner from '../../ui/Spinner';
import { Separator } from '../../ui/Separator';
import { BusinessCardInputs, BusinessCardTemplate } from '../../../types/business';

interface Props {
    inputs: BusinessCardInputs;
    setInputs: (inputs: BusinessCardInputs) => void;
    aiPrompt: string;
    setAiPrompt: (value: string) => void;
    isLoading: boolean;
    onGenerate: () => void;
    templates: BusinessCardTemplate[];
    onSelectTemplate: (template: BusinessCardTemplate) => void;
}

const BusinessCardInputForm: React.FC<Props> = ({
    inputs, setInputs, aiPrompt, setAiPrompt, isLoading, onGenerate, templates, onSelectTemplate
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleInputChange = (field: keyof BusinessCardInputs, value: string) => {
        setInputs({ ...inputs, [field]: value });
    };

     const filteredTemplates = templates.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.industry.toLowerCase().includes(searchTerm.toLowerCase())
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
                            className="aspect-[1.75] rounded-md overflow-hidden relative group border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none transition-all"
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
                <h2 className="text-lg font-semibold mb-2">Card Information</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={inputs.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g., John Doe" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title / Position</Label>
                        <Input id="title" value={inputs.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g., Creative Director" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" value={inputs.company} onChange={(e) => handleInputChange('company', e.target.value)} placeholder="e.g., AI Creative Studio" />
                    </div>
                </div>
            </div>

            <Separator />
            
            <div>
                <h2 className="text-lg font-semibold mb-2">Contact Details</h2>
                 <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={inputs.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="e.g., +1 (555) 123-4567" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={inputs.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="e.g., john.doe@email.com" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" value={inputs.website} onChange={(e) => handleInputChange('website', e.target.value)} placeholder="e.g., www.yourwebsite.com" />
                    </div>
                </div>
            </div>

            <Separator />
            
            <div>
                <h2 className="text-lg font-semibold mb-2">AI Background Design</h2>
                <div className="grid gap-2">
                    <Label htmlFor="ai-prompt">Prompt</Label>
                    <Textarea id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., minimalist dark blue background" rows={3} />
                </div>
                <Button onClick={onGenerate} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
                    {isLoading ? 'Generating...' : 'Generate Background'}
                </Button>
            </div>
        </div>
    );
};

export default BusinessCardInputForm;