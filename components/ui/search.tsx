import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
}

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();

  const toggleSearch = useCallback(() => {
    setIsOpen(!isOpen);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        toggleSearch();
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      }

      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          router.push(selected.url);
          toggleSearch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router, toggleSearch]);

  // Mock search results - replace with actual search logic
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [
      { 
        id: '1', 
        title: 'Basic Plan', 
        description: 'Our starter internet plan', 
        url: '/#plans' 
      },
      { 
        id: '2', 
        title: 'Premium Plan', 
        description: 'High-speed fiber connection', 
        url: '/#plans' 
      },
      { 
        id: '3', 
        title: 'Contact Support', 
        description: 'Get help with your service', 
        url: '/contacts' 
      },
      { 
        id: '4', 
        title: 'Request Quote', 
        description: 'Get pricing for your area', 
        url: '/quote' 
      },
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(searchResults);
  }, [query]);

  return (
    <>
      <button
        onClick={toggleSearch}
        className="flex items-center px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search...
        <span className="ml-2 opacity-60">⌘K</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleSearch}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-x-0 top-[15%] mx-auto max-w-2xl z-50 p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
                      placeholder="Search anything..."
                    />
                  </div>
                </div>

                {results.length > 0 && (
                  <div className="py-4 px-2 max-h-[60vh] overflow-y-auto">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          router.push(result.url);
                          toggleSearch();
                        }}
                        className={`w-full px-4 py-3 flex items-start space-x-4 rounded-lg ${
                          selectedIndex === index
                            ? 'bg-blue-50 dark:bg-blue-900/50'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {result.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {query && results.length === 0 && (
                  <div className="py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                    No results found for "{query}"
                  </div>
                )}

                <div className="p-4 border-t dark:border-gray-700 text-xs text-gray-400">
                  <div className="flex items-center justify-end space-x-4">
                    <span>↑↓ to navigate</span>
                    <span>enter to select</span>
                    <span>esc to close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};