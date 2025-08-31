
import React from 'react';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import SparklesIcon from '../icons/SparklesIcon';
import Spinner from '../ui/Spinner';
import { Separator } from '../ui/Separator';


interface Props {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onApply: () => void;
    isLoading: boolean;
    disabled: boolean;
}


const InpaintingPanel: React.FC<Props> = ({ prompt, setPrompt, onApply, isLoading, disabled }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">AI Inpainting</h2>
            <Separator />
            <div className="grid gap-4 mt-4">
                <div className="grid gap-2">
                    <Label htmlFor="inpainting-prompt">Prompt</Label>
                    <Textarea 
                        id="inpainting-prompt" 
                        placeholder="e.g., add a small boat on the water" 
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                <Button onClick={onApply} disabled={isLoading || disabled}>
                    {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : <SparklesIcon className="w-4 h-4 mr-2" />}
                    {isLoading ? 'Applying...' : 'Apply'}
                </Button>
                 {disabled && !isLoading && (
                    <p className="text-xs text-center text-muted-foreground">
                        Make a selection on the image to enable.
                    </p>
                )}
            </div>
        </div>
    );
};

export default InpaintingPanel;
