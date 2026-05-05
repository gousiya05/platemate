


import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { SustainableChallengeState } from './types';

// --- ICONS --- //
const XMarkIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const AwardIcon = (props) => <svg className={props.className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a2.25 2.25 0 01-2.25-2.25v-9a2.25 2.25 0 012.25-2.25h9A2.25 2.25 0 0118.75 7.5v9a2.25 2.25 0 01-2.25 2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75l-4.5 4.5-2.25-2.25" /></svg>;
const StarIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const LockClosedIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>;
const SparklesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.542 1.772a2.375 2.375 0 001.657 1.657l1.772.542-1.772.542a2.375 2.375 0 00-1.657 1.657L18 21.75l-.542-1.772a2.375 2.375 0 00-1.657-1.657l-1.772-.542 1.772-.542a2.375 2.375 0 001.657-1.657L18 13.5z" /></svg>;

// --- HOOKS & HELPERS --- //
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) { console.error(error); return initialValue; }
    });
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) { console.error(error); }
    };
    return [storedValue, setValue];
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- CHALLENGE DATA --- //
const badges = {
    'Pantry Pioneer': 'Awarded for completing Day 1.',
    'Storage Guru': 'Awarded for passing the Day 4 quiz.',
    'Kitchen Champion': 'Awarded for completing all 7 days.',
};

const storageQuizQuestions = [
    { question: "To keep herbs like cilantro and parsley fresh the longest, you should:", options: ["Store them in the plastic bag from the store.", "Place them in a jar with water like flowers.", "Wrap them in a dry paper towel."], answer: "Place them in a jar with water like flowers." },
    { question: "What is the best way to store mushrooms?", options: ["In a sealed plastic bag", "In a paper bag", "In a bowl of water"], answer: "In a paper bag" },
    { question: "Where should you store potatoes?", options: ["In the refrigerator", "On the counter", "In a cool, dark pantry"], answer: "In a cool, dark pantry" },
];

// --- SUB-COMPONENTS --- //
const ChallengeHeader = ({ points, badges: earnedBadges, currentDay, completedTasks }) => (
    <div className="p-6 bg-white rounded-t-2xl border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">7-Day Sustainable Kitchen Challenge</h2>
                <p className="text-gray-500">Build habits, reduce waste, earn rewards!</p>
            </div>
            <div className="text-right">
                <div className="text-3xl font-bold text-orange-500">{points}</div>
                <div className="text-sm font-semibold text-gray-600">Points</div>
            </div>
        </div>
        <div className="flex justify-center space-x-2 my-4">
            {Array.from({ length: 7 }).map((_, i) => {
                const day = i + 1;
                const isCompleted = completedTasks.includes(day);
                const isActive = day === currentDay;
                return (
                    <div key={day} className={`w-full h-2 rounded-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                );
            })}
        </div>
        <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Badges:</span>
            {Object.keys(badges).map(badgeName => (
                <div key={badgeName} title={`${badgeName}: ${badges[badgeName]}`} className={`p-1 rounded-full ${earnedBadges.includes(badgeName) ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                    <StarIcon className={`w-5 h-5 ${earnedBadges.includes(badgeName) ? 'text-white' : 'text-gray-400'}`} />
                </div>
            ))}
        </div>
    </div>
);

const AIAssistant = ({ message, isLoading }) => {
    if (!message && !isLoading) return null;
    return (
        <div className="mt-4 p-4 bg-green-50/70 rounded-lg border border-green-200 animate-fade-in">
            <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-200 rounded-full"><SparklesIcon className="w-5 h-5 text-green-700" /></div>
                <div>
                    <p className="font-bold text-green-800">AI Assistant</p>
                    {isLoading ? <div className="text-gray-500 text-sm italic">Thinking...</div> : <p className="text-sm text-gray-700">{message}</p>}
                </div>
            </div>
        </div>
    );
};

const DailyTaskView = ({ day, isCompleted, onComplete, children, title, description }) => (
    <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">Day {day}: {title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
        <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            {children}
        </div>
        <div className="mt-6 text-center">
            {isCompleted ? (
                <div className="inline-flex items-center gap-2 text-lg font-bold text-green-600">
                    <CheckCircleIcon className="w-6 h-6" /> Completed!
                </div>
            ) : (
                <button onClick={onComplete} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-green-700">
                    Complete Task
                </button>
            )}
        </div>
    </div>
);

const CompletionView = ({ points, badges: earnedBadges }) => {
    const tier = points >= 51 ? 'Gold' : points >= 31 ? 'Silver' : 'Bronze';
    const tierColors = {
        Gold: 'bg-amber-400 text-amber-900',
        Silver: 'bg-slate-300 text-slate-800',
        Bronze: 'bg-orange-300 text-orange-800',
    };
    return (
        <div className="p-8 text-center animate-fade-in">
            <h2 className="text-4xl font-extrabold text-green-600">Challenge Complete!</h2>
            <p className="mt-2 text-gray-600">You're a true Plate Mate Champion!</p>
            <div className={`mt-6 inline-block px-6 py-2 rounded-full font-bold text-lg ${tierColors[tier]}`}>{tier} Finisher</div>
            <p className="mt-4 text-5xl font-bold text-gray-800">{points} <span className="text-3xl text-gray-500">Points</span></p>
            <div className="mt-6">
                <h3 className="font-bold text-xl">Badges Earned</h3>
                <div className="flex justify-center items-center space-x-4 mt-3">
                    {earnedBadges.map(badge => (
                        <div key={badge} className="text-center">
                            <div className="p-3 bg-yellow-400 rounded-full inline-block"><StarIcon className="w-8 h-8 text-white"/></div>
                            <p className="mt-1 text-sm font-semibold">{badge}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN MODAL COMPONENT --- //
export default function SustainableChallengeModal({ isOpen, onClose }) {
    const [challengeState, setChallengeState] = useLocalStorage<SustainableChallengeState>('plateMateSustainableChallenge', {
        currentDay: 1,
        completedTasks: [],
        points: 0,
        badges: [],
        lastAccessDate: new Date(0).toISOString(),
    });

    const [aiResponse, setAiResponse] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Day-unlocking logic
    useEffect(() => {
        if (!isOpen) return;

        const today = new Date();
        const lastDate = new Date(challengeState.lastAccessDate);
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);

        if (today > lastDate) {
            setChallengeState(prev => {
                const canAdvance = prev.completedTasks.includes(prev.currentDay) && prev.currentDay < 7;
                return {
                    ...prev,
                    currentDay: canAdvance ? prev.currentDay + 1 : prev.currentDay,
                    lastAccessDate: new Date().toISOString(),
                };
            });
        }
    }, [isOpen]);

    const handleTaskCompletion = async (day, points, newBadge, data = null) => {
        if (challengeState.completedTasks.includes(day)) return;

        let finalPoints = points;
        let finalBadges = [...challengeState.badges];
        if (newBadge && !finalBadges.includes(newBadge)) {
            finalBadges.push(newBadge);
        }
        
        setAiResponse('');
        if (day === 1 && data) {
            setIsAiLoading(true);
            try {
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Based on these leftover ingredients: ${data.join(', ')}, suggest a simple recipe idea. Keep it very short and simple.` });
                setAiResponse(response.text);
            } catch (e) { setAiResponse('Sorry, I couldn\'t think of a recipe right now.'); console.error(e); }
            setIsAiLoading(false);
        }
        if (day === 3) {
            setIsAiLoading(true);
            try {
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Generate a short, positive, and encouraging message for someone who has just completed a "Meatless Meal" task as part of a sustainability challenge.' });
                setAiResponse(response.text);
            } catch (e) { setAiResponse('Great job on going meatless!'); console.error(e); }
            setIsAiLoading(false);
        }
        if (day === 4 && data) {
             finalPoints += (data * 5); // 5 bonus points per correct answer
             if (data > 1 && !finalBadges.includes('Storage Guru')) {
                finalBadges.push('Storage Guru');
             }
        }
        if (day === 7 && data) {
            setIsAiLoading(true);
            try {
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `A user has completed a 7-day sustainability challenge. Their final reflection is: "${data}". Provide a short, personalized, and summary-style congratulatory message.` });
                setAiResponse(response.text);
            } catch (e) { setAiResponse('Thank you for your reflection. You did great!'); console.error(e); }
            setIsAiLoading(false);
            if (!finalBadges.includes('Kitchen Champion')) {
                finalBadges.push('Kitchen Champion');
            }
        }
        
        setChallengeState(prev => ({
            ...prev,
            completedTasks: [...prev.completedTasks, day],
            points: prev.points + finalPoints,
            badges: finalBadges,
            pantryItems: day === 1 ? data : prev.pantryItems,
            reflection: day === 7 ? data : prev.reflection,
        }));
    };
    
    // --- Day-specific components --- //
    const Day1 = () => {
        const [items, setItems] = useState(['', '', '']);
        const handleChange = (index, value) => {
            const newItems = [...items];
            newItems[index] = value;
            setItems(newItems);
        };
        return (
            <DailyTaskView day={1} isCompleted={challengeState.completedTasks.includes(1)} onComplete={() => handleTaskCompletion(1, 10, 'Pantry Pioneer', items.filter(i => i.trim()))} title="Pantry Audit" description="List 3 ingredients you have that are nearing their expiration date.">
                <div className="space-y-3">
                    <input value={items[0]} onChange={e => handleChange(0, e.target.value)} placeholder="e.g., Wilting spinach" className="w-full p-2 border rounded-md" />
                    <input value={items[1]} onChange={e => handleChange(1, e.target.value)} placeholder="e.g., Stale bread" className="w-full p-2 border rounded-md" />
                    <input value={items[2]} onChange={e => handleChange(2, e.target.value)} placeholder="e.g., Half an onion" className="w-full p-2 border rounded-md" />
                </div>
                <AIAssistant isLoading={isAiLoading} message={aiResponse} />
            </DailyTaskView>
        );
    };
    
    const Day4 = () => {
        const [answers, setAnswers] = useState({});
        const handleSubmit = () => {
            const correctCount = storageQuizQuestions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
            handleTaskCompletion(4, 10, null, correctCount);
        };
        return (
            <DailyTaskView day={4} isCompleted={challengeState.completedTasks.includes(4)} onComplete={handleSubmit} title="Storage Savvy Quiz" description="Answer these questions to test your food storage knowledge.">
                <div className="space-y-4">
                    {storageQuizQuestions.map((q, i) => (
                        <div key={i}>
                            <p className="font-semibold">{q.question}</p>
                            <div className="flex flex-col space-y-2 mt-2">
                                {q.options.map(opt => <button key={opt} onClick={() => setAnswers(p => ({...p, [i]: opt}))} className={`text-left p-2 border rounded-md ${answers[i] === opt ? 'bg-green-100 border-green-500' : 'hover:bg-gray-50'}`}>{opt}</button>)}
                            </div>
                        </div>
                    ))}
                </div>
            </DailyTaskView>
        );
    };

    const Day7 = () => {
         const [reflection, setReflection] = useState('');
         return (
             <DailyTaskView day={7} isCompleted={challengeState.completedTasks.includes(7)} onComplete={() => handleTaskCompletion(7, 10, null, reflection)} title="Final Reflection" description="Write a short sentence about one new habit you've learned.">
                <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="e.g., I'll start saving my veggie scraps for broth..." className="w-full p-2 border rounded-md" rows={3}></textarea>
                <AIAssistant isLoading={isAiLoading} message={aiResponse} />
             </DailyTaskView>
         );
    }
    
    const renderCurrentDay = () => {
        const { currentDay, completedTasks } = challengeState;
        
        if (completedTasks.length === 7) return <CompletionView points={challengeState.points} badges={challengeState.badges} />;
        
        switch(currentDay) {
            case 1: return <Day1 />;
            case 2: return <DailyTaskView day={2} isCompleted={completedTasks.includes(2)} onComplete={() => handleTaskCompletion(2, 10, null)} title="Scrap Saver" description="Learn about saving veggie scraps for broth! Click 'Complete' after reading the tip."><p>Tip: Keep a bag in your freezer for onion skins, carrot peels, celery ends, and herb stems. When full, simmer them in water for an hour to make a delicious, free broth!</p></DailyTaskView>;
            case 3: return <DailyTaskView day={3} isCompleted={completedTasks.includes(3)} onComplete={() => handleTaskCompletion(3, 10, null)} title="Meatless Meal" description="Commit to making one meat-free meal today to reduce your carbon footprint."><p>Why go meatless? Livestock farming is a major contributor to greenhouse gases. Even one meat-free day a week makes a difference!</p><AIAssistant isLoading={isAiLoading} message={aiResponse} /></DailyTaskView>;
            case 4: return <Day4 />;
            case 5: return <DailyTaskView day={5} isCompleted={completedTasks.includes(5)} onComplete={() => handleTaskCompletion(5, 10, null)} title="Portion Patrol" description="Use recommended serving sizes to prevent cooking too much."><p className="text-center font-semibold">Common single serving sizes:<br/>- Pasta (dry): ~2oz / 56g<br/>- Rice (dry): ~1/4 cup / 45g<br/>- Meat/Fish: ~3-4oz / 85-113g (size of a deck of cards)</p></DailyTaskView>;
            case 6: return <DailyTaskView day={6} isCompleted={completedTasks.includes(6)} onComplete={() => handleTaskCompletion(6, 10, null)} title="DIY Hero" description="Make one common kitchen item from scratch today."><p>Challenge: Instead of buying it, try making your own salad dressing (oil + vinegar + seasoning), croutons (stale bread + oil + herbs), or pesto (greens + nuts + oil)!</p></DailyTaskView>;
            case 7: return <Day7 />;
            default: return <div>Loading...</div>
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full"><XMarkIcon className="w-6 h-6" /><span className="sr-only">Close</span></button>
                <ChallengeHeader {...challengeState} />
                <div className="overflow-y-auto">
                    {renderCurrentDay()}
                    {challengeState.currentDay < 7 && challengeState.completedTasks.length < 7 &&
                         <div className="p-6 border-t border-gray-200 text-center text-gray-500">
                             <LockClosedIcon className="w-8 h-8 mx-auto text-gray-300 mb-2"/>
                             <p className="font-bold">Day {challengeState.currentDay + 1} is locked.</p>
                             <p className="text-sm">Complete today's task and come back tomorrow to continue!</p>
                         </div>
                    }
                </div>
            </div>
        </div>
    );
}