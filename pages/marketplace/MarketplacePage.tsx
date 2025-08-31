

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MarketplaceListing } from '../../types/marketplace';
import DesignCard from '../../components/marketplace/DesignCard';
import { Input } from '../../components/ui/Input';

// Mock data for marketplace items
const mockListings: MarketplaceListing[] = [
    {
        id: '1', designType: 'Business Card', title: 'Minimalist Tech Business Card',
        previewUrl: 'https://i.imgur.com/L8J09p7.png',
        description: 'A clean and modern business card template perfect for tech startups.',
        creatorId: 'user1', creatorName: 'Elena Weber', creatorAvatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        pricingModel: 'fixed', price: 15,
        tags: ['tech', 'minimalist', 'modern'], createdAt: new Date().toISOString()
    },
    {
        id: '2', designType: 'Thumbnail', title: 'Gaming Clash Thumbnail',
        previewUrl: 'https://images.unsplash.com/photo-1542773998-9325f0a098d7?q=80&w=400&auto=format&fit=crop',
        description: 'A high-energy thumbnail for gaming channels.',
        creatorId: 'user2', creatorName: 'Marcus Chen', creatorAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        pricingModel: 'auction', price: 0, currentBid: 50, endDate: new Date(Date.now() + 86400000).toISOString(),
        tags: ['gaming', 'youtube', 'thumbnail'], createdAt: new Date().toISOString()
    },
    {
        id: '3', designType: 'Flyer', title: 'Corporate Event Flyer',
        previewUrl: 'https://i.imgur.com/vBq2FzL.png',
        description: 'Professional flyer template for business summits and conferences.',
        creatorId: 'user3', creatorName: 'Sophia Rossi', creatorAvatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        pricingModel: 'fixed', price: 25,
        tags: ['corporate', 'flyer', 'business'], createdAt: new Date().toISOString()
    },
    {
        id: '4', designType: 'Poster', title: 'Indie Music Fest Poster',
        previewUrl: 'https://i.imgur.com/g8f4G5e.png',
        description: 'A retro and cool poster design for music festivals or concerts.',
        creatorId: 'user1', creatorName: 'Elena Weber', creatorAvatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        pricingModel: 'fixed', price: 30,
        tags: ['music', 'retro', 'poster'], createdAt: new Date().toISOString()
    },
     {
        id: '5', designType: 'Social Media Ad', title: 'Instagram Story Ad',
        previewUrl: 'https://i.imgur.com/kP8yD0J.png', // Using flyer preview as placeholder
        description: 'A vibrant ad template for Instagram stories.',
        creatorId: 'user2', creatorName: 'Marcus Chen', creatorAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        pricingModel: 'fixed', price: 18,
        tags: ['instagram', 'ad', 'social media'], createdAt: new Date().toISOString()
    },
    {
        id: '6', designType: 'Logo', title: 'Modern Tech Logo SVG',
        previewUrl: 'https://i.imgur.com/yX9H9jT.png', // Using poster preview as placeholder
        description: 'A futuristic and engaging logo for tech companies.',
        creatorId: 'user3', creatorName: 'Sophia Rossi', creatorAvatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
        pricingModel: 'auction', price: 0, currentBid: 75, endDate: new Date(Date.now() + 172800000).toISOString(),
        tags: ['tech', 'logo', 'svg', 'futuristic'], createdAt: new Date().toISOString()
    },
];

const MarketplacePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredListings = mockListings.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.designType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
        >
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Marketplace</h1>
                <div className="w-full sm:w-auto sm:max-w-xs">
                    <Input 
                        placeholder="Search designs, tags, or types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredListings.map((listing, index) => (
                         <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                         >
                            <DesignCard listing={listing} />
                        </motion.div>
                    ))}
                </div>
                {filteredListings.length === 0 && (
                     <div className="text-center py-20 text-muted-foreground">
                        <p>No designs found for "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MarketplacePage;