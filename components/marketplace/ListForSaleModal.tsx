
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';

export interface ListingDetails {
    title: string;
    description: string;
    pricingModel: 'fixed' | 'auction';
    price: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: ListingDetails) => void;
    designPreviewUrl: string;
}

const ListForSaleModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, designPreviewUrl }) => {
    const [details, setDetails] = useState<ListingDetails>({
        title: 'My Awesome Business Card Design',
        description: 'A professional and modern business card design created with AI Studio.',
        pricingModel: 'fixed',
        price: 10,
    });

    const handleInputChange = (field: keyof Omit<ListingDetails, 'price' | 'pricingModel'>, value: string) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Basic validation
        if (!details.title || (details.pricingModel === 'fixed' && details.price <= 0)) {
            // In a real app, show a toast error
            console.error("Validation failed");
            return;
        }
        onConfirm(details);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-background rounded-lg shadow-xl w-full max-w-lg relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-bold font-montserrat">List Your Design on the Marketplace</h2>
                            <p className="text-muted-foreground text-sm mt-1">Set a price and share your creation with the world.</p>
                        </div>
                        
                        <div className="p-6 border-t border-b border-border grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <img src={designPreviewUrl} alt="Design Preview" className="rounded-md aspect-[1.75] object-cover w-full shadow-md" />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={details.title} onChange={e => handleInputChange('title', e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={details.description} onChange={e => handleInputChange('description', e.target.value)} rows={3} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <Label className="mb-2 block">Pricing Model</Label>
                                <div className="flex gap-2">
                                    <Button 
                                        variant={details.pricingModel === 'fixed' ? 'default' : 'outline'}
                                        onClick={() => setDetails(p => ({...p, pricingModel: 'fixed'}))}
                                        className="flex-1"
                                    >Fixed Price</Button>
                                    <Button 
                                        variant={details.pricingModel === 'auction' ? 'default' : 'outline'}
                                        onClick={() => setDetails(p => ({...p, pricingModel: 'auction'}))}
                                        className="flex-1"
                                    >Auction</Button>
                                </div>
                            </div>
                             <div>
                                <Label htmlFor="price">{details.pricingModel === 'fixed' ? 'Price (USD)' : 'Starting Bid (USD)'}</Label>
                                <Input id="price" type="number" value={details.price} onChange={e => setDetails(p => ({...p, price: parseFloat(e.target.value) || 0}))} />
                            </div>
                        </div>

                        <div className="p-6 flex justify-end gap-3 border-t border-border">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSubmit}>List Now</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ListForSaleModal;
