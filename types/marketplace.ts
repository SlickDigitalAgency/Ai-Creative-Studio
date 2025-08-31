
export interface MarketplaceListing {
  id: string;
  // Fix: Added 'Social Media Ad' to the designType union to allow for this type of listing in the marketplace.
  designType: 'Business Card' | 'Thumbnail' | 'Logo' | 'Flyer' | 'Poster' | 'Social Media Ad';
  previewUrl: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl: string;
  pricingModel: 'fixed' | 'auction';
  price: number; // For fixed price
  currentBid?: number; // For auctions
  endDate?: string; // For auctions
  tags: string[];
  createdAt: string;
}
