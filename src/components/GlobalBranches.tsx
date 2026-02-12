import React from 'react';
import { FaMapMarkerAlt, FaGlobeAmericas } from 'react-icons/fa';
import AnimatedCard from './animations/AnimatedCard';
import { motion } from 'framer-motion';
import '../styles/animations.css';

interface Branch {
    city: string;
    country: string;
    address: string;
    postalCode: string;
    region?: string;
}

const branches: Branch[] = [
    {
        city: 'International Falls',
        region: 'MN',
        postalCode: '56649',
        country: 'United States (USA)',
        address: '616 Seventh St'
    },
    {
        city: 'Vernal',
        region: 'UT',
        postalCode: '84078',
        country: 'United States (USA)',
        address: '429 S 200 E'
    },
    {
        city: 'Athens',
        region: 'GA',
        postalCode: '30605',
        country: 'United States',
        address: '166 Spruce Valley Rd'
    },
    {
        city: 'Morris',
        region: 'MB',
        postalCode: 'R0G 1K0',
        country: 'Canada',
        address: '23 Cedar Cres'
    },
    {
        city: 'Southsea',
        region: '',
        postalCode: 'PO4 9PF',
        country: 'England',
        address: '4 Tokar Street'
    },
    {
        city: 'Dieppe',
        region: '',
        postalCode: '76200',
        country: 'France',
        address: '63 bis Route de Pourville'
    },
    {
        city: 'Cuxhaven',
        region: 'Duhnen',
        postalCode: '27476',
        country: 'Germany',
        address: 'Am Grooten Steen 3A'
    }
];

interface GlobalBranchesProps {
    variant?: 'grid' | 'marquee';
    speed?: number;
}

const GlobalBranches: React.FC<GlobalBranchesProps> = ({ variant = 'grid', speed = 35 }) => {
    const renderCard = (branch: Branch, index: number, isDuplicate = false) => (
        <div
            key={isDuplicate ? `duplicate-${index}` : index}
            className={`${variant === 'marquee' ? 'w-80 flex-shrink-0 mx-4' : ''}`}
        >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                        <FaMapMarkerAlt className="text-zip-red-600 dark:text-zip-red-500 h-5 w-5" />
                    </div>
                    <div className="ml-4 text-left">
                        <h4 className="text-lg font-bold text-zip-blue-800 dark:text-white mb-1">
                            {branch.city}{branch.region ? `, ${branch.region}` : ''}
                        </h4>
                        <div className="flex items-center text-sm font-medium text-zip-red-600 dark:text-zip-red-500 mb-2">
                            <FaGlobeAmericas className="mr-1 h-3 w-3" />
                            {branch.country}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-normal">
                            {branch.address}<br />
                            {branch.city}{branch.region ? ` ${branch.region}` : ''} {branch.postalCode}<br />
                            {branch.country}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    if (variant === 'marquee') {
        return (
            <div className="relative overflow-hidden py-8 group">
                <div
                    className="flex whitespace-nowrap animate-marquee-infinite pause-marquee"
                    style={{ width: "fit-content" }}
                >
                    {/* Render branches twice for a perfect infinite loop */}
                    <div className="flex">
                        {branches.map((branch, index) => renderCard(branch, index))}
                    </div>
                    <div className="flex">
                        {branches.map((branch, index) => renderCard(branch, index, true))}
                    </div>
                </div>
                {/* Gradient Masks for smooth entry/exit */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none"></div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes marquee-infinite {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee-infinite {
                        animation: marquee-infinite ${speed}s linear infinite;
                    }
                    .group:active .pause-marquee {
                        animation-play-state: paused !important;
                    }
                ` }} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
                <AnimatedCard key={index} animation="slide" delay={`${index * 100}ms`}>
                    {renderCard(branch, index)}
                </AnimatedCard>
            ))}
        </div>
    );
};

export default GlobalBranches;
