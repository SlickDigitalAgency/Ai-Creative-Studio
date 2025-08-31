import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { AdStyle } from '../../../types/ads';

interface Props {
    style: AdStyle;
    setStyle: (style: AdStyle) => void;
}

const AdStyleControls: React.FC<Props> = ({ style, setStyle }) => {

    const handleStyleChange = <K extends keyof AdStyle>(key: K, value: AdStyle[K]) => {
        setStyle({ ...style, [key]: value });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                <h2 className="text-lg font-semibold mb-4 text-center">Styling</h2>
                <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="grid gap-2">
                        <Label htmlFor="text-color" className="text-center">Text Color</Label>
                        <Input id="text-color" type="color" value={style.textColor} onChange={(e) => handleStyleChange('textColor', e.target.value)} className="p-1 h-10 w-full" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="text-size" className="text-center">Font Size ({style.fontSize})</Label>
                        <Input id="text-size" type="range" min="20" max="150" value={style.fontSize} onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value, 10))} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdStyleControls;
