import React from 'react';
import { JobListing } from '../../types/talent';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';

interface Props {
    job: JobListing;
}

const JobCard: React.FC<Props> = ({ job }) => {
    return (
        <Card className="transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="mt-1">
                            Posted by {job.postedBy}
                        </CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-2xl font-bold text-primary">${job.budget.toLocaleString()}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                        {job.category}
                    </span>
                </div>
                <p className="text-muted-foreground line-clamp-3">{job.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <p className="text-xs text-muted-foreground">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                 </p>
                <Button>Apply Now</Button>
            </CardFooter>
        </Card>
    );
};

export default JobCard;
