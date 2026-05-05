
import React, { useState } from 'react';

// --- ICONS --- //
const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const ArchiveBoxIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;


// --- DATA --- //
const storageTipsData = [
  {
    category: 'Vegetables',
    tips: [
      "<strong>Leafy Greens (Spinach, Lettuce):</strong> Wash, dry thoroughly, then wrap in a paper towel and store in a container or plastic bag in the fridge's crisper drawer. This absorbs excess moisture.",
      "<strong>Root Vegetables (Carrots, Potatoes, Onions):</strong> Store in a cool, dark, and dry place like a pantry. Don't store potatoes and onions together, as onions release gas that makes potatoes sprout.",
      "<strong>Cruciferous Veggies (Broccoli, Cauliflower):</strong> Store in an open or perforated bag in the crisper drawer. Don't wash until you're ready to use them.",
      "<strong>Don't:</strong> Don't store tomatoes or cucumbers in the coldest part of your fridge; it can damage their texture.",
    ]
  },
  {
    category: 'Fruits',
    tips: [
      "<strong>Berries:</strong> Store unwashed in a breathable container in the fridge. Wash only before eating to prevent mold.",
      "<strong>Bananas:</strong> Keep on the counter. To speed up ripening, place in a paper bag. To slow it, separate them from the bunch.",
      "<strong>Apples & Citrus:</strong> Can be stored on the counter for a week, but last much longer in the fridge's crisper drawer.",
      "<strong>Ethylene Gas:</strong> Apples, bananas, and tomatoes release ethylene gas, which can ripen other produce faster. Store them separately.",
    ]
  },
  {
    category: 'Dairy Products',
    tips: [
      "<strong>Milk:</strong> Store in the coldest part of your fridge (the back of the bottom shelf), not the door, where temperatures fluctuate.",
      "<strong>Cheese:</strong> Wrap hard cheese in wax or parchment paper, then place in a loose plastic bag. Soft cheeses should be kept in their original container.",
      "<strong>Yogurt & Sour Cream:</strong> Keep in their original, tightly sealed containers. Store them upside down to create a vacuum seal and prevent mold.",
      "<strong>Freezing:</strong> You can freeze milk and hard cheeses. Milk's texture might change slightly, and cheese will become more crumbly, making it best for cooking.",
    ]
  },
  {
    category: 'Cooked Meals',
    tips: [
      "<strong>Cool Down Rule:</strong> Let hot food cool to room temperature (within 2 hours) before refrigerating to prevent raising the fridge's internal temperature.",
      "<strong>Airtight Containers:</strong> Store leftovers in clear, airtight containers. This keeps bacteria out, retains moisture, and lets you see what you have.",
      "<strong>The 3-4 Day Rule:</strong> Most cooked leftovers are safe to eat for 3-4 days when stored properly in the fridge.",
      "<strong>Label & Date:</strong> Get in the habit of labeling containers with the contents and the date it was made. It takes the guesswork out of 'Is this still good?'.",
    ]
  },
  {
    category: 'Grains & Breads',
    tips: [
      "<strong>Bread:</strong> Store at room temperature in a bread box or paper bag. Avoid the fridge, which makes it go stale faster. For long-term storage, freeze it.",
      "<strong>Cooked Grains (Rice, Quinoa):</strong> Store in an airtight container in the fridge for up to 4 days.",
      "<strong>Uncooked Grains & Flour:</strong> Keep in airtight containers in a cool, dark pantry to protect from pests and moisture.",
      "<strong>Stale Bread:</strong> Don't throw it out! Turn it into croutons, breadcrumbs, or French toast.",
    ]
  },
  {
    category: 'Spices & Condiments',
    tips: [
      "<strong>Dried Spices:</strong> Store in a cool, dark place away from the stove. Heat and light will degrade their flavor.",
      "<strong>Opened Condiments:</strong> Ketchup, mustard, and mayonnaise should be stored in the fridge after opening to maintain quality and safety.",
      "<strong>Oils:</strong> Store cooking oils like olive oil in a cool, dark pantry. Refrigeration can cause some oils to solidify and become cloudy.",
    ]
  }
];

// --- SUB-COMPONENTS --- //

interface AccordionItemProps {
  category: string;
  tips: string[];
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ category, tips, isOpen, onClick }) => (
  <div className="border-b border-gray-200">
    <h2>
      <button
        type="button"
        className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-700 hover:bg-gray-100 transition-colors"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{category}</span>
        <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </h2>
    <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <div className="p-5 bg-white">
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    {tips.map((tip, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: tip }} />
                    ))}
                </ul>
            </div>
        </div>
    </div>
  </div>
);


// --- MAIN MODAL COMPONENT --- //
interface StorageTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StorageTipsModal({ isOpen, onClose }: StorageTipsModalProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 animate-fade-in" onClick={onClose}>
      <div className="relative bg-gray-50 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col transition-transform duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ArchiveBoxIcon className="w-8 h-8 text-orange-500" />
              Food Storage Tips
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 z-10 p-2 bg-white/50 rounded-full" aria-label="Close storage tips">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="overflow-y-auto">
            <div className="p-4 sm:p-6">
                <p className="text-center text-gray-600 mb-6">Proper storage is key to reducing food waste, saving money, and keeping your food fresh and delicious. Here are some tips for common food categories.</p>
                <div id="accordion-flush" className="border-t border-gray-200">
                    {storageTipsData.map((item, index) => (
                        <AccordionItem
                        key={index}
                        category={item.category}
                        tips={item.tips}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
