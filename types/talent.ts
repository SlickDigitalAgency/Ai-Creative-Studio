export interface JobListing {
  id: string;
  title: string;
  category: 'Logo Design' | 'Branding' | 'Ad Campaign' | 'Thumbnail Design' | 'Custom Graphics';
  description: string;
  budget: number;
  postedBy: string; // User's display name
  posterAvatarUrl: string;
  createdAt: string;
}
