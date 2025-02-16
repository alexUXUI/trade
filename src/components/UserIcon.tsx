import React, { useState } from 'react';
import { AccountModal } from './AccountModal';

export function UserIcon() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('Modal state:', isModalOpen); // Add this to debug

    return (
        <>
            <button
                onClick={() => {
                    console.log('Button clicked'); // Add this to debug
                    setIsModalOpen(true);
                }}
                className="fixed top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Open account details"
            >
                <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            </button>
            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}