import { UserButton } from '@clerk/nextjs';
import React from 'react';

const DashboardHeader = () => (
    <header className="sticky top-0 bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">eKharcha</h1>
        </div>
        <div className='w-10 h-10 rounded-full border-2 flex justify-center items-center border-black'>
            <UserButton />
        </div>
    </header>
);

export default React.memo(DashboardHeader);
