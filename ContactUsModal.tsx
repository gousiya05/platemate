
import React, { useState, useEffect } from 'react';

// Icons
const ChevronDownIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const EnvelopeIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>;

const faqs = [
    { question: "How does the AI Chef work?", answer: "Our AI Chef uses advanced language models to generate creative recipes based on the ingredients you provide. Just list what you have, and it will give you a unique recipe to try!" },
    { question: "Can I submit my own recipes?", answer: "Absolutely! We encourage all users to share their own leftover creations. Head over to the 'Recipes' section and click 'Share Your Recipe' to contribute to our community library." },
    { question: "Is Plate Mate free to use?", answer: "Yes, Plate Mate is completely free. Our goal is to make sustainable cooking accessible to everyone." },
    { question: "How do you handle my data?", answer: "We take your privacy seriously. We only collect data necessary for the app's functionality, like your saved recipes and challenge progress. We never sell your data. For more details, please see our Privacy Policy." }
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-4 text-left font-medium text-gray-800 hover:text-green-600"
                aria-expanded={isOpen}
            >
                <span>{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="pb-4 text-gray-600">{faq.answer}</p>
                </div>
            </div>
        </div>
    );
};

export default function ContactUs() {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        setIsSubmitted(false);
        setError('');
        setFormState({ name: '', email: '', message: '' });
    }, []);

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formState.name || !formState.email || !formState.message) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        // Simulate form submission
        console.log('Form submitted:', formState);
        setIsSubmitted(true);
    };
    
    return (
        <section id="contact-us" className="bg-gray-50 py-16 sm:py-24 px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get in Touch</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Have questions, feedback, or a great recipe idea? We'd love to hear from you!
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                    {isSubmitted ? (
                        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-bold text-green-700">Thank You!</h4>
                            <p className="text-green-600">Your message has been sent. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" id="email" onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" id="message" rows={4} onChange={handleChange} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"></textarea>
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* FAQs and Contact Info */}
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
                    <div className="bg-white p-8 rounded-xl shadow-lg border">
                        {faqs.map((faq, index) => <FaqItem key={index} faq={faq} />)}
                    </div>
                    <div className="mt-8 flex items-start gap-4">
                    <EnvelopeIcon className="w-8 h-8 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                            <h4 className="font-bold text-lg text-gray-800">General Inquiries</h4>
                            <a href="mailto:hello@platemate.app" className="block text-green-600 hover:underline">hello@platemate.app</a>
                            <a href="mailto:platemate@email.com" className="block text-green-600 hover:underline">platemate@email.com</a>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
