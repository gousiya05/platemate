import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { RemixReview } from './types';

// --- ICONS --- //
const UserCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg>;
const ThumbUpIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isFilled ? 0 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.586 1.08-.956 1.558a9.041 9.041 0 00-2.861 2.4c-.498.634-1.225 1.08-2.031 1.08a.75.75 0 01-.75-.75V10.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5a2.25 2.25 0 00-2.25 2.25v3.75a2.25 2.25 0 002.25 2.25h3.75a2.25 2.25 0 002.25-2.25v-3.75a2.25 2.25 0 00-2.25-2.25H6z" /></svg>;
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const ChatBubbleOvalLeftEllipsisIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;

// --- HELPER FUNCTIONS --- //
const timeAgo = (timestamp) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
}

// --- SUB-COMPONENTS --- //
const RemixReviewCard = ({ review, onUpvote, isUpvoted }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm flex gap-4">
        <UserCircleIcon className="h-10 w-10 text-gray-300 flex-shrink-0" />
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800">{review.reviewerName}</p>
                    <p className="text-xs text-gray-400">{timeAgo(review.timestamp)}</p>
                </div>
                <button onClick={() => onUpvote(review.id)} className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full transition-colors ${isUpvoted ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    <ThumbUpIcon className="h-4 w-4" isFilled={isUpvoted} />
                    <span>{review.upvotes}</span>
                </button>
            </div>
            <p className="mt-2 text-gray-600">{review.tip}</p>
        </div>
    </div>
);

const RemixSubmissionForm = ({ recipeId, onAddReview }) => {
    const [name, setName] = useState('');
    const [tip, setTip] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tip.trim() || !name.trim()) {
            setError('Please enter your name and remix idea.');
            return;
        }
        onAddReview(recipeId, name, tip);
        setName('');
        setTip('');
        setError('');
    };

    return (
        <div className="bg-green-50/70 p-6 rounded-2xl border border-green-200">
            <h4 className="font-bold text-lg text-green-800">Share Your Remix Idea!</h4>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                 <div>
                    <label htmlFor="remix-name" className="sr-only">Your Name</label>
                    <input
                        id="remix-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="remix-idea" className="sr-only">Your Remix Idea</label>
                    <textarea
                        id="remix-idea"
                        rows={3}
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                        placeholder="e.g., I used leftover rice instead of breadcrumbs..."
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Submit
                </button>
            </form>
        </div>
    );
};

// --- MAIN COMPONENT --- //
export default function RemixReviews({ recipeId, reviews, onAddReview, onUpvoteReview, upvotedReviewIds }) {
    const [sortBy, setSortBy] = useState('Most Recent');
    const [isSortOpen, setSortOpen] = useState(false);
    const sortOptions = ['Most Recent', 'Most Helpful'];
    const sortRef = useRef(null);

    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            if (sortBy === 'Most Helpful') {
                return b.upvotes - a.upvotes;
            }
            // Default to 'Most Recent'
            return b.timestamp - a.timestamp;
        });
    }, [reviews, sortBy]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 text-orange-500" />
                    Remix Reviews
                </h3>
                <div className="relative" ref={sortRef}>
                    <button onClick={() => setSortOpen(prev => !prev)} className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-50 transition">
                        Sort by: {sortBy}
                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10">
                            {sortOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => { setSortBy(option); setSortOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <RemixSubmissionForm recipeId={recipeId} onAddReview={onAddReview} />
                </div>
                <div className="md:col-span-2 space-y-4">
                    {sortedReviews.length > 0 ? (
                        sortedReviews.map(review => (
                            <RemixReviewCard
                                key={review.id}
                                review={review}
                                onUpvote={onUpvoteReview}
                                isUpvoted={upvotedReviewIds.has(review.id)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 px-6 bg-gray-100 rounded-lg">
                            <p className="text-gray-500">No remix ideas yet. Be the first to share one!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}