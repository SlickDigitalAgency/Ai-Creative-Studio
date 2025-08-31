import React from 'react';
import Spinner from '../../ui/Spinner';
import PenToolIcon from '../../icons/PenToolIcon';
import { GeneratedLogo } from '../../../types/logo';
import { motion } from 'framer-motion';

interface Props {
    logos: GeneratedLogo[];
    isLoading: boolean;
}

const LogoPreviewGrid: React.FC<Props> = ({ logos, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground">
                <Spinner className="w-10 h-10" />
                <p className="mt-4 text-xl">Generating brilliant logo concepts...</p>
                <p className="text-muted-foreground">This may take a moment.</p>
            </div>
        );
    }
    
    if (logos.length === 0) {
        return (
             <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <PenToolIcon className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Your Logo Concepts Will Appear Here</h3>
                <p>Fill in your brand details and click "Generate Logos" to see the magic happen.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 p-4">
                {logos.map((logo, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-background p-6 rounded-lg shadow-lg aspect-square flex items-center justify-center hover:shadow-primary/20 transition-shadow"
                    >
                        <div 
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: logo.svg }} 
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LogoPreviewGrid;
