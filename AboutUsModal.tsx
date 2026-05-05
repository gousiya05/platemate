
import React from 'react';

// Icons
const GlobeAltIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0012 13.5c2.998 0 5.74 1.1 7.843 2.918m-15.686 0A8.959 8.959 0 003 12c0-.778.099-1.533.284-2.253" /></svg>;
const HeartIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;


export default function AboutUs() {
    return (
        <section id="about-us" className="bg-white py-16 sm:py-24 px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Our Mission: Less Waste, More Taste.</h2>
                <p className="mt-4 text-lg text-gray-600">
                    We believe every ingredient holds potential. Our mission is to transform your kitchen into a canvas of creativity, empowering you to fight food waste one delicious meal at a time.
                </p>
            </div>

            {/* Combined Story & Image Section */}
            <div className="mt-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-center">
                {/* Left Column: Text */}
                <div className="space-y-10">
                    {/* Vision */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 text-green-600">
                            <GlobeAltIcon className="w-8 h-8" />
                            <h3 className="text-2xl font-bold">Our Vision</h3>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            We see a future where every kitchen is a hub of creativity, not waste. Plate Mate is our commitment to that future—a place where forgotten ingredients get a second chance to shine. Our vision is to empower a global community of home cooks to find joy and purpose in mindful cooking, turning the fight against food waste into a delicious, daily adventure.
                        </p>
                    </div>
                    {/* Approach */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 text-orange-500">
                            <HeartIcon className="w-8 h-8" />
                            <h3 className="text-2xl font-bold">Our Approach</h3>
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed">
                            Our approach is simple: inspire, equip, and connect. We blend cutting-edge AI to spark your culinary imagination with practical, community-tested wisdom. From intelligent recipe suggestions for your leftover ingredients to challenges that make sustainability a fun, shared goal, we provide the tools you need to cook with confidence, creativity, and a conscience.
                        </p>
                    </div>
                </div>
                
                {/* Right Column: Image */}
                <div className="relative h-96 lg:h-[500px] w-full">
                     <img 
                        src="https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=800&auto=format&fit=crop" 
                        alt="A vibrant assortment of fresh vegetables on a dark surface" 
                        className="w-full h-full object-cover rounded-2xl shadow-xl"
                     />
                </div>
            </div>
        </section>
    );
}
