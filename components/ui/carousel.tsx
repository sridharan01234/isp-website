'use client'

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CarouselProps {
  plans: Array<{
    name: string;
    speed: string;
    price: string;
    popular?: boolean;
    features: Array<{
      feature: string;
      included: boolean;
    }>;
  }>;
}

const useAutoPlay = (callback: () => void, interval: number, isEnabled: boolean = true) => {
  useEffect(() => {
    if (!isEnabled) return;
    
    const timer = setInterval(callback, interval);
    return () => clearInterval(timer);
  }, [callback, interval, isEnabled]);
};

export const PlansCarousel = ({ plans }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;

  // Calculate the indices of visible cards
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < visibleCount; i++) {
      indices.push((currentIndex + i) % plans.length);
    }
    return indices;
  };

  // Memoize the navigation functions
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length);
  }, [plans.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? plans.length - 1 : prevIndex - 1
    );
  }, [plans.length]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  useAutoPlay(nextSlide, 7000);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous plan"
        >
          <ChevronLeftIcon className="h-6 w-6 text-blue-600" />
        </motion.button>

        <div className="overflow-hidden w-full">
          <div className="relative flex justify-center gap-4">
            <AnimatePresence initial={false} mode="popLayout">
              {getVisibleIndices().map((index, i) => (
                <motion.div
                  key={`${plans[index].name}-${index}`}
                  initial={{ 
                    opacity: 0, 
                    x: 100,
                    scale: 0.8 
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1,
                    transition: {
                      duration: 0.3,
                      delay: i * 0.1
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -100,
                    scale: 0.8,
                    transition: {
                      duration: 0.3
                    }
                  }}
                  className="w-full max-w-sm flex-shrink-0"
                >
                  <div className={`
                    transform transition-all duration-300 hover:scale-105
                    ${i === 1 ? 'scale-110 z-10 shadow-xl' : 'scale-95 opacity-80 hover:opacity-100'}
                  `}>
                    <PlanCard {...plans[index]} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next plan"
        >
          <ChevronRightIcon className="h-6 w-6 text-blue-600" />
        </motion.button>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-8 gap-2">
        {plans.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 w-2 rounded-full transition-colors ${
              currentIndex === idx ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </motion.div>
    )}

export const PlanCard = ({ name, speed, price, popular, features }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
  <motion.div 
    className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform-gpu"
    whileHover={{ 
      y: -5,
      rotateX: 5,
      rotateY: 5,
      scale: 1.05
    }}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
    style={{
      perspective: "1000px"
    }}>
    <div className="p-6">
      <motion.h3 
        className="text-2xl font-bold text-gray-900"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {name}
      </motion.h3>
      <motion.p 
        className="mt-2 text-sm text-gray-500"
        animate={{ y: isHovered ? -2 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {speed}
      </motion.p>
      <motion.p 
        className="text-4xl font-bold text-blue-600 mt-4"
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {price}
      </motion.p>
      {popular && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-4">
          Popular
        </span>
      )}
      <ul className="mt-6 space-y-2">
        {features.map((feature: any, index: number) => (
          <li key={index} className="flex items-center">
            <span
              className={`h-4 w-4 mr-2 ${
                feature.included ? 'bg-green-500' : 'bg-gray-300'
              } rounded-full`}
            ></span>
            <span className="text-sm text-gray-500">{feature.feature}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
  )};