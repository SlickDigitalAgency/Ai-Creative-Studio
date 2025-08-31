
import React from 'react';
import { Separator } from '../ui/Separator';

const LayerPanel = () => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Layers</h2>
            <Separator />
            <div className="mt-4 bg-secondary p-2 rounded-md">
                <p className="text-sm">Base Image</p>
            </div>
        </div>
    );
};

export default LayerPanel;
