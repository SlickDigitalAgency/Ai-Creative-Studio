
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import SparklesIcon from '../../components/icons/SparklesIcon';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user } = useAuth();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-1 flex-col"
        >
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            </div>
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-4"
            >
                <div className="flex flex-col items-center gap-1 text-center p-4">
                    <SparklesIcon className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-2xl font-bold tracking-tight">
                        Welcome, {user?.displayName || 'Creator'}!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        You're ready to start creating. Choose a tool to begin.
                    </p>
                    <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                       <Link to="/generator/youtube-thumbnail">
                           <SparklesIcon className="w-4 h-4 mr-2" /> Start Creating
                       </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default DashboardPage;
