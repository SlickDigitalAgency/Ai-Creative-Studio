
import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import Spinner from '../../ui/Spinner';
import { FlyerInputs, FlyerStyle } from '../../../types/flyer';
import FileTextIcon from '../../icons/FileTextIcon';

interface Props {
    stageRef: React.RefObject<Konva.Stage>;
    inputs: FlyerInputs;
    style: FlyerStyle;
    background: string | null;
    isLoading: boolean;
}

const URLImage = ({ src, ...props }: { src: string, [key: string]: any }) => {
    const [image] = useImage(src, 'anonymous');
    return <KonvaImage image={image} {...props} />;
};

const FlyerPreview: React.FC<Props> = ({ stageRef, inputs, style, background, isLoading }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: width,
                    height: width * (11 / 8.5) // 8.5" x 11" aspect ratio
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const flyerWidth = 850;
    const flyerHeight = 1100;
    const scale = dimensions.width / flyerWidth;

    return (
        <div ref={containerRef} className="w-full max-w-md mx-auto aspect-[8.5/11] bg-muted/40 rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-foreground z-20">
                    <Spinner className="w-8 h-8" />
                    <p className="mt-2 text-lg">Creating your flyer...</p>
                </div>
            )}
            <Stage 
                ref={stageRef}
                width={dimensions.width} 
                height={dimensions.height}
                scaleX={scale}
                scaleY={scale}
                className={isLoading ? 'invisible' : ''}
            >
                <Layer>
                    {/* Background */}
                    {background ? (
                        <URLImage src={background} width={flyerWidth} height={flyerHeight} />
                    ) : (
                       <Rect width={flyerWidth} height={flyerHeight} fill="#f1f5f9" />
                    )}

                    {/* Headline */}
                    <Text
                        text={inputs.headline}
                        x={50}
                        y={100}
                        width={flyerWidth - 100}
                        fill={style.headlineColor}
                        fontSize={style.headlineFontSize}
                        fontFamily="Montserrat"
                        fontStyle="900"
                        align="center"
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.7}
                    />

                    {/* Body Text */}
                    <Text
                        text={inputs.bodyText}
                        x={100}
                        y={300}
                        width={flyerWidth - 200}
                        fill={style.bodyColor}
                        fontSize={style.bodyFontSize}
                        fontFamily="Poppins"
                        align="center"
                        lineHeight={1.4}
                        shadowColor="black"
                        shadowBlur={5}
                        shadowOpacity={0.7}
                    />

                    {/* Event Details */}
                    <Text
                        text={inputs.eventDetails}
                        x={50}
                        y={flyerHeight - 250}
                        width={flyerWidth - 100}
                        fill={style.bodyColor}
                        fontSize={style.bodyFontSize * 0.9}
                        fontFamily="Poppins"
                        fontStyle="bold"
                        align="center"
                    />

                    {/* CTA Button */}
                    <Rect 
                        x={(flyerWidth - 400) / 2}
                        y={flyerHeight - 150}
                        width={400}
                        height={80}
                        fill="#6C5CE7"
                        cornerRadius={15}
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.5}
                    />
                    <Text
                        text={inputs.cta}
                        x={(flyerWidth - 400) / 2}
                        y={flyerHeight - 150}
                        width={400}
                        height={80}
                        fill="#FFFFFF"
                        fontSize={45}
                        fontFamily="Montserrat"
                        fontStyle="700"
                        align="center"
                        verticalAlign="middle"
                    />
                </Layer>
            </Stage>

             {!background && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <FileTextIcon className="w-16 h-16 mb-4" />
                    <p className="text-center">AI generated background will appear here</p>
                </div>
            )}
        </div>
    );
};

export default FlyerPreview;
