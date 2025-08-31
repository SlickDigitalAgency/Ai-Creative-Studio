
import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import Spinner from '../../ui/Spinner';
import { PosterInputs, PosterStyle } from '../../../types/poster';
import GalleryHorizontalEndIcon from '../../icons/GalleryHorizontalEndIcon';

interface Props {
    stageRef: React.RefObject<Konva.Stage>;
    inputs: PosterInputs;
    style: PosterStyle;
    background: string | null;
    isLoading: boolean;
}

const URLImage = ({ src, ...props }: { src: string, [key: string]: any }) => {
    const [image] = useImage(src, 'anonymous');
    return <KonvaImage image={image} {...props} />;
};

const PosterPreview: React.FC<Props> = ({ stageRef, inputs, style, background, isLoading }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: width,
                    height: width * (4 / 3) // 18x24" or 3:4 aspect ratio
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const posterWidth = 1800;
    const posterHeight = 2400;
    const scale = dimensions.width / posterWidth;

    return (
        <div ref={containerRef} className="w-full max-w-lg mx-auto aspect-[3/4] bg-muted/40 rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-foreground z-20">
                    <Spinner className="w-8 h-8" />
                    <p className="mt-2 text-lg">Creating your poster...</p>
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
                        <URLImage src={background} width={posterWidth} height={posterHeight} />
                    ) : (
                       <Rect width={posterWidth} height={posterHeight} fill="#f1f5f9" />
                    )}

                    {/* Headline */}
                    <Text
                        text={inputs.headline}
                        x={100}
                        y={200}
                        width={posterWidth - 200}
                        height={posterHeight / 3}
                        fill={style.headlineColor}
                        fontSize={style.headlineFontSize}
                        fontFamily="Montserrat"
                        fontStyle="900"
                        align="center"
                        verticalAlign="top"
                        shadowColor="black"
                        shadowBlur={15}
                        shadowOpacity={0.7}
                    />

                    {/* Body Text */}
                    <Text
                        text={inputs.bodyText}
                        x={200}
                        y={posterHeight / 2 - 100}
                        width={posterWidth - 400}
                        fill={style.bodyColor}
                        fontSize={style.bodyFontSize}
                        fontFamily="Poppins"
                        align="center"
                        lineHeight={1.4}
                        shadowColor="black"
                        shadowBlur={8}
                        shadowOpacity={0.7}
                    />

                    {/* Event Details */}
                    <Text
                        text={inputs.eventDetails}
                        x={100}
                        y={posterHeight - 500}
                        width={posterWidth - 200}
                        fill={style.bodyColor}
                        fontSize={style.bodyFontSize * 1.2}
                        fontFamily="Poppins"
                        fontStyle="bold"
                        align="center"
                    />

                    {/* CTA Button */}
                    <Rect 
                        x={(posterWidth - 800) / 2}
                        y={posterHeight - 300}
                        width={800}
                        height={150}
                        fill="#6C5CE7"
                        cornerRadius={25}
                        shadowColor="black"
                        shadowBlur={15}
                        shadowOpacity={0.5}
                    />
                    <Text
                        text={inputs.cta}
                        x={(posterWidth - 800) / 2}
                        y={posterHeight - 300}
                        width={800}
                        height={150}
                        fill="#FFFFFF"
                        fontSize={80}
                        fontFamily="Montserrat"
                        fontStyle="700"
                        align="center"
                        verticalAlign="middle"
                    />
                </Layer>
            </Stage>

             {!background && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <GalleryHorizontalEndIcon className="w-16 h-16 mb-4" />
                    <p className="text-center">AI generated background will appear here</p>
                </div>
            )}
        </div>
    );
};

export default PosterPreview;
