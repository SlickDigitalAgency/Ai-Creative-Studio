import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import SparklesIcon from '../../icons/SparklesIcon';
import Spinner from '../../ui/Spinner';
import { LogoGenerationInputs } from '../../../types/logo';
import { Separator } from '../../ui/Separator';

interface Props {
    inputs: LogoGenerationInputs;
    setInputs: (inputs: LogoGenerationInputs) => void;
    isLoading: boolean;
    onGenerate: () => void;
}

const LogoInputForm: React.FC<Props> = ({ inputs, setInputs, isLoading, onGenerate }) => {
    
    const handleInputChange = (field: keyof LogoGenerationInputs, value: string) => {
        setInputs({ ...inputs, [field]: value });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-2">Brand Details</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" value={inputs.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="e.g., Starlight Innovations" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" value={inputs.industry} onChange={(e) => handleInputChange('industry', e.target.value)} placeholder="e.g., Technology, Healthcare" />
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-lg font-semibold mb-2">Style Preferences</h2>
                <div className="grid gap-4">
                     <div className="grid gap-2">
                        <Label htmlFor="style">Style</Label>
                        <select
                            id="style"
                            value={inputs.style}
                            onChange={(e) => handleInputChange('style', e.target.value as LogoGenerationInputs['style'])}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="minimalist">Minimalist</option>
                            <option value="modern">Modern</option>
                            <option value="vintage">Vintage</option>
                            <option value="playful">Playful</option>
                            <option value="elegant">Elegant</option>
                            <option value="bold">Bold</option>
                            <option value="geometric">Geometric</option>
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="colors">Colors</Label>
                        <Input id="colors" value={inputs.colors} onChange={(e) => handleInputChange('colors', e.target.value)} placeholder="e.g., Ocean blue and sand beige" />
                    </div>
                </div>
            </div>
            
            <Separator />
            
            <Button onClick={onGenerate} disabled={isLoading} className="w-full mt-4">
                {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
                {isLoading ? 'Generating...' : 'Generate Logos'}
            </Button>
        </div>
    );
};

export default LogoInputForm;
