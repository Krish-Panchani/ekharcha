import { UserButton } from '@clerk/nextjs';
import React from 'react';

const DashboardHeader = () => (
    <header className="sticky top-0 bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">eKharcha</h1>
            <img src="/path/to/your/user-logo.svg" alt="User Logo" className="h-8 w-8" />
        </div>
        <UserButton />
    </header>
);

export default React.memo(DashboardHeader);
