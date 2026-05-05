
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ObjectDetector, FilesetResolver, Detection } from '@mediapipe/tasks-vision';

// --- ICONS --- //
const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>;
const SparklesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.542 1.772a2.375 2.375 0 001.657 1.657l1.772.542-1.772.542a2.375 2.375 0 00-1.657 1.657L18 21.75l-.542-1.772a2.375 2.375 0 00-1.657-1.657l-1.772-.542 1.772-.542a2.375 2.375 0 001.657-1.657L18 13.5z" /></svg>;
const ArrowPathIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183m0 0l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.181 3.183" /></svg>
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeneratedRecipe {
    recipeName: string;
    description: string;
    cookingTime: string;
    servingSize: string;
    ingredients: string[];
    instructions: string[];
    foodSavingTip?: string;
}

const foodLabels = new Set(['apple', 'banana', 'broccoli', 'carrot', 'orange', 'pizza', 'hot dog', 'donut', 'cake', 'sandwich', 'bowl', 'dining table', 'cup', 'fork', 'knife', 'spoon', 'tomato', 'onion', 'bread']);

const GeneratedRecipeCard = ({ recipe }: { recipe: GeneratedRecipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 w-full text-left"
                aria-expanded={isExpanded}
            >
                <div className="flex justify-between items-start gap-4">
                    <h4 className="text-lg font-bold text-gray-800">{recipe.recipeName}</h4>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                <p className="mt-2 text-sm text-gray-600">{recipe.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span><strong>Time:</strong> {recipe.cookingTime}</span>
                    <span><strong>Serves:</strong> {recipe.servingSize}</span>
                </div>
            </button>
            {isExpanded && (
                <div className="p-5 bg-gray-50 border-t border-gray-200 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <h5 className="font-bold text-gray-800 mb-1">Ingredients</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-800 mb-1">Instructions</h5>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                    {recipe.foodSavingTip && <p className="mt-4 text-xs italic bg-yellow-50 p-2 rounded-md border-l-4 border-yellow-400"><strong>Tip:</strong> {recipe.foodSavingTip}</p>}
                </div>
            )}
        </div>
    );
};


export default function CameraChefModal({ isOpen, onClose }) {
    const [view, setView] = useState('initializing');
    const [detections, setDetections] = useState<Detection[]>([]);
    const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>([]);
    const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
    const [error, setError] = useState('');
    const [manualIngredients, setManualIngredients] = useState('');

    const videoRef = useRef<HTMLVideoElement>(null);
    const objectDetectorRef = useRef<ObjectDetector | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    const cleanup = () => {
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
            animationFrameIdRef.current = null;
        }
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setDetections([]);
    };

    const resetState = () => {
        cleanup();
        setView('initializing');
        setError('');
        setManualIngredients('');
        setConfirmedIngredients([]);
        setGeneratedRecipes([]);
        objectDetectorRef.current = null;
        startCamera();
    }

    const initMediaPipe = async () => {
        if (objectDetectorRef.current) return;
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
        objectDetectorRef.current = await ObjectDetector.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/int8/1/efficientdet_lite0.tflite',
                delegate: 'GPU'
            },
            scoreThreshold: 0.5,
            runningMode: 'VIDEO'
        });
    };

    const startCamera = async () => {
        setError('');
        setView('initializing');
        try {
            await initMediaPipe();
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadeddata = () => {
                    setView('scanning');
                    predictWebcam();
                }
            }
        } catch (err) {
            console.error(err);
            setError('Could not access the camera. Please check permissions and try again.');
            setView('error');
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            cleanup();
        }
        return () => cleanup();
    }, [isOpen]);

    const predictWebcam = () => {
        if (!objectDetectorRef.current || !videoRef.current || videoRef.current.paused || videoRef.current.ended) {
            return;
        }
        const results = objectDetectorRef.current.detectForVideo(videoRef.current, performance.now());
        const newDetections = results.detections.filter(d => {
            const category = d.categories[0]?.categoryName;
            return category && foodLabels.has(category);
        });
        setDetections(newDetections);

        const currentFrameIngredients = new Set<string>();
        newDetections.forEach(d => {
            const category = d.categories[0]?.categoryName;
            if (category) currentFrameIngredients.add(category);
        });

        if (currentFrameIngredients.size > 0) {
            setConfirmedIngredients(prev => {
                const updatedIngredients = new Set(prev);
                currentFrameIngredients.forEach(ing => updatedIngredients.add(ing));
                return updatedIngredients.size > prev.length ? Array.from(updatedIngredients) : prev;
            });
        }
        
        animationFrameIdRef.current = requestAnimationFrame(predictWebcam);
    };

    const handleRemoveIngredient = (ingredientToRemove: string) => {
        setConfirmedIngredients(prev => prev.filter(ing => ing !== ingredientToRemove));
    };

    const generateRecipesForIngredients = async (ingredientsList: string, sourceType: 'detected' | 'manual') => {
        if (!ingredientsList) return;
        setView('generating');
        setError('');
        if (sourceType === 'detected') cleanup();

        const recipeSchema = {
            type: Type.OBJECT,
            properties: {
                recipeName: { type: Type.STRING, description: "A creative and appealing name for the recipe." },
                description: { type: Type.STRING, description: "A short, enticing description (1-2 sentences) of the dish." },
                cookingTime: { type: Type.STRING, description: "e.g., '25 minutes'" },
                servingSize: { type: Type.STRING, description: "e.g., '2 servings'" },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of all necessary ingredients with quantities." },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Clear, step-by-step instructions." },
                foodSavingTip: { type: Type.STRING, description: "An optional tip related to using leftovers or reducing food waste." }
            },
            required: ['recipeName', 'description', 'cookingTime', 'servingSize', 'ingredients', 'instructions']
        };
        const schema = { type: Type.ARRAY, items: recipeSchema };
        const prompt = `You are an expert chef specializing in reducing food waste, with knowledge of both Indian and global cuisines. Based on these ${sourceType} ingredients: ${ingredientsList}, generate a list of 2-3 simple, creative recipes. Prioritize Indian recipes if they are a good fit for the ingredients. The recipes must use the provided ingredients and can be supplemented with common pantry staples. If a key ingredient is missing for a great recipe, include it in the ingredients list and mark it as "(recommended)". The tone should be friendly and easy for a beginner to follow.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            setGeneratedRecipes(JSON.parse(response.text));
            setConfirmedIngredients(ingredientsList.split(',').map(i => i.trim()));
            setView('result');
        } catch (err) {
            console.error(err);
            setError('The AI Chef is busy. Please try again in a moment.');
            setView('error');
        }
    };
    
    const handleGenerateFromScan = () => generateRecipesForIngredients(confirmedIngredients.join(', '), 'detected');
    const handleGenerateFromText = () => generateRecipesForIngredients(manualIngredients, 'manual');

    const renderView = () => {
        switch (view) {
            case 'initializing':
                return <div className="text-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div><p className="mt-4 text-gray-600">Warming up the camera...</p></div>;
            case 'scanning':
                return (
                    <div className="p-4">
                        <div className="relative w-full max-w-2xl mx-auto aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" aria-label="Live camera feed for ingredient detection" />
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full pointer-events-none">
                                Show your ingredients clearly
                            </div>
                            {detections.map((detection, i) => (
                                <div key={i} className="absolute border-2 border-green-400" style={{ left: `${detection.boundingBox.originX}px`, top: `${detection.boundingBox.originY}px`, width: `${detection.boundingBox.width}px`, height: `${detection.boundingBox.height}px` }}>
                                    <p className="bg-green-400 text-white text-xs font-bold px-1 py-0.5" style={{ transform: 'translateY(-100%)' }}>
                                        {detection.categories[0].categoryName} ({Math.round(detection.categories[0].score * 100)}%)
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center p-4 bg-white rounded-lg border">
                            <h4 className="font-semibold text-gray-700">Confirmed Ingredients ({confirmedIngredients.length}):</h4>
                             <p className="text-xs text-gray-500 mb-3">Remove any items that were detected incorrectly.</p>
                            <div className="flex justify-center flex-wrap gap-2">
                                {confirmedIngredients.length > 0 ? confirmedIngredients.map(ing => (
                                    <span key={ing} className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full capitalize">
                                        {ing}
                                        <button onClick={() => handleRemoveIngredient(ing)} className="bg-green-200 text-green-800 rounded-full hover:bg-green-300" aria-label={`Remove ${ing}`}><XMarkIcon className="w-4 h-4" /></button>
                                    </span>
                                )) : <p className="text-gray-500 text-sm">Point your camera at some food!</p>}
                            </div>
                            <button onClick={handleGenerateFromScan} disabled={confirmedIngredients.length === 0} className="mt-6 bg-orange-500 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed" aria-label="Generate recipes from confirmed ingredients">
                                Generate Recipes
                            </button>
                        </div>
                    </div>
                );
            case 'generating':
                return <div className="text-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div><p className="mt-4 text-gray-600">The AI Chef is thinking...</p></div>;
            case 'result':
                return (
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-1">Your AI-Generated Recipes!</h3>
                        <p className="text-center text-gray-500 mb-4">Using: {confirmedIngredients.join(', ')}</p>
                        {generatedRecipes.length > 0 && (
                            <div className="space-y-4">
                               {generatedRecipes.map((recipe, index) => <GeneratedRecipeCard key={index} recipe={recipe} />)}
                            </div>
                        )}
                        <div className="mt-6 text-center">
                            <button onClick={resetState} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-green-700 flex items-center gap-2 mx-auto" aria-label="Start a new scan"><ArrowPathIcon className="w-5 h-5" /> Scan Again</button>
                        </div>
                    </div>
                );
             case 'error':
                 return (
                    <div className="text-center p-8">
                        <h3 className="mt-4 text-xl font-bold text-red-700">Oops! Something went wrong</h3>
                        <p className="mt-2 text-red-600">{error}</p>
                        <button onClick={startCamera} className="mt-6 bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-green-700" aria-label="Try to start camera again">Try Again</button>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-800">Or, Enter Ingredients Manually</h4>
                            <textarea
                                value={manualIngredients}
                                onChange={(e) => setManualIngredients(e.target.value)}
                                rows={3}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="e.g., leftover rice, carrots, soy sauce"
                                aria-label="Manually enter ingredients"
                            />
                            <button
                                onClick={handleGenerateFromText}
                                className="mt-3 bg-orange-500 text-white font-bold py-2 px-6 rounded-lg transition hover:bg-orange-600 disabled:bg-gray-400"
                                disabled={!manualIngredients.trim()}
                                aria-label="Generate recipes from manually entered text"
                            >
                                Get Recipes
                            </button>
                        </div>
                    </div>
                 );
            default:
                return null;
        }
    };
    
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? 'animate-fade-in' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <SparklesIcon className="w-7 h-7 text-orange-500" />
                        Scan & Cook
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full" aria-label="Close Scan & Cook">
                        <XMarkIcon className="w-6 h-6" /><span className="sr-only">Close</span>
                    </button>
                </div>
                <div className="overflow-y-auto">
                    {renderView()}
                </div>
            </div>
        </div>
    );
}