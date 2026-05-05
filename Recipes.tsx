import React, { useState, useEffect, useMemo } from 'react';
import type { Recipe, RemixReview } from './types';
import RemixReviews from './RemixReviews';

// --- ICONS --- //
const XMarkIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const ClockIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SignalIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h1.5v15H3v-15zM8.25 9v10.5H6.75V9h1.5zM13.5 13.5v6H12v-6h1.5zM18.75 6v13.5h-1.5V6h1.5z" /></svg>;
const CheckCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const PlusCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HeartIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>);
const BookmarkIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c.1.128.2.27.286.426.085.156.146.325.184.502.038.177.056.358.056.542V21a1.5 1.5 0 01-2.25 1.309l-4.75-2.5-4.75 2.5A1.5 1.5 0 013 21V4.792c0-.184.018-.365.056-.542.038-.177.099-.346.184-.502.086-.156.186-.298.286-.426m0 0A3.004 3.004 0 016.5 2.25h11c1.241 0 2.33.725 2.824 1.794" /></svg>);
const SparklesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.542 1.772a2.375 2.375 0 001.657 1.657l1.772.542-1.772.542a2.375 2.375 0 00-1.657 1.657L18 21.75l-.542-1.772a2.375 2.375 0 00-1.657-1.657l-1.772-.542 1.772-.542a2.375 2.375 0 001.657-1.657L18 13.5z" /></svg>;
const SubstitutionIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const PhotoIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const StarIcon: React.FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFilled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>);
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);


// --- RECIPE COMPONENTS --- //

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

type Substitution = {
    name: string;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
};
const substitutionMap: Record<string, Substitution[]> = {
    'milk': [{ name: 'Oat milk', vegan: true, dairyFree: true, glutenFree: true }, { name: 'Soy milk', vegan: true, dairyFree: true }, { name: 'Almond milk', vegan: true, dairyFree: true, glutenFree: true }, { name: 'Coconut milk', vegan: true, dairyFree: true, glutenFree: true }],
    'egg': [{ name: '1/4 cup applesauce', vegan: true, dairyFree: true, glutenFree: true }, { name: '1/4 cup mashed banana', vegan: true, dairyFree: true, glutenFree: true }, { name: '1 tbsp chia seeds + 3 tbsp water', vegan: true, dairyFree: true, glutenFree: true }, { name: '1/4 cup yogurt' }],
    'butter': [{ name: 'Coconut oil (1:1)', vegan: true, dairyFree: true, glutenFree: true }, { name: 'Olive oil (3/4 cup per 1 cup)', vegan: true, dairyFree: true, glutenFree: true }, { name: 'Applesauce (1:1)', vegan: true, dairyFree: true, glutenFree: true }, { name: 'Mashed avocado (1:1)', vegan: true, dairyFree: true, glutenFree: true }],
    'flour': [{ name: 'Whole wheat flour' }, { name: 'Spelt flour' }, { name: 'Oat flour', glutenFree: true }],
    'sugar': [{ name: 'Honey' }, { name: 'Maple syrup', vegan: true }, { name: 'Agave nectar', vegan: true }],
    'lemon juice': [{ name: 'Lime juice', vegan: true, dairyFree: true, glutenFree: true }, { name: 'White wine vinegar', vegan: true, dairyFree: true, glutenFree: true }],
    'sour cream': [{ name: 'Greek yogurt' }, { name: 'Crème fraîche' }, { name: 'Cashew cream', vegan: true, dairyFree: true }],
    'yogurt': [{ name: 'Sour cream' }, { name: 'Buttermilk' }, { name: 'Coconut yogurt', vegan: true, dairyFree: true }],
    'pine nuts': [{ name: 'Walnuts' }, { name: 'Pecans' }, { name: 'Almonds' }],
    'parmesan': [{ name: 'Nutritional yeast', vegan: true, dairyFree: true }, { name: 'Pecorino Romano' }],
    'chickpeas': [{ name: 'Cannellini beans' }, { name: 'Black beans' }, { name: 'Lentils' }],
    'onion': [{ name: 'Shallots' }, { name: 'Leeks' }, { name: 'Onion powder' }],
    'garlic': [{ name: 'Garlic powder (1/4 tsp per clove)' }, { name: 'Shallots' }],
};

const findSubstitutes = (ingredient: string): Substitution[] | null => {
    const lowerIngredient = ingredient.toLowerCase();
    for (const key in substitutionMap) {
        if (lowerIngredient.includes(key)) {
            return substitutionMap[key];
        }
    }
    return null;
};

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


const RecipeDetailView = ({ recipe, onBack, onLike, onSave, reviews, onAddReview, onUpvoteReview, upvotedReviewIds }) => {
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());
    const [missingIngredients, setMissingIngredients] = useState<Set<string>>(new Set());
    const [substitutions, setSubstitutions] = useState<Record<string, Substitution[] | null>>({});
    const [isSubPanelOpen, setIsSubPanelOpen] = useState(false);

    const [manualSearch, setManualSearch] = useState('');
    const [dietaryFilters, setDietaryFilters] = useState({ vegan: false, glutenFree: false, dairyFree: false });
    const [favoriteSubs, setFavoriteSubs] = useLocalStorage<string[]>('plateMateFavoriteSubs', []);
    const [communityTips, setCommunityTips] = useLocalStorage<any[]>('plateMateCommunityTips', []);
    
    const ingredients = recipe.ingredients.split('\n');

    const toggleIngredient = (ingredient) => {
        const newSet = new Set(checkedIngredients);
        newSet.has(ingredient) ? newSet.delete(ingredient) : newSet.add(ingredient);
        setCheckedIngredients(newSet);
    };

    const toggleMissingIngredient = (ingredient: string) => {
        const newSet = new Set(missingIngredients);
        newSet.has(ingredient) ? newSet.delete(ingredient) : newSet.add(ingredient);
        setMissingIngredients(newSet);
    };
    
    const handleFindSubstitutions = () => {
        const foundSubstitutions: Record<string, Substitution[] | null> = {};
        if (missingIngredients.size > 0) {
            missingIngredients.forEach(ing => {
                foundSubstitutions[ing] = findSubstitutes(ing);
            });
        }
        setSubstitutions(foundSubstitutions);
        setIsSubPanelOpen(true);
    };

    const toggleFavorite = (subName: string) => {
        const newFavorites = new Set(favoriteSubs);
        if (newFavorites.has(subName)) {
            newFavorites.delete(subName);
        } else {
            newFavorites.add(subName);
        }
        setFavoriteSubs(Array.from(newFavorites));
    };

    const handleAddCommunityTip = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const tip = {
            id: Date.now().toString(),
            original: formData.get('original'),
            substitute: formData.get('substitute'),
            userName: 'Community Member',
        };
        if (!tip.original || !tip.substitute) return;
        setCommunityTips(prev => [tip, ...prev]);
        e.target.reset();
    };

    const manualSearchResults = useMemo(() => {
        if (!manualSearch.trim()) return [];
        return findSubstitutes(manualSearch.trim()) || [];
    }, [manualSearch]);

    const filterSubs = (subs: Substitution[]) => {
        return subs.filter(sub => 
            (!dietaryFilters.vegan || sub.vegan) &&
            (!dietaryFilters.glutenFree || sub.glutenFree) &&
            (!dietaryFilters.dairyFree || sub.dairyFree)
        ).sort((a, b) => { // Favorites on top
            const aIsFav = favoriteSubs.includes(a.name);
            const bIsFav = favoriteSubs.includes(b.name);
            if (aIsFav === bIsFav) return 0;
            return aIsFav ? -1 : 1;
        });
    };
    
    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Recipes
            </button>

            <div className="lg:grid lg:grid-cols-5 lg:gap-8">
                <div className="lg:col-span-2">
                    <img src={recipe.image} alt={recipe.title} className="rounded-2xl w-full object-cover shadow-lg" />
                     <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <div className="flex items-center">
                           <SparklesIcon className="h-6 w-6 text-yellow-600 mr-3" />
                           <h4 className="text-lg font-bold text-yellow-800">Remix Notes</h4>
                        </div>
                        <p className="mt-2 text-yellow-700">{recipe.remixNotes}</p>
                    </div>
                </div>

                <div className="lg:col-span-3 mt-6 lg:mt-0">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{recipe.title}</h2>
                    <div className="mt-4 flex items-center space-x-6 text-gray-600">
                        <span className="flex items-center"><ClockIcon className="w-5 h-5 mr-1.5" /> {recipe.time}</span>
                        <span className="flex items-center"><SignalIcon className="w-5 h-5 mr-1.5" /> {recipe.difficulty}</span>
                         <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">{recipe.cuisine}</span>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h3>
                        <ul className="space-y-3">
                           {ingredients.map((ing, i) => (
                                <li key={i} className="flex items-center justify-between group py-1 border-b border-gray-100 last:border-b-0">
                                    <div onClick={() => toggleIngredient(ing)} className="flex items-center cursor-pointer flex-grow mr-4">
                                        <CheckCircleIcon className={`w-6 h-6 mr-3 transition-colors flex-shrink-0 ${checkedIngredients.has(ing) ? 'text-green-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                        <span className={`transition-colors ${checkedIngredients.has(ing) ? 'line-through text-gray-400' : 'text-gray-700'}`}>{ing}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleMissingIngredient(ing)}
                                        className={`text-xs px-3 py-1 rounded-full border transition-colors flex-shrink-0 ${missingIngredients.has(ing) ? 'bg-orange-100 text-orange-700 border-orange-300 font-semibold' : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:border-orange-200'}`}
                                    >
                                        {missingIngredients.has(ing) ? '✓ Marked' : 'Missing?'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="mt-8">
                         <button
                            onClick={handleFindSubstitutions}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm border-2 bg-green-500 text-white border-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                           <SubstitutionIcon className="w-5 h-5" />
                           <span>Ingredient Substitution Helper</span>
                        </button>
                    </div>

                    {isSubPanelOpen && (
                        <div className="mt-6 p-4 sm:p-6 bg-green-50/70 rounded-2xl animate-fade-in border border-green-200">
                             <details open className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none">
                                    <h3 className="text-xl font-bold text-gray-800">Substitution Suggestions</h3>
                                    <span className="transition-transform transform group-open:rotate-180">▼</span>
                                </summary>
                                <div className="mt-4 space-y-6">
                                    <div>
                                        <p className="font-semibold text-sm mb-2 text-gray-700">Dietary Filters:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.keys(dietaryFilters).map((filter) => (
                                                <button key={filter} onClick={() => setDietaryFilters(f => ({...f, [filter]: !f[filter]}))}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${dietaryFilters[filter] ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {missingIngredients.size === 0 ? (
                                        <p className="text-center py-4 text-gray-700 font-medium">No ingredients marked as missing. Use the search below for manual lookups.</p>
                                    ) : (
                                        Object.entries(substitutions).map(([ingredient, subs]) => {
                                            const filtered = filterSubs(subs || []);
                                            return (
                                            <div key={ingredient} className="p-4 bg-white rounded-lg shadow-sm border">
                                                <p className="font-semibold text-gray-800">For <span className="text-orange-600">{ingredient}</span>:</p>
                                                {filtered.length > 0 ? (
                                                    <ul className="mt-2 list-none text-gray-600 space-y-1">
                                                        {filtered.map(sub => <li key={sub.name} className="flex items-center gap-2"><button onClick={() => toggleFavorite(sub.name)}><StarIcon className={`w-5 h-5 ${favoriteSubs.includes(sub.name) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} isFilled={favoriteSubs.includes(sub.name)}/></button>{sub.name}</li>)}
                                                    </ul>
                                                ) : <p className="mt-2 text-sm text-gray-500">No substitutions match your filters.</p>}
                                            </div>
                                        )})
                                    )}

                                    <div className="pt-4 border-t border-green-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">Search for any ingredient:</h4>
                                        <input type="text" value={manualSearch} onChange={e => setManualSearch(e.target.value)} placeholder="e.g., sour cream"
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                        {manualSearch.trim() && (
                                            <div className="mt-2 p-4 bg-white rounded-lg shadow-sm border">
                                                 {filterSubs(manualSearchResults).length > 0 ? (
                                                    <ul className="list-none text-gray-600 space-y-1">
                                                        {filterSubs(manualSearchResults).map(sub => <li key={sub.name} className="flex items-center gap-2"><button onClick={() => toggleFavorite(sub.name)}><StarIcon className={`w-5 h-5 ${favoriteSubs.includes(sub.name) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} isFilled={favoriteSubs.includes(sub.name)}/></button>{sub.name}</li>)}
                                                    </ul>
                                                ) : <p className="text-sm text-gray-500">No results found.</p>}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="pt-4 border-t border-green-200">
                                         <h4 className="font-semibold text-gray-800 mb-2">Community Tips</h4>
                                        <form onSubmit={handleAddCommunityTip} className="p-4 bg-white rounded-lg border space-y-2 mb-4">
                                            <h5 className="text-sm font-bold">Add your own tip!</h5>
                                            <input name="original" placeholder="Original Ingredient" required className="w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-md"/>
                                            <input name="substitute" placeholder="Your Substitute" required className="w-full px-3 py-1.5 text-sm bg-gray-50 border rounded-md"/>
                                            <button type="submit" className="w-full text-sm bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700">Submit Tip</button>
                                        </form>
                                        <div className="space-y-2">
                                            {communityTips.length > 0 ? communityTips.map(tip => (
                                                <div key={tip.id} className="p-3 bg-white/70 text-sm rounded-md border text-gray-700">
                                                    <span className="font-bold">{tip.original}</span> → <span className="font-bold">{tip.substitute}</span>
                                                    <span className="text-xs text-gray-500"> (from {tip.userName})</span>
                                                </div>
                                            )) : <p className="text-center text-xs text-gray-500 py-2">No community tips yet. Be the first!</p>}
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    )}

                     <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Steps</h3>
                        <ol className="space-y-4 list-decimal list-inside text-gray-700">
                            {recipe.steps.split('\n').map((step, i) => <li key={i}>{step.replace(/^\d+\.\s*/, '')}</li>)}
                        </ol>
                    </div>

                    <div className="mt-10 flex items-center space-x-4">
                        <button onClick={() => onLike(recipe.id)} className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-sm border-2 transform active:scale-95 ${recipe.isLiked ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-500 border-red-200 hover:bg-red-50'}`}>
                            <HeartIcon className="w-6 h-6" isFilled={recipe.isLiked} />
                            <span>{recipe.likes}</span>
                        </button>
                        <button onClick={() => onSave(recipe.id)} className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-sm border-2 transform active:scale-95 ${recipe.isSaved ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-yellow-500 border-yellow-200 hover:bg-yellow-50'}`}>
                            <BookmarkIcon className="w-6 h-6" isFilled={recipe.isSaved} />
                             <span>{recipe.isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                        <button onClick={() => alert('Suggest Variation feature coming soon!')} className="flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-sm border-2 bg-white text-green-600 border-green-200 hover:bg-green-50">
                           <SparklesIcon className="w-6 h-6" />
                           <span>Suggest Variation</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-12 border-t-2 border-dashed border-gray-200">
                <RemixReviews
                    recipeId={recipe.id}
                    reviews={reviews}
                    onAddReview={onAddReview}
                    onUpvoteReview={onUpvoteReview}
                    upvotedReviewIds={new Set(upvotedReviewIds)}
                />
            </div>
        </div>
    );
};

interface RecipeFormProps {
    onAddRecipe: (recipe: Recipe) => void;
    onBack: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onAddRecipe, onBack }) => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [imageName, setImageName] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImageName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    
    const handleDragEvents = (e: React.DragEvent, dragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDragEvents(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !ingredients.trim() || !steps.trim()) {
            alert('Please fill in the title, ingredients, and steps for your recipe.');
            return;
        }
        
        const newRecipe: Recipe = {
            id: Date.now(),
            title: title.trim(),
            image: image || `https://loremflickr.com/320/240/food,dish?random=${Date.now()}`,
            time: "15 min",
            difficulty: 'Easy',
            category: 'Dinner',
            cuisine: 'Fusion',
            ingredients: ingredients.trim(),
            steps: steps.trim(),
            remixNotes: "Just added! Be the first to share your remix.",
            likes: 0,
            saves: 0,
        };
        onAddRecipe(newRecipe);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Recipes
            </button>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Share a Recipe</h2>
            <p className="mt-2 text-gray-600">Turn your leftovers into a new creation and inspire others!</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                    <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                    <textarea id="ingredients" rows={5} value={ingredients} onChange={(e) => setIngredients(e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="List each ingredient on a new line..."></textarea>
                </div>

                <div>
                    <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">Steps or Instructions</label>
                    <textarea id="steps" rows={8} value={steps} onChange={(e) => setSteps(e.target.value)} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" placeholder="List each step on a new line..."></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recipe Image (Optional)</label>
                    <div 
                        onDragEnter={(e) => handleDragEvents(e, true)}
                        onDragLeave={(e) => handleDragEvents(e, false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors ${isDragging ? 'border-green-500 bg-green-50' : ''}`}
                    >
                        <div className="space-y-1 text-center">
                            {image ? (
                                <img src={image} alt="Preview" className="mx-auto h-48 w-auto rounded-md shadow-md"/>
                            ) : (
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            {imageName && !image && <p className="text-xs text-gray-500 pt-2">Uploading: {imageName}</p>}
                            {imageName && image && <p className="text-xs text-green-600 pt-2">Uploaded: {imageName}</p>}
                        </div>
                    </div>
                </div>
                
                <div className="text-right">
                    <button type="submit" className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all">
                        Share Recipe
                    </button>
                </div>
            </form>
        </div>
    );
};

const Toast = ({ message }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg animate-fade-in z-[60]">
            {message}
        </div>
    );
};

// --- MAIN MODAL COMPONENT --- //
interface RecipesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'list' | 'form' | 'detail';
    initialSelectedRecipe: Recipe | null;
    initialSearchTerm: string;
    recipes: Recipe[];
    remixReviews: RemixReview[];
    upvotedReviewIds: string[];
    savedRecipeIds: number[];
    onLike: (id: number) => void;
    onSave: (id: number) => void;
    onAddRecipe: (recipe: Recipe) => void;
    onAddReview: (recipeId: number, name: string, tip: string) => void;
    onUpvoteReview: (reviewId: string) => void;
    showToast: (message: string) => void;
}

export default function RecipesModal({ 
    isOpen, onClose, initialView = 'list',
    initialSelectedRecipe,
    initialSearchTerm = '',
    recipes,
    remixReviews,
    upvotedReviewIds,
    savedRecipeIds,
    onLike,
    onSave,
    onAddRecipe,
    onAddReview,
    onUpvoteReview,
    showToast
}: RecipesModalProps) {
    // --- STATE MANAGEMENT --- //
    const [view, setView] = useState<'list' | 'detail' | 'form'>(initialView);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(initialSelectedRecipe);
    const [searchQuery, setSearchQuery] = useState(initialSearchTerm);
    const [filterMealType, setFilterMealType] = useState('All');
    const [filterCuisine, setFilterCuisine] = useState('All');
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const [sortBy, setSortBy] = useState('Default');

    useEffect(() => {
        if (isOpen) {
            if (initialSelectedRecipe) {
                setSelectedRecipe(initialSelectedRecipe);
                setView('detail');
            } else {
                setView(initialView);
                setSelectedRecipe(null);
            }
            setSearchQuery(initialSearchTerm);
            if (initialSearchTerm) {
                setShowSavedOnly(false);
            } else {
                 setShowSavedOnly(initialView === 'list' && savedRecipeIds.length > 0 ? true : false);
            }
        }
    }, [isOpen, initialView, initialSelectedRecipe, initialSearchTerm, savedRecipeIds.length]);

    const handleSelectRecipe = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setView('detail');
    };
    
    const goBackToList = () => {
        setView('list');
        setSelectedRecipe(null);
    };
    
    const filteredRecipes = useMemo(() => {
        let sortedRecipes = [...recipes];

        if (sortBy === 'Most Liked') {
            sortedRecipes.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'Most Saved') {
            sortedRecipes.sort((a,b) => b.saves - a.saves);
        }

        return sortedRecipes.filter(recipe => {
            if (showSavedOnly && !recipe.isSaved) {
                return false;
            }
            const mealTypeMatch = filterMealType === 'All' || recipe.category === filterMealType;
            const cuisineMatch = filterCuisine === 'All' || recipe.cuisine === filterCuisine;
            
            const searchLower = searchQuery.toLowerCase().trim();
            if (!searchLower) {
                return mealTypeMatch && cuisineMatch;
            }

            const searchMatch = 
                recipe.title.toLowerCase().includes(searchLower) ||
                recipe.ingredients.toLowerCase().includes(searchLower) ||
                recipe.cuisine.toLowerCase().includes(searchLower) ||
                recipe.category.toLowerCase().includes(searchLower) ||
                recipe.remixNotes.toLowerCase().includes(searchLower);

            return mealTypeMatch && cuisineMatch && searchMatch;
        });
    }, [recipes, filterMealType, filterCuisine, showSavedOnly, sortBy, searchQuery]);


    const mealTypes = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    const cuisines = ['All', 'Italian', 'Indian', 'Chinese', 'Mexican', 'Continental', 'Fusion', 'South Indian'];

    if (!isOpen) return null;

    const renderContent = () => {
        if (view === 'detail' && selectedRecipe) {
            const reviewsForRecipe = remixReviews.filter(r => r.recipeId === selectedRecipe.id);
            return <RecipeDetailView 
                recipe={selectedRecipe} 
                onBack={goBackToList} 
                onLike={onLike}
                onSave={onSave}
                reviews={reviewsForRecipe}
                onAddReview={onAddReview}
                onUpvoteReview={onUpvoteReview}
                upvotedReviewIds={new Set(upvotedReviewIds)}
            />;
        }
        if (view === 'form') {
            return <RecipeForm onAddRecipe={onAddRecipe} onBack={() => setView('list')} />;
        }
        return (
            <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Find a Recipe</h2>
                     <button onClick={() => setView('form')} className="flex items-center space-x-2 px-4 py-2 rounded-full font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg">
                        <PlusCircleIcon className="w-6 h-6" />
                        <span>Share Your Recipe</span>
                    </button>
                </div>

                <div className="relative mb-6">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="search"
                        placeholder="Search recipes, ingredients, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        aria-label="Search recipes"
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-grow">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Meal Type</label>
                        <div className="flex flex-wrap gap-2">
                           {mealTypes.map(type => (
                                <button key={type} onClick={() => setFilterMealType(type)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filterMealType === type ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-green-100'}`}>{type}</button>
                           ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-100 rounded-lg items-center">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Show:</label>
                        <button onClick={() => setShowSavedOnly(false)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${!showSavedOnly ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-green-100'}`}>All Recipes</button>
                        <button onClick={() => setShowSavedOnly(true)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${showSavedOnly ? 'bg-green-600 text-white shadow' : 'bg-white text-gray-700 hover:bg-green-100'}`}>Saved</button>
                    </div>
                     <div className="flex items-center space-x-2 sm:ml-auto">
                        <label htmlFor="cuisine-filter" className="text-sm font-medium text-gray-700">Cuisine:</label>
                        <select id="cuisine-filter" value={filterCuisine} onChange={(e) => setFilterCuisine(e.target.value)} className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800">
                           {cuisines.map(cuisine => <option key={cuisine} value={cuisine}>{cuisine}</option>)}
                        </select>
                    </div>
                    <div className="sm:ml-4">
                        <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 sr-only">Sort By</label>
                        <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-800">
                            <option value="Default">Sort by: Default</option>
                            <option value="Most Liked">Most Liked</option>
                            <option value="Most Saved">Most Saved</option>
                        </select>
                    </div>
                </div>


                 {filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onSelect={handleSelectRecipe}
                                onLike={onLike}
                                onSave={onSave}
                            />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-16 px-6 bg-gray-100 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800">No Recipes Found</h3>
                        <p className="text-gray-500 mt-2">
                          {searchQuery ? `Your search for "${searchQuery}" did not return any results.` : showSavedOnly ? "You haven't saved any recipes yet. Click the bookmark icon to save one!" : "Try adjusting your filters to find more recipes."}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-6xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full">
                    <XMarkIcon className="w-6 h-6" />
                    <span className="sr-only">Close</span>
                </button>
                <div className="p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}