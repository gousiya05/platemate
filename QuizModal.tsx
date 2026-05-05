import React, { useState, useEffect } from 'react';

// --- ICONS ---
const XMarkIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const CheckCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const XCircleIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>;
const ArrowPathIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183m0 0l-3.181-3.183a8.25 8.25 0 00-11.664 0l-3.181 3.183" /></svg>
const ArrowLeftIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const LightbulbIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21m-3.75-2.311V21m0 0a2.25 2.25 0 01-1.619-3.266l.09-.082c.49-.43.825-.98.825-1.597V8.25A3.75 3.75 0 0112 4.5a3.75 3.75 0 013.75 3.75v.203c0 .617.334 1.167.825 1.597l.09.082a2.25 2.25 0 01-1.619 3.266z" /></svg>;
const EyeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ArchiveBoxIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const BeakerIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.21 1.002L7.5 15.25m5.25-.5L14.49 9.82a2.25 2.25 0 00-.21-1.002V3.104m-5.25 0h5.25m-5.25 0a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25V5.354a2.25 2.25 0 00-2.25-2.25m-5.25 0v5.714m0 0a2.25 2.25 0 01.565 1.573l1.406 6.248a2.25 2.25 0 01-1.186 2.618A2.25 2.25 0 0112 20.25v-5.714m0 0a2.25 2.25 0 00.565 1.573l1.406 6.248a2.25 2.25 0 001.186 2.618A2.25 2.25 0 0012 20.25v-5.714" /></svg>;
const SparklesIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.542 1.772a2.375 2.375 0 001.657 1.657l1.772.542-1.772.542a2.375 2.375 0 00-1.657 1.657L18 21.75l-.542-1.772a2.375 2.375 0 00-1.657-1.657l-1.772-.542 1.772-.542a2.375 2.375 0 001.657-1.657L18 13.5z" /></svg>;

// --- HELPER FUNCTION ---
const shuffleAndTake = <T,>(array: T[], num: number): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, num);
};

// --- QUIZ DATA BANKS ---
const foodWasteIQBank = [
    { question: "What percentage of global greenhouse gas emissions are linked to food waste?", options: ["1-2%", "3-5%", "8-10%", "15-20%"], correctAnswer: "8-10%", explanation: "If food waste were a country, it would be the third-largest emitter of greenhouse gases, after China and the US." },
    { question: "What's the difference between a 'Use-By' and a 'Best-By' date?", options: ["They mean the same thing.", "'Use-By' is for safety; 'Best-By' is for quality.", "'Best-By' is for safety; 'Use-By' is for quality.", "Both are just suggestions from the manufacturer."], correctAnswer: "'Use-By' is for safety; 'Best-By' is for quality.", explanation: "'Use-By' dates are about food safety (e.g., on meat and dairy), while 'Best-By' dates indicate peak flavor and quality, not that the food is unsafe to eat afterward." },
    { question: "Globally, about how much of the food produced for human consumption is lost or wasted?", options: ["One-tenth", "One-quarter", "One-third", "One-half"], correctAnswer: "One-third", explanation: "Approximately 1.3 billion tonnes of food get lost or wasted every year, which is about one-third of all food produced." },
    { question: "In developed countries, where does most food waste occur?", options: ["On farms", "During transportation", "In stores", "At the consumer level (homes/restaurants)"], correctAnswer: "At the consumer level (homes/restaurants)", explanation: "In countries like the U.S. and in Europe, a significant portion of food waste happens after purchase, in households and food service." },
    { question: "Which of these is NOT a good item to put in a home compost bin?", options: ["Coffee grounds", "Eggshells", "Meat and dairy products", "Vegetable scraps"], correctAnswer: "Meat and dairy products", explanation: "Meat and dairy can attract pests, create bad odors, and contain pathogens that may not be killed in a typical home compost pile." }
];

const mythOrFactBank = [
    { statement: "You should store tomatoes in the refrigerator to keep them fresh longer.", isFact: false, explanation: "Myth! Cold temperatures ruin the texture and flavor of tomatoes. They are best stored at room temperature, away from direct sunlight." },
    { statement: "Washing berries as soon as you get them home helps them last longer.", isFact: false, explanation: "Myth! Washing berries adds moisture, which can accelerate mold growth. It's best to wash them just before you eat them." },
    { statement: "You can't freeze cheese.", isFact: false, explanation: "Myth! You can freeze many types of cheese, especially hard cheeses like cheddar. Freezing can alter the texture, making it more crumbly, so it's best for cooking rather than slicing." },
    { statement: "Storing potatoes and onions together is a good space-saving technique.", isFact: false, explanation: "Myth! Onions release ethylene gas, which can cause potatoes to sprout and spoil more quickly. Store them separately in cool, dark places." },
    { statement: "Brown sugar that has hardened is ruined and should be thrown away.", isFact: false, explanation: "Myth! You can easily soften hard brown sugar by placing a slice of bread or an apple wedge in the container for a day or two." },
    { statement: "It's safe to eat food from a dented can as long as the dent is small.", isFact: false, explanation: "Myth! Dents, especially on the seams, can create tiny holes that allow bacteria like the one causing botulism to enter. It's best to avoid cans with deep dents." }
];

const spotTheLeftoverBank = [
    { id: 'stirfry', dish: "Vegetable Stir-fry", image: "https://loremflickr.com/400/300/stir-fry,food", ingredients: ["Day-old rice", "Broccoli stems", "Fresh ginger", "Wilted carrots", "Soy sauce", "Brand new chicken breast"], correctLeftovers: ["Day-old rice", "Broccoli stems", "Wilted carrots"], explanation: "Day-old rice is perfect for stir-fries as it's drier. Broccoli stems and slightly wilted carrots are great ways to use up veggies that are past their prime." },
    { id: 'frittata', dish: "Kitchen Sink Frittata", image: "https://loremflickr.com/400/300/frittata,food", ingredients: ["Eggs", "Leftover roasted potatoes", "A handful of spinach", "The last bit of a block of cheese", "Freshly bought bell peppers", "Milk"], correctLeftovers: ["Leftover roasted potatoes", "A handful of spinach", "The last bit of a block of cheese"], explanation: "Frittatas are fantastic for using up leftover cooked vegetables, small amounts of cheese, and wilting greens." },
    { id: 'soup', dish: "Hearty Lentil Soup", image: "https://loremflickr.com/400/300/soup,food", ingredients: ["Canned lentils", "The end of a celery stalk", "A wrinkly bell pepper", "Onion", "Vegetable broth from scraps", "Fresh parsley for garnish"], correctLeftovers: ["The end of a celery stalk", "A wrinkly bell pepper", "Vegetable broth from scraps"], explanation: "Soups are forgiving! Soft veggies and celery ends add flavor, and using homemade scrap broth is a top-tier waste-reduction hack." }
];

const storageSavvyBank = [
    { question: "Where is the best place to store bananas to keep them from ripening too quickly?", options: ["In the refrigerator", "On the counter, attached to the bunch", "On the counter, separated", "In a paper bag"], correctAnswer: "On the counter, separated", explanation: "Separating bananas slows the release of ethylene gas from each other, which causes ripening. Refrigerating them turns the peels black and stops the ripening process." },
    { question: "To keep herbs like cilantro and parsley fresh the longest, you should:", options: ["Store them in the plastic bag from the store.", "Wash and chop them immediately.", "Place them in a jar with water like flowers.", "Wrap them in a dry paper towel."], correctAnswer: "Place them in a jar with water like flowers.", explanation: "Treating leafy herbs like a bouquet of flowers (in a jar with water, loosely covered with a bag) can keep them fresh for over a week in the fridge." },
    { question: "Which of these should be stored in a cool, dark place like a pantry, NOT the refrigerator?", options: ["Apples", "Grapes", "Potatoes", "Celery"], correctAnswer: "Potatoes", explanation: "Cold temperatures convert the starch in potatoes to sugar, resulting in a gritty texture and sweet taste when cooked. Keep them in a dark pantry." },
    { question: "What is the best way to store mushrooms?", options: ["In a sealed plastic bag", "In a paper bag", "In a bowl of water", "Open on a shelf"], correctAnswer: "In a paper bag", explanation: "A paper bag allows mushrooms to breathe and prevents them from getting slimy, which often happens in plastic." }
];

const whatWouldYouMakeBank = [
    { id: 'chicken_scenario', leftovers: ["Leftover roasted chicken", "Cooked pasta", "Half an onion"], options: [{ text: "Chicken Pasta Salad", feedback: "Great choice! A cold pasta salad is a quick and delicious way to use up these ingredients." }, { text: "Creamy Chicken Pasta Bake", feedback: "Excellent idea! Baking it with some cheese and cream creates a whole new comforting meal." }, { text: "Spicy Chicken & Onion Skewers", feedback: "Creative! You'd just need to cook the onion, but it's a great way to repurpose the chicken." }] },
    { id: 'rice_scenario', leftovers: ["Day-old white rice", "A couple of eggs", "Some frozen peas and carrots"], options: [{ text: "Classic Fried Rice", feedback: "The perfect use for day-old rice! This is a fast, flavorful, and classic leftover meal." }, { text: "Breakfast Rice Porridge", feedback: "A comforting choice. You'd need to add milk and sweetener, but the rice provides a great base." }, { text: "Veggie Rice Patties", feedback: "A fantastic and creative option! Binding the ingredients together to pan-fry them is a brilliant transformation." }] },
    { id: 'bread_scenario', leftovers: ["Stale bread", "Milk", "Cinnamon and Sugar"], options: [{ text: "French Toast", feedback: "A classic for a reason! Stale bread is actually better for French toast because it soaks up the custard without falling apart." }, { text: "Homemade Croutons", feedback: "Excellent! Tossing with oil and baking is a simple way to create crunchy toppings for salads and soups." }, { text: "Sweet Bread Pudding", feedback: "A delicious dessert! This is a fantastic way to turn seemingly useless bread into a rich treat." }] }
];


type QuizType = 'main' | 'iq' | 'spot' | 'storage' | 'myth' | 'scenario';

// --- GENERIC QUIZ COMPONENTS ---
const QuizHeader = ({ title, onBack }) => (
    <>
        <button onClick={onBack} className="flex items-center text-green-600 font-semibold mb-6 hover:text-green-800 transition"><ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Quizzes</button>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        </div>
    </>
);

const QuizResultsView = ({ title, score, total, onRestart, children }) => (
    <div className="p-4 sm:p-8 animate-fade-in">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">{title} Complete!</h2>
            {score !== null && <p className="mt-4 text-xl text-gray-600">You scored <span className="font-bold text-green-600">{score}</span> out of <span className="font-bold">{total}</span></p>}
        </div>
        <div className="mt-8 space-y-4 text-left max-w-2xl mx-auto">{children}</div>
        <div className="text-center">
            <button onClick={onRestart} className="mt-8 inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition">
                <ArrowPathIcon className="w-5 h-5"/>
                Play Again
            </button>
        </div>
    </div>
);

// --- INDIVIDUAL QUIZ COMPONENTS ---

const MultiChoiceQuiz = ({ onBack, title, questionBank, numQuestions }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const loadQuestions = () => {
        setQuestions(shuffleAndTake(questionBank, numQuestions));
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    if (showResults) {
        const score = questions.reduce((acc, question, index) => (selectedAnswers[index] === question.correctAnswer ? acc + 1 : acc), 0);
        return (
            <QuizResultsView title={title} score={score} total={questions.length} onRestart={loadQuestions}>
                {questions.map((q, i) => (
                    <div key={i} className={`p-4 rounded-lg bg-white border ${selectedAnswers[i] === q.correctAnswer ? 'border-green-200' : 'border-red-200'}`}>
                        <p className="font-semibold text-gray-700">{i + 1}. {q.question}</p>
                        <div className={`mt-2 flex items-center text-sm ${selectedAnswers[i] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedAnswers[i] === q.correctAnswer ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
                            Your answer: {selectedAnswers[i] || 'Not answered'}
                        </div>
                         {selectedAnswers[i] !== q.correctAnswer && (
                            <div className="mt-1 flex items-center text-sm text-green-700"><CheckCircleIcon className="w-5 h-5 mr-2" />Correct answer: {q.correctAnswer}</div>
                        )}
                         <p className="mt-2 text-xs text-gray-500 italic">{q.explanation}</p>
                    </div>
                ))}
            </QuizResultsView>
        );
    }
    
    if (questions.length === 0) return null;
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = selectedAnswers[currentQuestionIndex];

    return (
        <div className="p-4 sm:p-8 animate-fade-in">
             <QuizHeader title={title} onBack={onBack} />
             <p className="text-center -mt-6 mb-6 text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-800">{currentQuestion.question}</h3>
                <div className="mt-6 space-y-4">
                    {currentQuestion.options.map((option) => (
                        <button key={option} onClick={() => handleAnswerSelect(option)} className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-gray-900 ${selectedOption === option ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`}>{option}</button>
                    ))}
                </div>
                <div className="mt-8 text-right">
                    <button onClick={handleNext} disabled={!selectedOption} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">{currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}</button>
                </div>
            </div>
        </div>
    );
};

const MythOrFactQuiz = ({ onBack }) => {
    const [statements, setStatements] = useState([]);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const loadStatements = () => {
        setStatements(shuffleAndTake(mythOrFactBank, 4));
        setAnswers({});
        setShowResults(false);
    };

    useEffect(() => { loadStatements(); }, []);

    if (showResults) {
        return (
            <div className="p-4 sm:p-8 animate-fade-in">
                <QuizHeader title="Myth or Fact?" onBack={onBack} />
                <QuizResultsView title="Myth or Fact" score={null} total={null} onRestart={loadStatements}>
                    {statements.map((q, i) => {
                        const userAnswer = answers[i];
                        const isCorrect = userAnswer === q.isFact;
                        return (
                            <div key={i} className={`p-4 rounded-lg bg-white border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                                <p className="font-semibold text-gray-700">{q.statement}</p>
                                <p className={`mt-2 font-bold ${q.isFact ? 'text-blue-600' : 'text-orange-600'}`}>This is a {q.isFact ? 'Fact' : 'Myth'}.</p>
                                <p className="mt-1 text-sm text-gray-600">{q.explanation}</p>
                                <div className={`mt-2 flex items-center text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {isCorrect ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
                                    You answered: {userAnswer === true ? 'Fact' : userAnswer === false ? 'Myth' : 'Not Answered'}
                                </div>
                            </div>
                        );
                    })}
                </QuizResultsView>
            </div>
        );
    }
    
    if (statements.length === 0) return null;

    return (
        <div className="p-4 sm:p-8 animate-fade-in">
            <QuizHeader title="Myth or Fact?" onBack={onBack} />
            <p className="text-center -mt-6 mb-8 text-gray-500">Test your knowledge on common food beliefs.</p>
            <div className="space-y-6 max-w-2xl mx-auto">
                {statements.map((q, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                        <p className="text-lg font-medium text-gray-800">{q.statement}</p>
                        <div className="mt-4 flex gap-4">
                            <button onClick={() => setAnswers(prev => ({...prev, [i]: false}))} className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${answers[i] === false ? 'bg-orange-500 text-white ring-2 ring-orange-500' : 'bg-orange-100 text-gray-900 hover:bg-orange-200'}`}>Myth</button>
                            <button onClick={() => setAnswers(prev => ({...prev, [i]: true}))} className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${answers[i] === true ? 'bg-blue-500 text-white ring-2 ring-blue-500' : 'bg-blue-100 text-gray-900 hover:bg-blue-200'}`}>Fact</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => setShowResults(true)} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition hover:bg-green-700 disabled:bg-gray-300">Submit Answers</button>
            </div>
        </div>
    );
};

const SpotTheLeftoverQuiz = ({ onBack }) => {
    const [challenges, setChallenges] = useState([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState(new Set());
    const [showResults, setShowResults] = useState(false);

    const loadChallenges = () => {
        setChallenges(shuffleAndTake(spotTheLeftoverBank, 2));
        setCurrentChallengeIndex(0);
        setSelectedIngredients(new Set());
        setShowResults(false);
    };

    useEffect(() => { loadChallenges(); }, []);

    if (challenges.length === 0) return null;
    const currentChallenge = challenges[currentChallengeIndex];

    const handleSelectIngredient = (ingredient) => {
        const newSet = new Set(selectedIngredients);
        if (newSet.has(ingredient)) newSet.delete(ingredient);
        else newSet.add(ingredient);
        setSelectedIngredients(newSet);
    };

    const handleNext = () => {
        setShowResults(false);
        setSelectedIngredients(new Set());
        if (currentChallengeIndex < challenges.length - 1) {
            setCurrentChallengeIndex(currentChallengeIndex + 1);
        } else {
            // End of quiz
            loadChallenges(); // Restart
        }
    };
    
    return (
        <div className="p-4 sm:p-8 animate-fade-in">
            <QuizHeader title="Spot the Leftover" onBack={onBack} />
            <p className="text-center -mt-6 mb-8 text-gray-500">Challenge {currentChallengeIndex + 1} of {challenges.length}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div>
                    <img src={currentChallenge.image} alt={currentChallenge.dish} className="rounded-xl shadow-lg w-full h-80 object-cover" />
                    <h3 className="mt-4 text-2xl font-bold text-center text-gray-800">{currentChallenge.dish}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-bold text-lg text-gray-700">Which of these ingredients could be leftovers?</h4>
                    <p className="text-sm text-gray-500 mb-4">Select all that apply.</p>
                    <div className="space-y-3">
                        {currentChallenge.ingredients.map(ing => (
                            <label key={ing} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedIngredients.has(ing) ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'}`}>
                                <input type="checkbox" checked={selectedIngredients.has(ing)} onChange={() => handleSelectIngredient(ing)} className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500" disabled={showResults}/>
                                <span className="ml-3 text-gray-900">{ing}</span>
                            </label>
                        ))}
                    </div>
                    {!showResults && <button onClick={() => setShowResults(true)} className="mt-6 w-full bg-green-600 text-white font-bold py-3 rounded-lg transition hover:bg-green-700">Check Answer</button>}
                </div>
            </div>
            {showResults && (
                <div className="mt-8 max-w-4xl mx-auto bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg animate-fade-in">
                    <h4 className="font-bold text-lg text-yellow-800">Results</h4>
                    <ul className="mt-2 text-gray-700 list-disc list-inside">
                        {currentChallenge.ingredients.map(ing => {
                            const isCorrectLeftover = currentChallenge.correctLeftovers.includes(ing);
                            const isSelected = selectedIngredients.has(ing);
                            if (isSelected && isCorrectLeftover) return <li key={ing} className="text-green-600">Correct! "{ing}" is a great leftover for this.</li>;
                            if (isSelected && !isCorrectLeftover) return <li key={ing} className="text-red-600">Incorrect. "{ing}" is usually better fresh for this dish.</li>;
                            return null;
                        })}
                    </ul>
                    <p className="mt-3 font-semibold">The ideal leftovers were: {currentChallenge.correctLeftovers.join(', ')}.</p>
                    <p className="mt-1 text-sm text-gray-600 italic">{currentChallenge.explanation}</p>
                    <button onClick={handleNext} className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition hover:bg-green-700">{currentChallengeIndex < challenges.length - 1 ? 'Next Challenge' : 'Play Again'}</button>
                </div>
            )}
        </div>
    );
};

const WhatWouldYouMakeQuiz = ({ onBack }) => {
    const [scenarios, setScenarios] = useState([]);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);

    const loadScenarios = () => {
        setScenarios(shuffleAndTake(whatWouldYouMakeBank, 2));
        setCurrentScenarioIndex(0);
        setSelectedOption(null);
    };

    useEffect(() => { loadScenarios() }, []);

    if (scenarios.length === 0) return null;
    const currentScenario = scenarios[currentScenarioIndex];

    const handleNext = () => {
        setSelectedOption(null);
        if (currentScenarioIndex < scenarios.length - 1) {
            setCurrentScenarioIndex(currentScenarioIndex + 1);
        } else {
            loadScenarios(); // Restart
        }
    };
    
    return (
         <div className="p-4 sm:p-8 animate-fade-in">
            <QuizHeader title="What Would You Make?" onBack={onBack} />
            <p className="text-center -mt-6 mb-8 text-gray-500">Scenario {currentScenarioIndex + 1} of {scenarios.length}</p>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                <h3 className="font-semibold text-lg text-gray-700">You have these leftovers:</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                    {currentScenario.leftovers.map(item => <span key={item} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">{item}</span>)}
                </div>
                <h4 className="mt-6 font-semibold text-lg text-gray-700">What would you make?</h4>
                <div className="mt-4 space-y-3">
                    {currentScenario.options.map(opt => (
                        <button key={opt.text} onClick={() => setSelectedOption(opt)} className="w-full text-left p-4 rounded-lg border-2 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all text-gray-900" disabled={selectedOption}>
                            {opt.text}
                        </button>
                    ))}
                </div>
            </div>
            {selectedOption && (
                <div className="mt-8 max-w-2xl mx-auto bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg animate-fade-in">
                    <h4 className="font-bold text-lg text-blue-800">Feedback</h4>
                    <p className="mt-1 text-gray-700">{selectedOption.feedback}</p>
                    <button onClick={handleNext} className="mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition hover:bg-green-700">{currentScenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Play Again'}</button>
                </div>
            )}
        </div>
    );
};


// --- MAIN MODAL COMPONENT ---

const quizTypes = [
    { id: 'iq', title: "Food Waste IQ", description: "Test your knowledge on food waste stats and facts.", icon: LightbulbIcon, color: "text-yellow-500" },
    { id: 'spot', title: "Spot the Leftover", description: "A visual challenge to identify leftover ingredients in dishes.", icon: EyeIcon, color: "text-blue-500" },
    { id: 'storage', title: "Storage Savvy", description: "Learn the best ways to store food to make it last longer.", icon: ArchiveBoxIcon, color: "text-purple-500" },
    { id: 'myth', title: "Myth or Fact?", description: "Debunk common myths about food safety and storage.", icon: BeakerIcon, color: "text-red-500" },
    { id: 'scenario', title: "What Would You Make?", description: "Creative challenges to turn specific leftovers into meals.", icon: SparklesIcon, color: "text-pink-500" }
];

const QuizHome = ({ onSelectQuiz }) => (
    <div className="p-4 sm:p-8">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome to the Quiz Hub!</h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">Choose a quiz below to test your knowledge and learn how to reduce food waste.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizTypes.map(quiz => (
                <button
                    key={quiz.id}
                    onClick={() => onSelectQuiz(quiz.id)}
                    className="bg-white p-6 rounded-2xl shadow-lg text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                    <quiz.icon className={`w-12 h-12 mb-4 p-2 rounded-xl bg-green-100 ${quiz.color}`} />
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600">{quiz.title}</h3>
                    <p className="mt-2 text-gray-600">{quiz.description}</p>
                </button>
            ))}
        </div>
    </div>
);


export default function QuizModal({ isOpen, onClose }) {
    const [activeQuiz, setActiveQuiz] = useState<QuizType>('main');

    useEffect(() => {
        if (isOpen) {
            setActiveQuiz('main');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const renderContent = () => {
        switch (activeQuiz) {
            case 'iq':
                return <MultiChoiceQuiz onBack={() => setActiveQuiz('main')} title="Food Waste IQ Challenge" questionBank={foodWasteIQBank} numQuestions={3} />;
            case 'storage':
                return <MultiChoiceQuiz onBack={() => setActiveQuiz('main')} title="Storage Savvy Quiz" questionBank={storageSavvyBank} numQuestions={3} />;
            case 'myth':
                return <MythOrFactQuiz onBack={() => setActiveQuiz('main')} />;
            case 'spot':
                return <SpotTheLeftoverQuiz onBack={() => setActiveQuiz('main')} />;
            case 'scenario':
                return <WhatWouldYouMakeQuiz onBack={() => setActiveQuiz('main')} />;
            case 'main':
            default:
                return <QuizHome onSelectQuiz={setActiveQuiz} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
            <div className="relative bg-gray-50 rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full" aria-label="Close quiz">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}