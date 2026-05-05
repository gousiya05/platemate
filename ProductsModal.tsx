import React, { useState, useEffect, useMemo } from 'react';
import type { Product } from './types';
import { GoogleGenAI, Type } from '@google/genai';

// --- ICONS --- //
const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;

// Category specific icons
const DairyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8l2 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6l2-4z"></path><path d="M8 6h8"></path><path d="M12 11v5"></path><path d="M12 18h.01"></path></svg>;
const BakeryIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7z"></path><path d="M20 12h-4m-4 0H4"></path></svg>;
const NonVegIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.65 17.38c.34-.43.55-.97.55-1.58 0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 .61.21 1.15.55 1.58"></path><path d="M18.84 12.3c.03-.17.05-.34.05-.51 0-2.2-1.8-4-4-4s-4 1.8-4 4c0 .17.02.34.05.51"></path><path d="M17.27 7.26C16.24 6.04 14.72 5.2 13 5.2s-3.24.84-4.27 2.06"></path><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z"></path><path d="m15 13-3-3-3 3"></path></svg>;
const SeafoodIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12C18.5 12 16 9.33 16 6s2.5-6 5.5-6"></path><path d="M16 6a2.49 2.49 0 0 0-2.4 2C13.6 10.67 11 12 8 12s-5.6-1.33-5.6-4C2.4 5.33 5 4 8 4"></path><path d="M8 4a2.49 2.49 0 0 1 2.4-2c0 2.21-2.4 4-2.4 4"></path><path d="M2.5 12c3 0 5.5 2.67 5.5 6s-2.5 6-5.5 6"></path><path d="M8 18a2.49 2.49 0 0 1 2.4 2c0-2.21-2.4-4-2.4-4"></path><path d="M16 18a2.49 2.49 0 0 0-2.4-2c0 2.21 2.4 4 2.4 4"></path></svg>;
const GrainsIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.21 1.002L7.5 15.25m5.25-.5L14.49 9.82a2.25 2.25 0 0 0-.21-1.002V3.104m-5.25 0h5.25m-5.25 0a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h9a2.25 2.25 0 0 0 2.25-2.25V5.354a2.25 2.25 0 0 0-2.25-2.25m-5.25 0v5.714m0 0a2.25 2.25 0 0 1 .565 1.573l1.406 6.248a2.25 2.25 0 0 1-1.186 2.618A2.25 2.25 0 0 1 12 20.25v-5.714m0 0a2.25 2.25 0 0 0 .565 1.573l1.406 6.248a2.25 2.25 0 0 0 1.186 2.618A2.25 2.25 0 0 0 12 20.25v-5.714"></path></svg>;
const FruitsIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 5-5 9-5 9s-5-4-5-9a5 5 0 0 1 5-5z"></path><path d="M12 14v.01"></path></svg>;
const VegetablesIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.6 19.3c-1.2-1.2-1.2-3.1 0-4.2s3.1-1.2 4.2 0c1.2 1.2 1.2 3.1 0 4.2-1.2 1.1-3.1 1.1-4.2 0Z"></path><path d="m6.9 11.7-2.1-2.1c-1.2-1.2-1.2-3.1 0-4.2s3.1-1.2 4.2 0l2.1 2.1"></path><path d="M3.3 20.7 12 12l6-6"></path></svg>;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- PRODUCT DATA --- //
const products: Product[] = [
    { id: 1, name: 'Milk', category: 'Dairy', image: 'https://images.unsplash.com/photo-1598182287669-7cfc9b4e5a59?q=80&w=400' },
    { id: 2, name: 'Cheese', category: 'Dairy', image: 'https://images.unsplash.com/photo-1618164436241-4476442d2782?q=80&w=400' },
    { id: 3, name: 'Yogurt', category: 'Dairy', image: 'https://images.unsplash.com/photo-1562119432-57a53b51919a?q=80&w=400' },
    { id: 4, name: 'Butter', category: 'Dairy', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=400' },
    { id: 17, name: 'Paneer', category: 'Dairy', image: 'https://images.unsplash.com/photo-1596043542421-1972bf06f2b2?q=80&w=400' },
    { id: 18, name: 'Ghee', category: 'Dairy', image: 'https://images.unsplash.com/photo-1606103793444-a74b01b63574?q=80&w=400' },
    { id: 5, name: 'Sourdough Bread', category: 'Bakery', image: 'https://images.unsplash.com/photo-1528607122325-05221401b133?q=80&w=400' },
    { id: 6, name: 'Naan', category: 'Bakery', image: 'https://images.unsplash.com/photo-1631451095765-2c9161657593?q=80&w=400' },
    { id: 7, name: 'Roti', category: 'Bakery', image: 'https://images.unsplash.com/photo-1626782195995-435435a26532?q=80&w=400' },
    { id: 8, name: 'Muffins', category: 'Bakery', image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?q=80&w=400' },
    { id: 9, name: 'Chicken Breast', category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1604503468818-a399918c8e1d?q=80&w=400' },
    { id: 10, name: 'Mutton', category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1599378125586-a178d8a78e72?q=80&w=400' },
    { id: 11, name: 'Eggs', category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=400' },
    { id: 12, name: 'Bacon', category: 'Non-Veg', image: 'https://images.unsplash.com/photo-1606824492353-8399a9b2b5fb?q=80&w=400' },
    { id: 13, name: 'Salmon', category: 'Seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400' },
    { id: 14, name: 'Shrimp', category: 'Seafood', image: 'https://images.unsplash.com/photo-1599742813292-3c222629b6f3?q=80&w=400' },
    { id: 15, name: 'Pomfret', category: 'Seafood', image: 'https://www.yummytummyaarthi.com/wp-content/uploads/2021/08/pomfret-fry-1-1024x768.jpeg' },
    { id: 16, name: 'Crab', category: 'Seafood', image: 'https://images.unsplash.com/photo-1616238382193-e28945644837?q=80&w=400' },
    { id: 19, name: 'Basmati Rice', category: 'Grains', image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe658?q=80&w=400' },
    { id: 20, name: 'Lentils (Dal)', category: 'Grains', image: 'https://images.unsplash.com/photo-1585394236043-34fa9a2366b2?q=80&w=400' },
    { id: 21, name: 'Chickpeas (Chana)', category: 'Grains', image: 'https://images.unsplash.com/photo-1603512285511-b449b4f62086?q=80&w=400' },
    { id: 22, name: 'Quinoa', category: 'Grains', image: 'https://images.unsplash.com/photo-1563453392212-326f5e8544d4?q=80&w=400' },
    { id: 23, name: 'Mango', category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429d0024d?q=80&w=400' },
    { id: 24, name: 'Banana', category: 'Fruits', image: 'https://images.unsplash.com/photo-1571771894824-c10b0a72b509?q=80&w=400' },
    { id: 25, 'name': 'Coconut', 'category': 'Fruits', 'image': 'https://images.unsplash.com/photo-1589366622384-06797a701f53?q=80&w=400' },
    { id: 26, name: 'Apple', category: 'Fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=400' },
    { id: 27, name: 'Okra (Bhindi)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1627435343444-23214731c503?q=80&w=400' },
    { id: 28, name: 'Spinach (Palak)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1576045057995-568f588f21fb?q=80&w=400' },
    { id: 29, name: 'Eggplant (Brinjal)', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1615485499978-128bde453cf3?q=80&w=400' },
    { id: 30, name: 'Potato', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400' },
];

const categories = {
    'Dairy': { icon: DairyIcon, image: 'https://images.unsplash.com/photo-1628088062854-594958cb120c?q=80&w=800' },
    'Bakery': { icon: BakeryIcon, image: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=800' },
    'Non-Veg': { icon: NonVegIcon, image: 'https://images.unsplash.com/photo-1603048297172-c92514d9a741?q=80&w=800' },
    'Seafood': { icon: SeafoodIcon, image: 'https://images.unsplash.com/photo-1599056009829-0d2d3855023f?q=80&w=800' },
    'Grains': { icon: GrainsIcon, image: 'https://images.unsplash.com/photo-1509502758622-c2d6a79a7164?q=80&w=800'},
    'Fruits': { icon: FruitsIcon, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800'},
    'Vegetables': { icon: VegetablesIcon, image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac8?q=80&w=800'},
};

// --- TYPES & SUB-COMPONENTS --- //
interface GeneratedRecipe {
    recipeName: string;
    description: string;
    cuisine: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    prepTime: string;
    ingredients: string[];
    instructions: string[];
    mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';
}

const GeneratedRecipeCard = ({ recipe }: { recipe: GeneratedRecipe }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-6 w-full text-left"
                aria-expanded={isExpanded}
                aria-controls={`recipe-details-${recipe.recipeName.replace(/\s/g, '')}`}
            >
                <div className="flex justify-between items-start gap-4">
                    <h4 className="text-xl font-bold text-gray-800">{recipe.recipeName}</h4>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{recipe.cuisine}</span>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{recipe.difficulty}</span>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{recipe.prepTime}</span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{recipe.mealType}</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">{recipe.description}</p>
            </button>
            {isExpanded && (
                <div id={`recipe-details-${recipe.recipeName.replace(/\s/g, '')}`} className="p-6 bg-gray-50 border-t border-gray-200 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <h5 className="font-bold text-gray-800 mb-2">Ingredients</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-800 mb-2">Instructions</h5>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

type View = 'main' | 'category' | 'recipes';
type SelectedCategory = keyof typeof categories | null;

// --- MAIN MODAL COMPONENT --- //
interface ProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductsModal({ isOpen, onClose }: ProductsModalProps) {
    const [view, setView] = useState<View>('main');
    const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState('');

    const [cuisineFilter, setCuisineFilter] = useState('All');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [mealTypeFilter, setMealTypeFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Default');

    useEffect(() => {
        if (isOpen) {
            setView('main');
            setSelectedCategory(null);
            setSelectedProduct(null);
            setSearchTerm('');
            setGeneratedRecipes([]);
            setIsGenerating(false);
            setGenerationError('');
            setCuisineFilter('All');
            setDifficultyFilter('All');
            setMealTypeFilter('All');
            setSortBy('Default');
        }
    }, [isOpen]);

    const generateRecipes = async (product: Product) => {
        setView('recipes');
        setSelectedProduct(product);
        setIsGenerating(true);
        setGenerationError('');
        setGeneratedRecipes([]);

        const recipeSchema = {
            type: Type.OBJECT,
            properties: {
                recipeName: { type: Type.STRING, description: "Creative and friendly name of the recipe." },
                description: { type: Type.STRING, description: "A short, enticing description of 1-2 sentences in a beginner-friendly tone." },
                cuisine: { type: Type.STRING, description: "e.g., Italian, Mexican, Indian" },
                difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
                prepTime: { type: Type.STRING, description: "e.g., '30 min', '1 hour'" },
                mealType: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'], description: "The type of meal the recipe is suitable for." },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of common household ingredients for the recipe." },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step instructions, written in a friendly tone." },
            },
            required: ['recipeName', 'description', 'cuisine', 'difficulty', 'prepTime', 'mealType', 'ingredients', 'instructions']
        };
        
        const schema = {
            type: Type.ARRAY,
            items: recipeSchema
        };

        const prompt = `Generate a list of 3 creative and easy recipes that use ${product.name} as a main or leftover ingredient. Prioritize dishes that help reduce food waste and use common household ingredients. The tone should be friendly and beginner-friendly.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            const parsedRecipes = JSON.parse(response.text);
            setGeneratedRecipes(parsedRecipes);
        } catch (err) {
            console.error("AI recipe generation failed:", err);
            setGenerationError('Sorry, the AI Chef is busy right now. Please try again in a moment.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCategoryClick = (category: SelectedCategory) => {
        setSelectedCategory(category);
        setView('category');
        setSearchTerm('');
    };

    const handleProductClick = (product: Product) => {
        generateRecipes(product);
    };

    const handleBackToProducts = () => {
        setView('category');
        setSelectedProduct(null);
    };

    const handleBackToCategories = () => {
        setView('main');
        setSelectedCategory(null);
    };

    if (!isOpen) return null;

    const renderCategoryView = () => (
        <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Browse Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {Object.entries(categories).map(([name, { icon: Icon, image }]) => (
                    <button
                        key={name}
                        onClick={() => handleCategoryClick(name as SelectedCategory)}
                        className="relative rounded-2xl overflow-hidden h-48 group transition-transform duration-300 hover:scale-105 shadow-lg"
                        aria-label={`View ${name} products`}
                    >
                        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                            <Icon className="w-8 h-8 text-white mb-2" />
                            <h3 className="text-xl font-bold text-white text-left">{name}</h3>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderProductListView = () => {
        if (!selectedCategory) return null;
        const CategoryIcon = categories[selectedCategory].icon;
        const filteredProducts = products
            .filter(p => p.category === selectedCategory)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
            <div className="animate-fade-in">
                <button onClick={handleBackToCategories} className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Categories
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                        <CategoryIcon className="w-8 h-8 text-orange-500" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{selectedCategory}</h2>
                </div>
                <div className="mb-6 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={`Search in ${selectedCategory}...`}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button key={product.id} onClick={() => handleProductClick(product)} className="text-center group">
                                <div className="aspect-square bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="mt-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-green-600">{product.name}</h3>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">No products found matching "{searchTerm}".</p>
                )}
            </div>
        );
    };

    const renderRecipeResultsView = () => {
        if (!selectedProduct) return null;
        const CategoryIcon = categories[selectedProduct.category].icon;
        
        const filteredAndSortedRecipes = useMemo(() => {
            return generatedRecipes
                .filter(r => (cuisineFilter === 'All' || r.cuisine === cuisineFilter))
                .filter(r => (difficultyFilter === 'All' || r.difficulty === difficultyFilter))
                .filter(r => (mealTypeFilter === 'All' || r.mealType === mealTypeFilter));
        }, [generatedRecipes, cuisineFilter, difficultyFilter, mealTypeFilter]);

        return (
            <div className="animate-fade-in">
                <button onClick={handleBackToProducts} className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to {selectedProduct.category}
                </button>
                <div className="flex items-center gap-4 mb-2">
                    <div className="aspect-square w-24 h-24 bg-white rounded-2xl shadow-md overflow-hidden">
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Recipes for {selectedProduct.name}</h2>
                        <p className="mt-1 text-gray-500">Generated by our AI Chef just for you!</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="my-6 p-4 bg-gray-100 rounded-xl border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="meal-type-filter" className="block text-sm font-medium text-gray-700">Meal Type</label>
                            <select id="meal-type-filter" value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-800">
                                {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cuisine-filter" className="block text-sm font-medium text-gray-700">Cuisine</label>
                            <select id="cuisine-filter" value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-800">
                                {['All', 'Italian', 'Mexican', 'Indian', 'Chinese', 'Fusion', 'Other'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700">Difficulty</label>
                            <select id="difficulty-filter" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-800">
                                {['All', 'Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                </div>


                {isGenerating && <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div><p className="mt-4 text-gray-600">The AI Chef is preparing your recipes...</p></div>}
                {generationError && <p className="text-center text-red-500 py-10">{generationError}</p>}
                {!isGenerating && filteredAndSortedRecipes.length > 0 && (
                     <div className="space-y-6">
                        {filteredAndSortedRecipes.map((recipe, index) => (
                            <GeneratedRecipeCard key={index} recipe={recipe} />
                        ))}
                    </div>
                )}
                 {!isGenerating && !generationError && generatedRecipes.length > 0 && filteredAndSortedRecipes.length === 0 && (
                     <p className="text-center text-gray-500 py-10">No recipes found matching your filters.</p>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (view) {
            case 'category':
                return renderProductListView();
            case 'recipes':
                return renderRecipeResultsView();
            case 'main':
            default:
                return renderCategoryView();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}