import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { JobListing } from '../../types/talent';

export type JobDetails = Omit<JobListing, 'id' | 'postedBy' | 'posterAvatarUrl' | 'createdAt'>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: JobDetails) => void;
}

const PostJobModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    const [details, setDetails] = useState<JobDetails>({
        title: '',
        description: '',
        category: 'Custom Graphics',
        budget: 50,
    });

    const handleInputChange = (field: keyof Omit<JobDetails, 'budget' | 'category'>, value: string) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!details.title || !details.description || details.budget <= 0) {
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
                        className="bg-background rounded-lg shadow-xl w-full max-w-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-bold font-montserrat">Post a Job</h2>
                            <p className="text-muted-foreground text-sm mt-1">Describe your project to find the perfect creative.</p>
                        </div>
                        
                        <div className="p-6 border-t border-b border-border space-y-4">
                            <div>
                                <Label htmlFor="job-title">Job Title</Label>
                                <Input id="job-title" placeholder="e.g., Modern Logo for a Tech Startup" value={details.title} onChange={e => handleInputChange('title', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="job-description">Description</Label>
                                <Textarea id="job-description" placeholder="Describe the work you need done, including project goals, deliverables, and any specific requirements." value={details.description} onChange={e => handleInputChange('description', e.target.value)} rows={5} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="job-category">Category</Label>
                                    <select
                                        id="job-category"
                                        value={details.category}
                                        onChange={(e) => setDetails(p => ({ ...p, category: e.target.value as JobDetails['category'] }))}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option>Logo Design</option>
                                        <option>Branding</option>
                                        <option>Ad Campaign</option>
                                        <option>Thumbnail Design</option>
                                        <option>Custom Graphics</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="job-budget">Budget (USD)</Label>
                                    <Input id="job-budget" type="number" placeholder="e.g., 500" value={details.budget} onChange={e => setDetails(p => ({...p, budget: parseFloat(e.target.value) || 0}))} />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSubmit}>Post Job</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PostJobModal;
