
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

// --- ICONS --- //
const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const SparklesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.542 1.772a2.375 2.375 0 001.657 1.657l1.772.542-1.772.542a2.375 2.375 0 00-1.657 1.657L18 21.75l-.542-1.772a2.375 2.375 0 00-1.657-1.657l-1.772-.542 1.772-.542a2.375 2.375 0 001.657-1.657L18 13.5z" /></svg>;
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeneratedRecipe {
    recipeName: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    foodSavingTip: string;
}

const GeneratedRecipeCard = ({ recipe }: { recipe: GeneratedRecipe }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 w-full text-left"
                aria-expanded={isExpanded}
            >
                <div className="flex justify-between items-start gap-4">
                    <h4 className="text-lg font-bold text-gray-900">{recipe.recipeName}</h4>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                <p className="mt-2 text-sm text-gray-900">{recipe.description}</p>
            </button>
            {isExpanded && (
                <div className="p-5 bg-gray-50 border-t border-gray-200 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">Ingredients</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
                                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 mb-1">Instructions</h5>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-900">
                                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                    {recipe.foodSavingTip && <p className="mt-4 text-xs italic bg-yellow-50 p-2 rounded-md border-l-4 border-yellow-400 text-gray-900"><strong>Tip:</strong> {recipe.foodSavingTip}</p>}
                </div>
            )}
        </div>
    );
};

export default function AiChefModal({ isOpen, onClose }) {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState<GeneratedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleGenerate = async () => {
        if (!ingredients.trim()) {
            setError('Please list some ingredients.');
            return;
        }
        setError('');
        setRecipes([]);
        setIsLoading(true);

        const recipeSchema = {
            type: Type.OBJECT,
            properties: {
                recipeName: { type: Type.STRING },
                description: { type: Type.STRING },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                foodSavingTip: { type: Type.STRING },
            },
            required: ['recipeName', 'description', 'ingredients', 'instructions', 'foodSavingTip']
        };
        
        const responseSchema = {
            type: Type.ARRAY,
            items: recipeSchema
        };

        const prompt = `Given these ingredients: "${ingredients.trim()}", suggest 1-2 simple and creative recipes I can make. The recipes should use only these ingredients or basic pantry items, promote food waste reduction, and be easy to follow. Include a relevant food saving tip for each recipe.`;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });
            const parsedRecipes = JSON.parse(response.text);
            setRecipes(parsedRecipes);
        } catch (err) {
            console.error(err);
            setError('Sorry, I couldn\'t connect to the AI chef. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-orange-500" /> AI Chef
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full">
                        <XMarkIcon className="w-6 h-6" /><span className="sr-only">Close</span>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <label htmlFor="ingredients-input" className="block text-lg font-semibold text-gray-900">What ingredients do you have?</label>
                        <p className="text-sm text-gray-900 mt-1 mb-4">List your leftovers and pantry items, separated by commas.</p>
                        <textarea
                            id="ingredients-input"
                            rows={4}
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="e.g., leftover rice, 2 eggs, half an onion, soy sauce..."
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                            disabled={isLoading}
                        />
                        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                        <button onClick={handleGenerate} disabled={isLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg transition hover:bg-yellow-500 disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed">
                            {isLoading ? 'Thinking...' : 'Generate Recipe'}
                        </button>
                    </div>

                    <div className="mt-6">
                        {isLoading && (
                            <div className="text-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                                <p className="mt-4 text-gray-900">The AI Chef is whipping something up...</p>
                            </div>
                        )}
                        {recipes.length > 0 && (
                            <div className="space-y-4 animate-fade-in">
                                {recipes.map((recipe, index) => (
                                    <GeneratedRecipeCard key={index} recipe={recipe} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
