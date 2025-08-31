
import React from 'react';
import { MarketplaceListing } from '../../types/marketplace';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface Props {
    listing: MarketplaceListing;
}

const DesignCard: React.FC<Props> = ({ listing }) => {
    return (
        <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50">
            <div className="aspect-video overflow-hidden relative">
                <img src={listing.previewUrl} alt={listing.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-2 py-1 rounded-full">
                    {listing.designType}
                </div>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-md leading-tight truncate">{listing.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <img src={listing.creatorAvatarUrl} alt={listing.creatorName} className="w-6 h-6 rounded-full" />
                    <span>{listing.creatorName}</span>
                </div>
                <div className="mt-4 flex-1 flex items-end justify-between">
                    <div>
                        {listing.pricingModel === 'fixed' ? (
                            <>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="text-lg font-bold text-primary">${listing.price.toFixed(2)}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-muted-foreground">Current Bid</p>
                                <p className="text-lg font-bold text-accent">${listing.currentBid?.toFixed(2)}</p>
                            </>
                        )}
                    </div>
                    <Button size="sm" variant={listing.pricingModel === 'auction' ? 'secondary' : 'default'}>
                        {listing.pricingModel === 'auction' ? 'Place Bid' : 'Buy Now'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default DesignCard;
