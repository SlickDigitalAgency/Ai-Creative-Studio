
import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { ThumbnailStyle } from '../../../pages/generator/youtube/ThumbnailGeneratorPage';
import { Separator } from '../../ui/Separator';

interface Props {
    style: ThumbnailStyle;
    setStyle: (style: ThumbnailStyle) => void;
}

const StyleControls: React.FC<Props> = ({ style, setStyle }) => {

    const handleStyleChange = <K extends keyof ThumbnailStyle>(key: K, value: ThumbnailStyle[K]) => {
        setStyle({ ...style, [key]: value });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-4">Styling</h2>
                
                <h3 className="text-md font-medium mb-2">Title</h3>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title-color">Color</Label>
                        <Input id="title-color" type="color" value={style.titleColor} onChange={(e) => handleStyleChange('titleColor', e.target.value)} className="p-1 h-10" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="title-size">Font Size ({style.titleFontSize})</Label>
                        <Input id="title-size" type="range" min="20" max="150" value={style.titleFontSize} onChange={(e) => handleStyleChange('titleFontSize', parseInt(e.target.value, 10))} />
                    </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-md font-medium mb-2">Subtitle</h3>
                 <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="subtitle-color">Color</Label>
                        <Input id="subtitle-color" type="color" value={style.subtitleColor} onChange={(e) => handleStyleChange('subtitleColor', e.target.value)} className="p-1 h-10" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="subtitle-size">Font Size ({style.subtitleFontSize})</Label>
                        <Input id="subtitle-size" type="range" min="10" max="100" value={style.subtitleFontSize} onChange={(e) => handleStyleChange('subtitleFontSize', parseInt(e.target.value, 10))} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StyleControls;
