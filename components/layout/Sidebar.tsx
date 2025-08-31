

import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import { Button } from '../ui/Button';
import LayoutDashboardIcon from '../icons/LayoutDashboardIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '../../lib/utils';
import ImageIcon from '../icons/ImageIcon';
import MegaphoneIcon from '../icons/MegaphoneIcon';
import PenToolIcon from '../icons/PenToolIcon';

const Sidebar = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-secondary text-primary"
        );
        
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Logo />
                    </NavLink>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <NavLink to="/dashboard" className={navLinkClasses}>
                            <LayoutDashboardIcon className="h-4 w-4" />
                            Dashboard
                        </NavLink>
                         <NavLink to="/generator/youtube-thumbnail" className={navLinkClasses}>
                            <ImageIcon className="h-4 w-4" />
                            Thumbnail Generator
                        </NavLink>
                         <NavLink to="/generator/social-media-ad" className={navLinkClasses}>
                            <MegaphoneIcon className="h-4 w-4" />
                            Ad Generator
                        </NavLink>
                        <NavLink to="/generator/logo" className={navLinkClasses}>
                            <PenToolIcon className="h-4 w-4" />
                            Logo Generator
                        </NavLink>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                            <CardDescription>
                                Unlock all features and get unlimited access to our support team.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                                Upgrade
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;