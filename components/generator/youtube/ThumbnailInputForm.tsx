import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Button } from '../../ui/Button';
import SparklesIcon from '../../icons/SparklesIcon';
import Spinner from '../../ui/Spinner';
import { ThumbnailTemplate, AssetMetadata, ThumbnailStyle } from '../../../pages/generator/youtube/ThumbnailGeneratorPage';
import { Separator } from '../../ui/Separator';

interface Props {
    title: string;
    setTitle: (value: string) => void;
    subtitle: string;
    setSubtitle: (value: string) => void;
    headshot: string | null;
    onHeadshotUpload: (base64: string) => void;
    onClearHeadshot: () => void;
    aiPrompt: string;
    setAiPrompt: (value: string) => void;
    isLoading: boolean;
    onGenerate: () => void;
    isRemovingBackground: boolean;
    onRemoveBackground: () => void;
    templates: ThumbnailTemplate[];
    onSelectTemplate: (template: ThumbnailTemplate) => void;
    assetMetadata: AssetMetadata | null;
    isAnalyzing: boolean;
    // Fix: Added style prop to have access to the current style state.
    style: ThumbnailStyle;
    setStyle: (style: ThumbnailStyle) => void;
}

const ThumbnailInputForm: React.FC<Props> = ({
    title, setTitle, subtitle, setSubtitle, headshot, onHeadshotUpload, onClearHeadshot, aiPrompt, setAiPrompt, 
    isLoading, onGenerate, isRemovingBackground, onRemoveBackground, templates, onSelectTemplate,
    // Fix: Destructure style prop.
    assetMetadata, isAnalyzing, style, setStyle
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                onHeadshotUpload(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredTemplates = templates.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.data.aiPrompt.toLowerCase().includes(searchTerm.toLowerCase())
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
                            className="aspect-video rounded-md overflow-hidden relative group border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none transition-all"
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
                <h2 className="text-lg font-semibold mb-2">Content</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your video title" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Catchy subtitle" />
                    </div>
                </div>
            </div>

             <Separator />

            <div>
                 <h2 className="text-lg font-semibold mb-2">Assets</h2>
                 <div className="grid gap-2">
                    <Label htmlFor="headshot">Headshot</Label>
                    <Input id="headshot" type="file" accept="image/*" onChange={handleFileChange} className="file:text-foreground" />
                    {headshot && (
                        <div className="mt-2 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24">
                                    <img src={headshot} alt="Headshot Preview" className="rounded-md object-cover w-full h-full" />
                                    <button onClick={onClearHeadshot} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs z-10">
                                        &times;
                                    </button>
                                     {isAnalyzing && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md">
                                            <Spinner className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 self-start">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={onRemoveBackground} 
                                        disabled={isRemovingBackground || isAnalyzing}
                                    >
                                        {isRemovingBackground ? <Spinner className="w-4 h-4 mr-2" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
                                        {isRemovingBackground ? 'Removing...' : 'Remove BG'}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">Powered by AI</p>
                                </div>
                            </div>
                            {assetMetadata && (
                                <div className="space-y-2">
                                     <div>
                                        <h4 className="text-sm font-medium mb-1">Color Palette</h4>
                                        <div className="flex gap-2">
                                            {assetMetadata.colorPalette.map((color, i) => (
                                                <button 
                                                    key={i} 
                                                    className="w-6 h-6 rounded-full border-2 border-muted" 
                                                    style={{ backgroundColor: color }}
                                                    // Fix: Changed from functional update to direct object update, as the component now has access to the 'style' object. This resolves a TypeScript error.
                                                    onClick={() => setStyle({ ...style, titleColor: color })}
                                                    aria-label={`Set title color to ${color}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">AI Tags <span className="text-xs text-muted-foreground">({assetMetadata.category})</span></h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {assetMetadata.tags.map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                    {isLoading ? 'Generating...' : 'Generate Background'}
                </Button>
            </div>
        </div>
    );
};

export default ThumbnailInputForm;