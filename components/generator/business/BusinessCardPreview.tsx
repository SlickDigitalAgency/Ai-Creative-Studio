

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import Spinner from '../../ui/Spinner';
import { BusinessCardInputs, BusinessCardStyle } from '../../../types/business';
import IdCardIcon from '../../icons/IdCardIcon';

interface Props {
    stageRef: React.RefObject<Konva.Stage>;
    inputs: BusinessCardInputs;
    style: BusinessCardStyle;
    background: string | null;
    isLoading: boolean;
}

const URLImage = ({ src, ...props }: { src: string, [key: string]: any }) => {
    const [image] = useImage(src, 'anonymous');
    return <KonvaImage image={image} {...props} />;
};

const BusinessCardPreview: React.FC<Props> = ({ stageRef, inputs, style, background, isLoading }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: width,
                    height: width * (2 / 3.5) // 3.5" x 2" aspect ratio
                });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cardWidth = 350;
    const cardHeight = 200;
    const scale = dimensions.width / cardWidth;

    return (
        <div ref={containerRef} className="w-full max-w-lg mx-auto aspect-[3.5/2] bg-muted/40 rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-foreground z-20">
                    <Spinner className="w-8 h-8" />
                    <p className="mt-2 text-lg">Designing your card...</p>
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
                        <URLImage src={background} width={cardWidth} height={cardHeight} />
                    ) : (
                       <Rect width={cardWidth} height={cardHeight} fill="#f1f5f9" />
                    )}

                    {/* Company Name */}
                    <Text
                        text={inputs.company.toUpperCase()}
                        x={20}
                        y={20}
                        width={cardWidth - 40}
                        fill={style.textColor}
                        fontSize={style.fontSize * 1.5}
                        fontFamily="Montserrat"
                        fontStyle="bold"
                        letterSpacing={2}
                    />

                    {/* Name */}
                    <Text
                        text={inputs.name}
                        x={20}
                        y={80}
                        width={cardWidth - 40}
                        fill={style.textColor}
                        fontSize={style.fontSize * 2.2}
                        fontFamily="Montserrat"
                        fontStyle="bold"
                    />

                    {/* Title */}
                    <Text
                        text={inputs.title}
                        x={20}
                        y={105}
                        width={cardWidth - 40}
                        fill={style.textColor}
                        fontSize={style.fontSize * 1.2}
                        fontFamily="Poppins"
                        opacity={0.8}
                    />

                    {/* Contact Info */}
                    <Text
                        text={`${inputs.phone}\n${inputs.email}\n${inputs.website}`}
                        x={20}
                        y={140}
                        width={cardWidth - 40}
                        align="right"
                        fill={style.textColor}
                        fontSize={style.fontSize * 0.9}
                        fontFamily="Poppins"
                        lineHeight={1.5}
                    />
                </Layer>
            </Stage>

             {!background && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <IdCardIcon className="w-12 h-12 mb-2" />
                    <p className="text-center">AI generated background will appear here</p>
                </div>
            )}
        </div>
    );
};

export default BusinessCardPreview;