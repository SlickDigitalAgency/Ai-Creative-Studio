

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Konva from 'konva';
import { useToast } from '../../components/ui/Toast';
import EditorToolbar from '../../components/editor/EditorToolbar';
import EditorCanvas from '../../components/editor/EditorCanvas';
import LayerPanel from '../../components/editor/LayerPanel';
import InpaintingPanel from '../../components/editor/InpaintingPanel';
import { ai } from '../../lib/gemini';
import { Modality } from '@google/genai';

export type EditorTool = 'select' | 'ellipse' | 'polygon' | 'lasso';

export type Point = { x: number; y: number };

export type RectSelection = { type: 'select'; x: number; y: number; width: number; height: number };
export type EllipseSelection = { type: 'ellipse'; x: number; y: number; width: number; height: number };
export type PathSelection = { type: 'polygon' | 'lasso'; points: Point[] };
export type Selection = RectSelection | EllipseSelection | PathSelection | null;


const AdvancedEditorPage = () => {
    const { toast } = useToast();
    const [image, setImage] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [activeTool, setActiveTool] = useState<EditorTool>('select');
    const [selection, setSelection] = useState<Selection>(null);
    const [inpaintingPrompt, setInpaintingPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const img = new Image();
            img.onload = () => {
                setImageSize({ width: img.width, height: img.height });
                setImage(base64String);
                setSelection(null);
            };
            img.src = base64String;
        };
        reader.readAsDataURL(file);
    };

    const createMaskFromSelection = (): string | null => {
        if (!selection || !imageSize.width || !imageSize.height) return null;
        
        const canvas = document.createElement('canvas');
        canvas.width = imageSize.width;
        canvas.height = imageSize.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.beginPath();

        if (selection.type === 'select') {
             ctx.rect(selection.x, selection.y, selection.width, selection.height);
        } else if (selection.type === 'ellipse') {
            const centerX = selection.x + selection.width / 2;
            const centerY = selection.y + selection.height / 2;
            const radiusX = selection.width / 2;
            const radiusY = selection.height / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        } else if ((selection.type === 'polygon' || selection.type === 'lasso') && selection.points.length > 1) {
            ctx.moveTo(selection.points[0].x, selection.points[0].y);
            for (let i = 1; i < selection.points.length; i++) {
                ctx.lineTo(selection.points[i].x, selection.points[i].y);
            }
            ctx.closePath();
        }
        
        ctx.fill();
        return canvas.toDataURL('image/png');
    };

    const handleInpaint = async () => {
        if (!image || !selection || !inpaintingPrompt) {
            toast({ title: "Error", description: "Please upload an image, make a selection, and enter a prompt.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const maskDataUrl = createMaskFromSelection();
            if (!maskDataUrl) throw new Error("Could not create selection mask.");

            const imageMatch = image.match(/^data:(image\/\w+);base64,(.*)$/);
            const maskMatch = maskDataUrl.match(/^data:(image\/\w+);base64,(.*)$/);
            if (!imageMatch || !maskMatch) throw new Error("Invalid image format.");

            const [, imageMimeType, imageData] = imageMatch;
            const [, maskMimeType, maskData] = maskMatch;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: imageData, mimeType: imageMimeType } },
                        { inlineData: { data: maskData, mimeType: maskMimeType } },
                        { text: `Using the second image as a mask, edit the first image. In the masked (white) area, apply this change: "${inpaintingPrompt}". Ensure the result is seamless.` },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

            if (imagePart && imagePart.inlineData) {
                const newMimeType = imagePart.inlineData.mimeType;
                const newBase64Data = imagePart.inlineData.data;
                const newImageUrl = `data:${newMimeType};base64,${newBase64Data}`;
                setImage(newImageUrl);
                setSelection(null); // Clear selection after inpainting
                toast({ title: "Success", description: "Inpainting applied successfully!" });
            } else {
                 const textPart = response.candidates?.[0]?.content?.parts.find(part => part.text);
                const errorMessage = textPart?.text || "Could not find the edited image in the response.";
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error("Error during inpainting:", error);
            toast({ title: "Inpainting Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col h-[calc(100vh-5rem)]" // Full viewport height minus header
        >
             <div className="flex items-center justify-between pb-4">
                <h1 className="text-lg font-semibold md:text-2xl">Advanced Editor</h1>
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                <div className="col-span-1 bg-muted/40 p-2 rounded-lg flex flex-col items-center">
                    <EditorToolbar 
                        activeTool={activeTool} 
                        setActiveTool={setActiveTool}
                        onImageUpload={handleImageUpload}
                    />
                </div>
                <div className="col-span-8 bg-muted/20 rounded-lg flex items-center justify-center p-2 relative">
                   <EditorCanvas 
                        image={image}
                        activeTool={activeTool}
                        selection={selection}
                        setSelection={setSelection}
                   />
                </div>
                <div className="col-span-3 bg-muted/40 p-4 rounded-lg flex flex-col gap-4 overflow-y-auto">
                    <LayerPanel />
                    <InpaintingPanel 
                        prompt={inpaintingPrompt}
                        setPrompt={setInpaintingPrompt}
                        onApply={handleInpaint}
                        isLoading={isLoading}
                        disabled={!selection}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default AdvancedEditorPage;