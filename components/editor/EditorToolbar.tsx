

import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { EditorTool } from '../../pages/editor/AdvancedEditorPage';
import EllipseIcon from '../icons/EllipseIcon';
import PolygonIcon from '../icons/PolygonIcon';
import LassoIcon from '../icons/LassoIcon';

// Simple square icon for selection tool
const SquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
);

// Simple upload icon
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);


interface Props {
    activeTool: EditorTool;
    setActiveTool: (tool: EditorTool) => void;
    onImageUpload: (file: File) => void;
}

const EditorToolbar: React.FC<Props> = ({ activeTool, setActiveTool, onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleUploadClick}
                aria-label="Upload Image"
                title="Upload Image"
            >
                <UploadIcon className="h-6 w-6" />
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange} 
            />
            <Button
                variant={activeTool === 'select' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setActiveTool('select')}
                aria-label="Rectangle Select Tool"
                title="Rectangle Select Tool"
            >
                <SquareIcon className="h-6 w-6" />
            </Button>
            <Button
                variant={activeTool === 'ellipse' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setActiveTool('ellipse')}
                aria-label="Ellipse Select Tool"
                title="Ellipse Select Tool"
            >
                <EllipseIcon className="h-6 w-6" />
            </Button>
            <Button
                variant={activeTool === 'polygon' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setActiveTool('polygon')}
                aria-label="Polygon Select Tool"
                title="Polygon Select Tool"
            >
                <PolygonIcon className="h-6 w-6" />
            </Button>
            <Button
                variant={activeTool === 'lasso' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setActiveTool('lasso')}
                aria-label="Lasso Select Tool"
                title="Lasso Select Tool"
            >
                <LassoIcon className="h-6 w-6" />
            </Button>
        </div>
    );
};

export default EditorToolbar;