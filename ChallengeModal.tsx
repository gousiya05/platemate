import React, { useState, useEffect, useMemo } from 'react';
import type { Challenge, Submission, Vote, Recipe } from './types';
import { getOrCreateUserId } from './data';


// --- ICONS --- //
const XMarkIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const TrophyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 21l8 0"></path><path d="M12 17l0 4"></path><path d="M7 4l10 0"></path><path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path><path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path></svg>;
const ClockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ThumbUpIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isFilled ? 0 : 1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558-.586 1.08-.956 1.558a9.041 9.041 0 00-2.861 2.4c-.498.634-1.225 1.08-2.031 1.08a.75.75 0 01-.75-.75V10.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5a2.25 2.25 0 00-2.25 2.25v3.75a2.25 2.25 0 002.25 2.25h3.75a2.25 2.25 0 002.25-2.25v-3.75a2.25 2.25 0 00-2.25-2.25H6z" /></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const UserCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg>;

// --- MOCK DATA & HELPERS --- //
const initialChallenges: Challenge[] = [
    { id: 'challenge1', title: 'The Forgotten Veggie Challenge', description: 'Got some sad-looking veggies in the back of your fridge? Give them a new life!', requiredIngredients: ['Wilted Spinach', 'Stale Bread', 'Half an Onion'], startDate: new Date().toISOString(), endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'ACTIVE' },
    { id: 'challenge0', title: 'The Leftover Rice Race', description: 'What can you do with that box of day-old rice?', requiredIngredients: ['Cooked Rice'], startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'COMPLETED' },
];

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

// --- SUB-COMPONENTS --- //
const CountdownTimer = ({ endDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="flex space-x-4 justify-center">
            {Object.entries(timeLeft).map(([interval, value]) => (
                <div key={interval} className="text-center">
                    <div className="text-2xl font-bold text-green-600">{String(value).padStart(2, '0')}</div>
                    <div className="text-xs uppercase text-gray-500">{interval}</div>
                </div>
            ))}
            {Object.keys(timeLeft).length === 0 && <p className="text-lg font-bold text-red-500">Challenge Ended!</p>}
        </div>
    );
};

const SubmissionCard = ({ submission, recipe, voteCount, onVote, isVoted, isWinner }) => (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 flex flex-col group border-2 ${isWinner ? 'border-amber-400 shadow-amber-200' : 'border-transparent'}`}>
         {isWinner && <div className="py-1 px-3 bg-amber-400 text-center font-bold text-white text-sm">WINNER!</div>}
        <img className="h-40 w-full object-cover" src={recipe.image} alt={recipe.title} />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-md font-bold text-gray-800">{recipe.title}</h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center"><UserCircleIcon className="w-4 h-4 mr-1 text-gray-400" />Submitted by {submission.userName}</p>
        </div>
        <div className="p-4 bg-gray-50 flex items-center justify-between">
            <span className="font-bold text-lg text-green-600">{voteCount} Votes</span>
            <button onClick={onVote} className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition-all text-sm ${isVoted ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border-2 border-orange-200 hover:bg-orange-50'}`}>
                <ThumbUpIcon className="w-5 h-5" isFilled={isVoted} />
                <span>{isVoted ? 'Voted' : 'Vote'}</span>
            </button>
        </div>
    </div>
);

const SubmitRecipeView = ({ userRecipes, onBack, onSubmit }) => {
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Challenge
            </button>
            <h2 className="text-3xl font-bold text-gray-900">Select a Recipe to Submit</h2>
            <p className="text-gray-600 mt-2">Choose one of your creations that meets the challenge requirements.</p>
            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
                {userRecipes.map(recipe => (
                    <div 
                        key={recipe.id}
                        onClick={() => setSelectedRecipeId(recipe.id)}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedRecipeId === recipe.id ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    >
                        <img src={recipe.image} alt={recipe.title} className="w-16 h-16 rounded-md object-cover mr-4"/>
                        <p className="font-semibold text-gray-800">{recipe.title}</p>
                    </div>
                ))}
            </div>
             {userRecipes.length === 0 && (
                <div className="text-center py-10 px-6 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">You haven't created any recipes yet! Go to "Share Recipe" to add one.</p>
                </div>
            )}
            <div className="mt-8 text-right">
                <button onClick={() => onSubmit(selectedRecipeId)} disabled={!selectedRecipeId} className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-orange-600 disabled:bg-gray-300">
                    Submit Entry
                </button>
            </div>
        </div>
    );
};

// --- MAIN MODAL COMPONENT --- //
interface ChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChallengeModal({ isOpen, onClose }: ChallengeModalProps) {
    const [challenges, setChallenges] = useLocalStorage<Challenge[]>('plateMateChallenges', initialChallenges);
    const [submissions, setSubmissions] = useLocalStorage<Submission[]>('plateMateSubmissions', []);
    const [votes, setVotes] = useLocalStorage<Vote[]>('plateMateVotes', []);
    const [allRecipes] = useLocalStorage<Recipe[]>('plateMateRecipes', []);
    const [view, setView] = useState<'main' | 'submit'>('main');
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
    
    const userId = getOrCreateUserId();
    const username = 'User-' + userId.substring(5, 9);


    const activeChallenge = useMemo(() => challenges.find(c => c.status === 'ACTIVE' && new Date(c.endDate) > new Date()), [challenges]);
    const pastChallenges = useMemo(() => challenges.filter(c => c.status === 'COMPLETED' || new Date(c.endDate) <= new Date()), [challenges]);

    const userRecipes = useMemo(() => allRecipes.filter(r => r.userId === userId), [allRecipes, userId]);
    
    const userHasSubmitted = useMemo(() => {
        if (!activeChallenge) return false;
        return submissions.some(s => s.challengeId === activeChallenge.id && s.userId === userId);
    }, [activeChallenge, submissions, userId]);

    const userVoteInChallenge = useMemo(() => {
        if(!activeChallenge) return null;
        const challengeSubmissions = submissions.filter(s => s.challengeId === activeChallenge.id);
        const userVote = votes.find(v => v.userId === userId && challengeSubmissions.some(cs => cs.id === v.submissionId));
        return userVote ? userVote.submissionId : null;
    }, [activeChallenge, submissions, votes, userId]);

    const handleVote = (submissionId: string) => {
        setVotes(prevVotes => {
            // Retract vote if it exists
            if (prevVotes.some(v => v.submissionId === submissionId && v.userId === userId)) {
                return prevVotes.filter(v => !(v.submissionId === submissionId && v.userId === userId));
            }
            // Remove previous vote in this challenge if it exists
            const challengeSubmissionIds = submissions.filter(s => s.challengeId === activeChallenge.id).map(s => s.id);
            const otherVotesRemoved = prevVotes.filter(v => !(v.userId === userId && challengeSubmissionIds.includes(v.submissionId)));
            // Add new vote
            return [...otherVotesRemoved, { submissionId, userId }];
        });
    };
    
    const handleSubmitRecipe = (recipeId: number | null) => {
        if (!recipeId || !activeChallenge) return;
        const newSubmission: Submission = {
            id: `sub_${Date.now()}`,
            challengeId: activeChallenge.id,
            recipeId,
            userId,
            userName: username,
            notes: 'My creative entry!',
            createdAt: new Date().toISOString(),
        };
        setSubmissions(prev => [newSubmission, ...prev]);
        setView('main');
    };
    
    const getSubmissionsForChallenge = (challengeId: string) => submissions.filter(s => s.challengeId === challengeId);
    
    const getVoteCount = (submissionId: string) => votes.filter(v => v.submissionId === submissionId).length;
    
    const getWinnerForChallenge = (challengeId: string) => {
        const challengeSubmissions = getSubmissionsForChallenge(challengeId);
        if (challengeSubmissions.length === 0) return null;
        return challengeSubmissions.reduce((winner, current) => {
            return getVoteCount(current.id) > getVoteCount(winner.id) ? current : winner;
        });
    };

    if (!isOpen) return null;
    
    const renderMainView = () => (
        <>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('active')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Active Challenge</button>
                    <button onClick={() => setActiveTab('past')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Past Challenges</button>
                </nav>
            </div>
            
            {activeTab === 'active' && (
                <div className="animate-fade-in">
                    {!activeChallenge ? (
                        <div className="text-center py-20"><p className="text-gray-500">No active challenges right now. Check back soon!</p></div>
                    ) : (
                        <div>
                            <div className="text-center p-6 bg-green-50 rounded-2xl mb-8">
                                <h2 className="text-3xl font-extrabold text-gray-900">{activeChallenge.title}</h2>
                                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{activeChallenge.description}</p>
                                <div className="mt-4">
                                    <p className="font-semibold text-sm text-gray-700">Required Ingredients:</p>
                                    <div className="flex justify-center flex-wrap gap-2 mt-2">
                                        {activeChallenge.requiredIngredients.map(ing => <span key={ing} className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">{ing}</span>)}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <CountdownTimer endDate={activeChallenge.endDate} />
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-4">
                               <h3 className="text-2xl font-bold text-gray-800">Submissions</h3>
                                <button onClick={() => setView('submit')} disabled={userHasSubmitted} className="bg-orange-500 text-white font-bold py-2 px-5 rounded-lg transition hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                                    {userHasSubmitted ? "You've Submitted!" : "Submit Your Recipe"}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {getSubmissionsForChallenge(activeChallenge.id).map(sub => {
                                    const recipe = allRecipes.find(r => r.id === sub.recipeId);
                                    if (!recipe) return null;
                                    return <SubmissionCard key={sub.id} submission={sub} recipe={recipe} voteCount={getVoteCount(sub.id)} onVote={() => handleVote(sub.id)} isVoted={userVoteInChallenge === sub.id} isWinner={false}/>
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'past' && (
                <div className="animate-fade-in space-y-8">
                    {pastChallenges.map(challenge => {
                        const winner = getWinnerForChallenge(challenge.id);
                        const winnerRecipe = winner ? allRecipes.find(r => r.id === winner.recipeId) : null;
                        return (
                             <div key={challenge.id} className="bg-white p-6 rounded-2xl shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800">{challenge.title}</h3>
                                <p className="text-sm text-gray-500">Ended on {new Date(challenge.endDate).toLocaleDateString()}</p>
                                {winner && winnerRecipe ? (
                                    <div className="mt-4">
                                        <SubmissionCard submission={winner} recipe={winnerRecipe} voteCount={getVoteCount(winner.id)} onVote={() => {}} isVoted={false} isWinner={true} />
                                    </div>
                                ) : (
                                    <p className="mt-4 text-gray-600">No submissions were made for this challenge.</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><TrophyIcon className="w-8 h-8 text-orange-500" /> Leftover Challenge</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full"><XMarkIcon className="w-6 h-6" /><span className="sr-only">Close</span></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {view === 'main' && renderMainView()}
                    {view === 'submit' && <SubmitRecipeView userRecipes={userRecipes} onBack={() => setView('main')} onSubmit={handleSubmitRecipe} />}
                </div>
            </div>
        </div>
    );
}