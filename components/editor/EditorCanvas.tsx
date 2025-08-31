

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Ellipse, Line } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import { EditorTool, Selection, Point } from '../../pages/editor/AdvancedEditorPage';
import EditIcon from '../icons/EditIcon';

interface Props {
    image: string | null;
    activeTool: EditorTool;
    selection: Selection;
    setSelection: (rect: Selection) => void;
}

const URLImage = ({ src }: { src: string }) => {
    const [img] = useImage(src, 'anonymous');
    return <KonvaImage image={img} />;
};

const EditorCanvas: React.FC<Props> = ({ image, activeTool, selection, setSelection }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<Konva.Stage>(null);
    const selectionShapeRef = useRef<Konva.Shape>(null);
    
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
    const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

    const [img] = useImage(image || '', 'anonymous');

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setCanvasSize({ width, height });
            }
        };
        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const shape = selectionShapeRef.current;
        if (!shape) return;

        const anim = new Konva.Animation(frame => {
            const dashOffset = (frame?.time || 0) / 1000 * -10;
            shape.dashOffset(dashOffset % 20);
        }, shape.getLayer());
        
        if (selection) {
            anim.start();
        }
        
        return () => {
            anim.stop();
        };
    }, [selection]);

    const imageScale = img ? Math.min(canvasSize.width / img.width, canvasSize.height / img.height) : 1;
    const imageRenderSize = { width: img ? img.width * imageScale : 0, height: img ? img.height * imageScale : 0 };
    const imageOffset = { x: (canvasSize.width - imageRenderSize.width) / 2, y: (canvasSize.height - imageRenderSize.height) / 2 };

    const getScaledCoords = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const stage = e.target.getStage();
        if (!stage) return { x: 0, y: 0 };
        const pointerPosition = stage.getPointerPosition();
        if (!pointerPosition) return { x: 0, y: 0 };
        const transform = stage.getAbsoluteTransform().copy().invert();
        const scaledPointer = {
            x: (pointerPosition.x - imageOffset.x) / imageScale,
            y: (pointerPosition.y - imageOffset.y) / imageScale,
        };
        return scaledPointer;
    };

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!image) return;
        const pos = getScaledCoords(e);
        
        if (activeTool === 'polygon') {
            const newPoints = [...currentPoints, pos];
            // Check for closing polygon
            if (newPoints.length > 2) {
                const firstPoint = newPoints[0];
                const lastPoint = newPoints[newPoints.length - 1];
                const dist = Math.sqrt(Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2));
                if (dist < 10 / imageScale) { // Close if clicked near start
                    setSelection({ type: 'polygon', points: newPoints.slice(0, -1) });
                    setCurrentPoints([]);
                    return;
                }
            }
            setCurrentPoints(newPoints);
        } else {
            setIsDrawing(true);
            setStartPoint(pos);
            if (activeTool === 'lasso') {
                setCurrentPoints([pos]);
            } else {
                setSelection({ type: activeTool, x: pos.x, y: pos.y, width: 0, height: 0 });
            }
        }
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isDrawing || !image) return;
        const pos = getScaledCoords(e);
        if (activeTool === 'select' || activeTool === 'ellipse') {
            setSelection({
                type: activeTool,
                x: Math.min(startPoint.x, pos.x),
                y: Math.min(startPoint.y, pos.y),
                width: Math.abs(pos.x - startPoint.x),
                height: Math.abs(pos.y - startPoint.y),
            });
        } else if (activeTool === 'lasso') {
            setCurrentPoints([...currentPoints, pos]);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        if (activeTool === 'lasso' && currentPoints.length > 1) {
            setSelection({ type: 'lasso', points: currentPoints });
            setCurrentPoints([]);
        }
    };
    
    const handleDoubleClick = () => {
         if (activeTool === 'polygon' && currentPoints.length > 2) {
            setSelection({ type: 'polygon', points: currentPoints });
            setCurrentPoints([]);
        }
    };
    
    const flattenPoints = (points: Point[]) => points.flatMap(p => [p.x, p.y]);

    if (!image) {
        return (
            <div className="flex flex-col items-center justify-center text-muted-foreground w-full h-full">
                <EditIcon className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Upload an Image to Begin</h3>
                <p>Use the toolbar on the left to get started.</p>
            </div>
        );
    }
    
    return (
        <div ref={containerRef} className="w-full h-full cursor-crosshair">
            <Stage 
                ref={stageRef} 
                width={canvasSize.width} 
                height={canvasSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDblClick={handleDoubleClick}
            >
                <Layer>
                    {img && (
                        <KonvaImage 
                            image={img} 
                            width={imageRenderSize.width} 
                            height={imageRenderSize.height} 
                            x={imageOffset.x}
                            y={imageOffset.y}
                        />
                    )}
                </Layer>
                 <Layer scaleX={imageScale} scaleY={imageScale} x={imageOffset.x} y={imageOffset.y}>
                    {selection?.type === 'select' && (
                        <Rect ref={selectionShapeRef as React.Ref<Konva.Rect>} {...selection} stroke="white" strokeWidth={2 / imageScale} dash={[10, 10]} />
                    )}
                    {selection?.type === 'ellipse' && (
                        <Ellipse ref={selectionShapeRef as React.Ref<Konva.Ellipse>} x={selection.x + selection.width / 2} y={selection.y + selection.height / 2} radiusX={selection.width / 2} radiusY={selection.height / 2} stroke="white" strokeWidth={2 / imageScale} dash={[10, 10]} />
                    )}
                    {(selection?.type === 'polygon' || selection?.type === 'lasso') && (
                        <Line ref={selectionShapeRef as React.Ref<Konva.Line>} points={flattenPoints(selection.points)} closed={true} stroke="white" strokeWidth={2 / imageScale} dash={[10, 10]} />
                    )}
                    {/* Live drawing preview */}
                    {isDrawing && activeTool === 'lasso' && (
                        <Line points={flattenPoints(currentPoints)} stroke="white" strokeWidth={2 / imageScale} />
                    )}
                    {activeTool === 'polygon' && currentPoints.length > 0 && (
                        <Line points={flattenPoints(currentPoints)} stroke="white" strokeWidth={2 / imageScale} />
                    )}
                 </Layer>
            </Stage>
        </div>
    );
};

export default EditorCanvas;