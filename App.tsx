import React, { useState, useEffect, useMemo, useRef } from 'react';
import RecipesModal from './Recipes';
import QuizModal from './QuizModal';
import ChallengeModal from './ChallengeModal';
import AiChefModal from './AiChefModal';
import StorageTipsModal from './StorageTipsModal';
import CameraChefModal from './CameraChefModal';
import AboutUs from './AboutUsModal';
import ContactUs from './ContactUsModal';
import type { Recipe, RemixReview } from './types';
import { initialRecipesData, initialRemixReviewsData, getOrCreateUserId } from './data';

// --- HOOKS --- //
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

// --- ICON COMPONENTS --- //
const RecipeIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const ChefHatIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7v1.455c-1.719.49-3 2.01-3 3.845v5.4c0 1.058.544 2.02 1.408 2.568A5.002 5.002 0 0012 22a5.002 5.002 0 006.592-2.732A3.001 3.001 0 0020 17.7V12.3c0-1.835-1.281-3.354-3-3.845V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v1h-6V7zm1-2a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"/></svg>);
const QuizIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 21l8 0"></path><path d="M12 17l0 4"></path><path d="M7 4l10 0"></path><path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path><path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path></svg>);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>);
const StorageTipsIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>);
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const MenuIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const XIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ShareRecipeIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const HeartIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>);
const BookmarkIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c.1.128.2.27.286.426.085.156.146.325.184.502.038.177.056.358.056.542V21a1.5 1.5 0 01-2.25 1.309l-4.75-2.5-4.75 2.5A1.5 1.5 0 013 21V4.792c0-.184.018-.365.056-.542.038-.177.099-.346.184-.502.086-.156.186-.298.286-.426m0 0A3.004 3.004 0 016.5 2.25h11c1.241 0 2.33.725 2.824 1.794" /></svg>);
const ClockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


// --- UI COMPONENTS --- //

const RecipeCard = ({ recipe, onSelect, onLike, onSave }) => (
    <div onClick={() => onSelect(recipe)} className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col group">
        <img className="h-40 w-full object-cover" src={recipe.image} alt={recipe.title} />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">{recipe.title}</h3>
            <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{recipe.category}</span>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{recipe.cuisine}</span>
            </div>
        </div>
        <div className="p-3 bg-white border-t flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center gap-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); onLike(recipe.id); }} 
                    className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors group/like" 
                    aria-label="Like this recipe"
                >
                    <HeartIcon className={`w-6 h-6 transform transition-transform group-active/like:scale-125 ${recipe.isLiked ? 'text-red-500' : 'text-gray-400'}`} isFilled={recipe.isLiked} />
                    <span className="font-medium">{recipe.likes}</span>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onSave(recipe.id); }} 
                    className="flex items-center gap-1.5 text-gray-600 hover:text-yellow-500 transition-colors group/save" 
                    aria-label="Save this recipe"
                >
                    <BookmarkIcon className={`w-6 h-6 transform transition-transform group-active/save:scale-125 ${recipe.isSaved ? 'text-yellow-500' : 'text-gray-400'}`} isFilled={recipe.isSaved} />
                </button>
            </div>
            <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-1 text-gray-400" />
                <span>{recipe.time}</span>
            </div>
        </div>
    </div>
);

const Header = ({ onAboutClick, onContactClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { label: 'About Us', action: onAboutClick, href: '#about-us' },
        { label: 'Contact Us', action: onContactClick, href: '#contact-us' }
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                <a href="#" className="text-3xl font-extrabold tracking-tight">
                    <span className="text-green-600">Plate</span><span className="text-orange-500">Mate</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); link.action(); }} className="py-1 text-sm font-bold text-gray-600 hover:text-green-600 transition-colors">{link.label}</a>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                        {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <nav className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
                    <div className="flex flex-col items-center space-y-6 py-6">
                        {navLinks.map(link => (
                            <a key={link.label} href={link.href} onClick={(e) => { e.preventDefault(); link.action(); setIsMenuOpen(false); }} className="py-1 text-sm font-bold text-gray-600 hover:text-green-600 transition-colors">{link.label}</a>
                        ))}
                    </div>
                </nav>
            )}
        </header>
    );
};

const slideshowImages = [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop", // salad
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1935&auto=format&fit=crop", // pizza
    "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=1974&auto=format&fit=crop", // soup
    "https://images.unsplash.com/photo-1621996346565-e326b20f545c?q=80&w=2080&auto=format&fit=crop", // pasta
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070&auto=format&fit=crop", // fruits
];

const SlideshowHero = ({ isSearchFocused, setSearchFocused, onSearch }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
        }, 5000);
        return () => clearTimeout(timer);
    }, [currentImageIndex]);

    return (
        <section
            id="hero"
            className="relative text-white text-center px-4 overflow-hidden h-[450px] sm:h-[550px] flex flex-col justify-center items-center"
        >
            {slideshowImages.map((src, index) => (
                <div 
                    key={src}
                    className={`absolute inset-0 w-full h-full bg-black transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={src}
                        alt="Delicious food background"
                        className={`w-full h-full object-cover ${index === currentImageIndex ? (index % 2 === 0 ? 'animate-kenburns-1' : 'animate-kenburns-2') : ''}`}
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-black/50"></div> {/* Overlay */}
            <div className="relative z-10 animate-fade-in w-full">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight drop-shadow-lg">
                    Turn Leftovers into Love –<br /> Share, Cook, Inspire!
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-green-100 drop-shadow-md">
                    Discover creative ways to use up leftovers and build a waste-free kitchen together.
                </p>
                <div className="mt-10 max-w-xl mx-auto">
                    <div className={`relative transition-all duration-300 ${isSearchFocused ? 'shadow-2xl' : 'shadow-lg'}`}>
                        <SearchIcon className="absolute top-1/2 left-5 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search recipes or features like 'Quiz'..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSearch(query);
                                    setQuery('');
                                }
                            }}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={`w-full pl-14 pr-6 py-4 text-lg text-gray-800 bg-white rounded-full border-2 border-transparent focus:outline-none transition-all duration-300 ${isSearchFocused ? 'ring-4 ring-white/50' : ''}`}
                            aria-label="Search for recipes, ingredients, or features"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const IconNavBar = ({ features }) => (
    <section className="bg-gray-50 py-12 px-4 -mt-16 relative z-20 rounded-t-3xl shadow-lg">
        <div className="container mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 justify-center">
                {features.map(({ label, icon: Icon, action, color }) => (
                    <button 
                        key={label} 
                        onClick={action} 
                        className="flex flex-col items-center justify-center p-4 space-y-2 rounded-2xl text-center transition-all duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 group"
                        aria-label={`Open ${label}`}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-700 group-hover:text-green-600">{label}</h3>
                    </button>
                ))}
            </div>
        </div>
    </section>
);

const PopularRecipes = ({ recipes, onSelect, onLike, onSave }) => (
    <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Popular This Week</h2>
            <p className="text-center text-gray-500 mb-10">Get inspired by what the community is loving right now.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                    <div key={recipe.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in opacity-0">
                         <RecipeCard recipe={recipe} onSelect={onSelect} onLike={onLike} onSave={onSave} />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Footer = ({ onAboutClick, onContactClick, onContributeClick }) => (
    <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-extrabold tracking-tight">
                    <span className="text-green-400">Plate</span><span className="text-orange-400">Mate</span>
                </h3>
                <p className="mt-2 text-gray-400">Reducing food waste, one recipe at a time.</p>
            </div>

            <div className="flex justify-center items-center space-x-6 mb-8">
                 <a href="#about-us" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="hover:text-white transition-colors">About</a>
                 <span className="text-gray-500">|</span>
                 <a href="#contact-us" onClick={(e) => { e.preventDefault(); onContactClick(); }} className="hover:text-white transition-colors">Contact</a>
                 <span className="text-gray-500">|</span>
                 <button onClick={onContributeClick} className="hover:text-white transition-colors">Contribute</button>
                 <span className="text-gray-500">|</span>
                 <a href="#" className="hover:text-white transition-colors">Waste Facts</a>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-8 text-center">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} PlateMate. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

const App: React.FC = () => {
    // --- CENTRALIZED STATE MANAGEMENT --- //
    const [recipes, setRecipes] = useLocalStorage<Recipe[]>('plateMateRecipes', initialRecipesData);
    const [likedRecipeIds, setLikedRecipeIds] = useLocalStorage<number[]>('plateMateLikes', []);
    const [savedRecipeIds, setSavedRecipeIds] = useLocalStorage<number[]>('plateMateSaves', []);
    const [remixReviews, setRemixReviews] = useLocalStorage<RemixReview[]>('plateMateRemixReviews', initialRemixReviewsData);
    const [upvotedReviewIds, setUpvotedReviewIds] = useLocalStorage<string[]>('plateMateUpvotedReviews', []);
    
    // --- MODAL STATES --- //
    const [isRecipesModalOpen, setIsRecipesModalOpen] = useState(false);
    const [recipesInitialView, setRecipesInitialView] = useState<'list' | 'form' | 'detail'>('list');
    const [initialSelectedRecipe, setInitialSelectedRecipe] = useState<Recipe | null>(null);
    const [initialSearchTerm, setInitialSearchTerm] = useState('');
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const [isAiChefModalOpen, setIsAiChefModalOpen] = useState(false);
    const [isStorageTipsModalOpen, setIsStorageTipsModalOpen] = useState(false);
    const [isCameraChefModalOpen, setIsCameraChefModalOpen] = useState(false);
    
    // --- UI STATES --- //
    const [isSearchFocused, setSearchFocused] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // --- REFS FOR SCROLLING --- //
    const aboutRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    // --- SCROLL HANDLER --- //
    const handleScrollTo = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // --- DATA HANDLERS --- //
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleLikeRecipe = (id: number) => {
        const newLikedIds = new Set(likedRecipeIds);
        let likeIncrement = 0;
        if (newLikedIds.has(id)) {
            newLikedIds.delete(id);
            likeIncrement = -1;
        } else {
            newLikedIds.add(id);
            likeIncrement = 1;
        }
        setLikedRecipeIds(Array.from(newLikedIds));
        setRecipes(prev => prev.map(r => r.id === id ? { ...r, likes: Math.max(0, r.likes + likeIncrement) } : r));
    };

    const handleSaveRecipe = (id: number) => {
        const newSavedIds = new Set(savedRecipeIds);
        if (newSavedIds.has(id)) {
            newSavedIds.delete(id);
            showToast('Removed from saved!');
        } else {
            newSavedIds.add(id);
            showToast('Recipe saved!');
        }
        setSavedRecipeIds(Array.from(newSavedIds));
    };

    const handleAddRecipe = (newRecipe: Recipe) => {
        const recipeWithUser = { ...newRecipe, userId: getOrCreateUserId() };
        setRecipes(prev => [recipeWithUser, ...prev]);
        setIsRecipesModalOpen(false); // Close modal after adding
        showToast('Your recipe has been shared!');
    };

    const handleAddReview = (recipeId: number, reviewerName: string, tip: string) => {
        const newReview: RemixReview = { 
            id: `remix_${Date.now()}`, 
            recipeId, 
            reviewerName: reviewerName || 'Anonymous', 
            tip: tip, 
            timestamp: Date.now(), 
            upvotes: 0 
        };
        setRemixReviews(prev => [newReview, ...prev]);
    };

    const handleUpvoteReview = (reviewId: string) => {
        const newUpvotedIds = new Set(upvotedReviewIds);
        let upvoteIncrement = 0;
        if (newUpvotedIds.has(reviewId)) {
            newUpvotedIds.delete(reviewId);
            upvoteIncrement = -1;
        } else {
            newUpvotedIds.add(reviewId);
            upvoteIncrement = 1;
        }
        setUpvotedReviewIds(Array.from(newUpvotedIds));
        setRemixReviews(prev => prev.map(r => r.id === reviewId ? { ...r, upvotes: Math.max(0, r.upvotes + upvoteIncrement) } : r));
    };
    
    // --- UI HANDLERS --- //
    const handleOpenRecipesModal = (view: 'list' | 'form' | 'detail', recipe: Recipe | null = null) => {
        setRecipesInitialView(view);
        setInitialSelectedRecipe(recipe);
        setIsRecipesModalOpen(true);
    };

    const handleCloseRecipesModal = () => {
        setIsRecipesModalOpen(false);
        setInitialSelectedRecipe(null);
        setInitialSearchTerm('');
    };

    const mainFeatures = [
        { label: 'Recipes', icon: RecipeIcon, action: () => handleOpenRecipesModal('list'), color: 'bg-orange-500' },
        { label: 'Share Recipes', icon: ShareRecipeIcon, action: () => handleOpenRecipesModal('form'), color: 'bg-pink-500' },
        { label: 'AI Chef', icon: ChefHatIcon, action: () => setIsAiChefModalOpen(true), color: 'bg-purple-500' },
        { label: 'Scan & Cook', icon: CameraIcon, action: () => setIsCameraChefModalOpen(true), color: 'bg-cyan-500' },
        { label: 'Leftover Challenge', icon: TrophyIcon, action: () => setIsChallengeModalOpen(true), color: 'bg-yellow-500' },
        { label: 'Storage Tips', icon: StorageTipsIcon, action: () => setIsStorageTipsModalOpen(true), color: 'bg-teal-500' },
        { label: 'Quiz', icon: QuizIcon, action: () => setIsQuizModalOpen(true), color: 'bg-blue-500' },
    ];

    const handleSearch = (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            return;
        }

        const matchingFeature = mainFeatures.find(
            feature => feature.label.toLowerCase() === trimmedQuery.toLowerCase()
        );

        if (matchingFeature) {
            matchingFeature.action();
        } else {
            setInitialSearchTerm(trimmedQuery);
            handleOpenRecipesModal('list');
        }
    };
    
    // --- DERIVED DATA & FEATURES CONFIG --- //
    const recipesWithStatus = useMemo(() => {
        const likedSet = new Set(likedRecipeIds);
        const savedSet = new Set(savedRecipeIds);
        return recipes.map(r => ({ ...r, isLiked: likedSet.has(r.id), isSaved: savedSet.has(r.id) }));
    }, [recipes, likedRecipeIds, savedRecipeIds]);

    const popularRecipes = useMemo(() => {
        return [...recipesWithStatus]
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 3);
    }, [recipesWithStatus]);

    return (
        <div className="bg-gray-50">
            <Header onAboutClick={() => handleScrollTo(aboutRef)} onContactClick={() => handleScrollTo(contactRef)} />
            <main>
                <SlideshowHero 
                    isSearchFocused={isSearchFocused} 
                    setSearchFocused={setSearchFocused} 
                    onSearch={handleSearch}
                />
                <IconNavBar features={mainFeatures} />
                <PopularRecipes 
                    recipes={popularRecipes} 
                    onSelect={(recipe) => handleOpenRecipesModal('detail', recipe)}
                    onLike={handleLikeRecipe}
                    onSave={handleSaveRecipe}
                />
                <div ref={aboutRef}>
                  <AboutUs />
                </div>
                 <div ref={contactRef}>
                  <ContactUs />
                </div>
            </main>
            <Footer 
                onAboutClick={() => handleScrollTo(aboutRef)} 
                onContactClick={() => handleScrollTo(contactRef)}
                onContributeClick={() => handleOpenRecipesModal('form')} 
            />
            
            <RecipesModal 
                isOpen={isRecipesModalOpen} 
                onClose={handleCloseRecipesModal} 
                initialView={recipesInitialView} 
                initialSelectedRecipe={initialSelectedRecipe}
                initialSearchTerm={initialSearchTerm}
                recipes={recipesWithStatus}
                remixReviews={remixReviews}
                upvotedReviewIds={upvotedReviewIds}
                savedRecipeIds={savedRecipeIds}
                onLike={handleLikeRecipe}
                onSave={handleSaveRecipe}
                onAddRecipe={handleAddRecipe}
                onAddReview={handleAddReview}
                onUpvoteReview={handleUpvoteReview}
                showToast={showToast}
            />
            <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
            <ChallengeModal isOpen={isChallengeModalOpen} onClose={() => setIsChallengeModalOpen(false)} />
            <AiChefModal isOpen={isAiChefModalOpen} onClose={() => setIsAiChefModalOpen(false)} />
            <StorageTipsModal isOpen={isStorageTipsModalOpen} onClose={() => setIsStorageTipsModalOpen(false)} />
            <CameraChefModal isOpen={isCameraChefModalOpen} onClose={() => setIsCameraChefModalOpen(false)} />
        </div>
    );
};

export default App;