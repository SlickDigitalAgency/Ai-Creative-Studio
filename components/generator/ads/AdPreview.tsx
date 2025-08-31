import React from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import Spinner from '../../ui/Spinner';
import MegaphoneIcon from '../../icons/MegaphoneIcon';
import { SocialPlatformFormat, AdCampaignInputs, AdStyle } from '../../../types/ads';

const URLImage = ({ src, ...props }: { src: string, [key: string]: any }) => {
    // Fix: Corrected 'Anonymous' to 'anonymous' for the crossOrigin property, as it is case-sensitive.
    const [image] = useImage(src, 'anonymous');
    return <KonvaImage image={image} {...props} />;
};

interface SingleAdPreviewProps {
    format: SocialPlatformFormat;
    background: string | null;
    inputs: AdCampaignInputs;
    style: AdStyle;
}

const SingleAdPreview: React.FC<SingleAdPreviewProps> = ({ format, background, inputs, style }) => {
    const containerWidth = 250; 
    const scale = containerWidth / format.width;
    const containerHeight = format.height * scale;

    return (
        <div className="flex flex-col items-center gap-2">
            <h4 className="text-sm font-medium">{format.platform} - {format.name}</h4>
            <div className="shadow-lg rounded-lg overflow-hidden">
                <Stage width={containerWidth} height={containerHeight} scaleX={scale} scaleY={scale}>
                    <Layer>
                        {background ? <URLImage src={background} width={format.width} height={format.height} /> : <Rect width={format.width} height={format.height} fill="#333" />}
                        
                        <Text
                            text={inputs.headline}
                            x={20}
                            y={format.height * 0.2}
                            width={format.width - 40}
                            fill={style.textColor}
                            fontSize={style.fontSize}
                            fontFamily="Montserrat"
                            fontStyle="900"
                            align="center"
                            shadowColor="black"
                            shadowBlur={10}
                            shadowOpacity={0.7}
                        />

                         <Text
                            text={inputs.bodyText}
                            x={20}
                            y={format.height * 0.5}
                            width={format.width - 40}
                            fill={style.textColor}
                            fontSize={style.fontSize * 0.5}
                            fontFamily="Poppins"
                            align="center"
                            lineHeight={1.3}
                            shadowColor="black"
                            shadowBlur={8}
                            shadowOpacity={0.8}
                        />

                        <Rect 
                            x={(format.width - 300) / 2}
                            y={format.height - 150}
                            width={300}
                            height={80}
                            fill="#6C5CE7"
                            cornerRadius={10}
                        />
                        <Text
                            text={inputs.cta}
                            x={(format.width - 300) / 2}
                            y={format.height - 150}
                            width={300}
                            height={80}
                            fill="#FFFFFF"
                            fontSize={40}
                            fontFamily="Montserrat"
                            fontStyle="700"
                            align="center"
                            verticalAlign="middle"
                        />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

interface AdPreviewProps {
    formats: SocialPlatformFormat[];
    backgrounds: Record<string, string>;
    inputs: AdCampaignInputs;
    style: AdStyle;
    isLoading: boolean;
}

const AdPreview: React.FC<AdPreviewProps> = ({ formats, backgrounds, inputs, style, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground">
                <Spinner className="w-10 h-10" />
                <p className="mt-4 text-xl">Generating amazing ads...</p>
                <p className="text-muted-foreground">This may take a moment.</p>
            </div>
        );
    }
    
    if (formats.length === 0) {
        return (
             <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <MegaphoneIcon className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Your Ad Previews Will Appear Here</h3>
                <p>Select platforms and formats, fill in your ad content, and hit "Generate Ads" to get started.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                {formats.map(format => (
                    <SingleAdPreview 
                        key={format.id}
                        format={format}
                        background={backgrounds[format.id] || null}
                        inputs={inputs}
                        style={style}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdPreview;