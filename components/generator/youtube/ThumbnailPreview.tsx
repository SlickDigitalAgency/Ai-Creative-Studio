import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import Spinner from '../../ui/Spinner';
import { ThumbnailStyle } from '../../../pages/generator/youtube/ThumbnailGeneratorPage';
import ImageIcon from '../../icons/ImageIcon';

interface Props {
    stageRef: React.RefObject<Konva.Stage>;
    title: string;
    subtitle: string;
    headshot: string | null;
    background: string | null;
    isLoading: boolean;
    style: ThumbnailStyle;
}

const URLImage = ({ src, ...props }: { src: string, [key: string]: any }) => {
    // Fix: Corrected 'Anonymous' to 'anonymous' for the crossOrigin property, as it is case-sensitive.
    const [image] = useImage(src, 'anonymous');
    return <KonvaImage image={image} {...props} />;
};

const ThumbnailPreview: React.FC<Props> = ({ stageRef, title, subtitle, headshot, background, isLoading, style }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });
    
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: width,
                    height: width * (9 / 16)
                });
            }
        };
        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            // Fix: Corrected typo from containerref to containerRef
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    // Fix: Corrected 'Anonymous' to 'anonymous' for the crossOrigin property, as it is case-sensitive.
    const [headshotImage] = useImage(headshot || '', 'anonymous');
    let headshotWidth = 0;
    let headshotHeight = 0;
    if (headshotImage) {
        const aspectRatio = headshotImage.width / headshotImage.height;
        headshotWidth = 1280 * 0.5; // Make headshot larger
        headshotHeight = headshotWidth / aspectRatio;
    }

    const scale = dimensions.width / 1280;

    return (
        <div ref={containerRef} className="w-full aspect-video bg-muted/40 rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg">
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-foreground z-20">
                    <Spinner className="w-8 h-8" />
                    <p className="mt-2 text-lg">Generating masterpiece...</p>
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
                        <URLImage src={background} width={1280} height={720} />
                    ) : (
                        <></> 
                    )}
                    
                    {/* Placeholder */}
                    {!background && !isLoading && (
                        <Text 
                            text="AI Generated Background will appear here"
                            width={1280}
                            height={720}
                            align="center"
                            verticalAlign="middle"
                            fontSize={40}
                            fill="#9ca3af"
                            fontFamily="Poppins"
                        />
                    )}

                    {/* Headshot */}
                    {headshot && headshotImage && (
                        <URLImage
                            src={headshot}
                            x={1280 - headshotWidth + (1280 * 0.05)}
                            y={720 - headshotHeight + (720 * 0.05)}
                            width={headshotWidth}
                            height={headshotHeight}
                            shadowColor="black"
                            shadowBlur={30}
                            shadowOpacity={0.6}
                            shadowOffsetX={5}
                            shadowOffsetY={5}
                        />
                    )}

                    {/* Title */}
                    <Text
                        text={title}
                        x={0}
                        y={50}
                        width={1280}
                        height={300}
                        align="center"
                        verticalAlign="middle"
                        fill={style.titleColor}
                        fontSize={style.titleFontSize}
                        fontFamily="Montserrat"
                        fontStyle="900" // Corresponds to font-extrabold or font-black
                        lineHeight={1.1}
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.7}
                        shadowOffsetX={5}
                        shadowOffsetY={5}
                        padding={20}
                    />

                    {/* Subtitle */}
                    {subtitle && (
                         <Text
                            text={subtitle}
                            x={0}
                            y={400}
                            width={1280}
                            height={200}
                            align="center"
                            verticalAlign="middle"
                            fill={style.subtitleColor}
                            fontSize={style.subtitleFontSize}
                            fontFamily="Montserrat"
                            fontStyle="700"
                            lineHeight={1.2}
                            shadowColor="black"
                            shadowBlur={8}
                            shadowOpacity={0.7}
                            shadowOffsetX={3}
                            shadowOffsetY={3}
                            padding={20}
                        />
                    )}
                </Layer>
            </Stage>

             {!background && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <ImageIcon className="w-12 h-12 mb-2" />
                </div>
            )}
        </div>
    );
};

export default ThumbnailPreview;