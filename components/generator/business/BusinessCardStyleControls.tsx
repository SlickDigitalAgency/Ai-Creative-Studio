
import React from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { BusinessCardStyle } from '../../../types/business';

interface Props {
    style: BusinessCardStyle;
    setStyle: (style: BusinessCardStyle) => void;
}

const BusinessCardStyleControls: React.FC<Props> = ({ style, setStyle }) => {

    const handleStyleChange = <K extends keyof BusinessCardStyle>(key: K, value: BusinessCardStyle[K]) => {
        setStyle({ ...style, [key]: value });
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                <h2 className="text-lg font-semibold mb-4">Styling</h2>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="text-color">Text Color</Label>
                        <Input id="text-color" type="color" value={style.textColor} onChange={(e) => handleStyleChange('textColor', e.target.value)} className="p-1 h-10 w-full" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="text-size">Base Font Size ({style.fontSize})</Label>
                        <Input id="text-size" type="range" min="6" max="16" value={style.fontSize} onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value, 10))} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessCardStyleControls;
