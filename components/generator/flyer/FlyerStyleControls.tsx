
import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { FlyerStyle } from '../../../types/flyer';
import { Separator } from '../../ui/Separator';

interface Props {
    style: FlyerStyle;
    setStyle: (style: FlyerStyle) => void;
}

const FlyerStyleControls: React.FC<Props> = ({ style, setStyle }) => {

    const handleStyleChange = <K extends keyof FlyerStyle>(key: K, value: FlyerStyle[K]) => {
        setStyle({ ...style, [key]: value });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-semibold mb-4">Flyer Styling</h2>
                
                <h3 className="text-md font-medium mb-2">Headline</h3>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="headline-color">Color</Label>
                        <Input id="headline-color" type="color" value={style.headlineColor} onChange={(e) => handleStyleChange('headlineColor', e.target.value)} className="p-1 h-10" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="headline-size">Font Size ({style.headlineFontSize})</Label>
                        <Input id="headline-size" type="range" min="40" max="200" value={style.headlineFontSize} onChange={(e) => handleStyleChange('headlineFontSize', parseInt(e.target.value, 10))} />
                    </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-md font-medium mb-2">Body Text</h3>
                 <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="body-color">Color</Label>
                        <Input id="body-color" type="color" value={style.bodyColor} onChange={(e) => handleStyleChange('bodyColor', e.target.value)} className="p-1 h-10" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="body-size">Font Size ({style.bodyFontSize})</Label>
                        <Input id="body-size" type="range" min="20" max="80" value={style.bodyFontSize} onChange={(e) => handleStyleChange('bodyFontSize', parseInt(e.target.value, 10))} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlyerStyleControls;
