'use client';
import React, { useState } from 'react';

export default function ToggleResultButton({ testId, initialStatus }: { testId: string, initialStatus: boolean }) {
    const [isPublishing, setIsPublishing] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/tests/toggle-results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, showResults: !isPublishing })
            });
            if (response.ok) {
                setIsPublishing(!isPublishing);
            } else {
                alert('Failed to update result status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isPublishing ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
            {isLoading ? 'Updating...' : isPublishing ? 'Results Published' : 'Results Hidden'}
        </button>
    )
}
