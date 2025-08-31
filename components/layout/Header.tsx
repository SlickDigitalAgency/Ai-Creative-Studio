
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex-1 flex items-center justify-end">
                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium">{user.displayName || user.email}</p>
                                <p className="text-xs text-muted-foreground">{user.plan} Plan</p>
                            </div>
                            <Button onClick={logout} variant="outline" size="sm">
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
