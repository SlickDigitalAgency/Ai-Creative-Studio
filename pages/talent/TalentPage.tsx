import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { JobListing } from '../../types/talent';
import { Button } from '../../components/ui/Button';
import JobCard from '../../components/talent/JobCard';
import PostJobModal, { JobDetails } from '../../components/talent/PostJobModal';
import { useToast } from '../../components/ui/Toast';

// Mock data for job listings
const mockJobs: JobListing[] = [
    {
        id: 'job-1', title: 'Need a Modern Logo for a Tech Startup',
        category: 'Logo Design',
        description: 'We are looking for a clean, modern, and scalable logo for our new SaaS platform. Should convey innovation and trust. Please provide portfolio links.',
        budget: 500,
        postedBy: 'John Doe', posterAvatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
        createdAt: new Date().toISOString()
    },
    {
        id: 'job-2', title: 'YouTube Channel Thumbnails (Gaming)',
        category: 'Thumbnail Design',
        description: 'Seeking a talented designer for ongoing thumbnail work for a gaming channel. Must have an exciting and eye-catching style. We post 3 videos a week.',
        budget: 150,
        postedBy: 'Jane Smith', posterAvatarUrl: 'https://randomuser.me/api/portraits/women/75.jpg',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'job-3', title: 'Facebook Ad Campaign for E-commerce Store',
        category: 'Ad Campaign',
        description: 'We need a set of 5-10 ad creatives for our new product launch. The target audience is young adults. The ads should be vibrant and mobile-first.',
        budget: 800,
        postedBy: 'Sam Wilson', posterAvatarUrl: 'https://randomuser.me/api/portraits/men/80.jpg',
        createdAt: new Date(Date.now() - 172800000).toISOString()
    }
];

const TalentPage = () => {
    const { toast } = useToast();
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    
    const handleConfirmPostJob = (details: JobDetails) => {
        console.log("New job details:", details);
        // In a real app, you'd save this to a database
        toast({ title: "Success!", description: "Your job has been posted to the Talent Hub." });
        setIsPostModalOpen(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
        >
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Talent Hub</h1>
                <Button onClick={() => setIsPostModalOpen(true)}>Post a Job</Button>
            </div>
            <div className="flex-1 overflow-y-auto mt-6">
                <div className="space-y-6">
                    {mockJobs.map((job, index) => (
                        <motion.div
                           key={job.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <JobCard job={job} />
                        </motion.div>
                    ))}
                </div>
            </div>
             <PostJobModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onConfirm={handleConfirmPostJob}
             />
        </motion.div>
    );
};

export default TalentPage;
