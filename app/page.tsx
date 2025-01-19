'use client'
import { motion } from 'framer-motion';
import Head from 'next/head';
import {PlansCarousel} from '@/components/ui/carousel';

export default function Home() {
  const plans = [
    {
      name: "Rural FTTH Voice Unlimited",
      speed: "Up to 25 Mbps till 10 GB, Up to 2 Mbps beyond 10 GB",
      price: "₹249/mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "For New Customers only", included: true }
      ]
    },
    {
      name: "FTTH Voice Unlimited", 
      speed: "Up to 25 Mbps till 20 GB, Up to 2 Mbps beyond 20 GB",
      price: "₹299/mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "For New Customers only", included: true }
      ]
    },
    {
      name: "Fibre Rural Home WiFi",
      speed: "Up to 30 Mbps till 1400 GB, 4 Mbps beyond 1400 GB", 
      price: "₹399/mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "For INDIVIDUAL Category Only in Rural Areas", included: true }
      ]
    },
    {
      name: "Fibre Experience",
      speed: "Up to 30 Mbps till 1000 GB, 4 Mbps beyond 1000 GB",
      price: "₹399/mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "Unlimited 24 Hours", included: true }
      ]
    },
    {
      name: "Fibre Basic Neo",
      speed: "Up to 50 Mbps till 3300 GB, 4 Mbps beyond 3300 GB",
      price: "₹449/mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "Unlimited 24 Hours", included: true }
      ]
    },
    {
      name: "Fibre Basic",
      speed: "Up to 60 Mbps till 3300 GB, 4 Mbps beyond 3300 GB",
      price: "₹499/mo", 
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "Unlimited 24 Hours", included: true }
      ]
    }
  ];

  const ruralPlans = [
    {
      name: "Rural FTTH Voice Unlimited",
      speed: "Up to 25 Mbps till 50 GB, Up to 2 Mbps beyond 50GB", 
      price: "₹999/6mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "For New Rural Customers only", included: true }
      ]
    },
    {
      name: "FTTH Rural Voice Unlimited",
      speed: "Up to 25 Mbps till 1300 GB, Up to 2 Mbps beyond 1300GB", 
      price: "₹999/3mo", 
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "For Rural Areas Only", included: true }
      ]
    },
    {
      name: "Fibre Rural Home WiFi",
      speed: "Up to 25 Mbps till 1400 GB, Up to 2 Mbps beyond 1400GB", 
      price: "₹1999/6mo",
      features: [
        { feature: "Unlimited Data Download", included: true },
        { feature: "Unlimited calls to any network", included: true },
        { feature: "For INDIVIDUAL Category Only in Rural Areas", included: true }
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>YourISP - High Speed Internet Provider</title>
        <meta name="description" content="Fast and reliable internet services" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-bold mb-6"
              >
                Lightning Fast Internet
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl mb-8"
              >
                Experience unlimited possibilities with our high-speed fiber internet
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold"
              >
                Check Availability
              </motion.button>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-4"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-center mb-12"
          >
            Select the perfect internet plan for your needs
          </motion.p>
          <PlansCarousel plans={plans} />
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-4"
          >
            Rural Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-center mb-12"
          >
            Specially designed plans for rural connectivity
          </motion.p>
          <PlansCarousel plans={ruralPlans} />
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-center mb-12"
            >
              Why Choose Us
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "99.9% Uptime",
                  description: "Reliable connection guaranteed with our state-of-the-art infrastructure",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z" // Lightning bolt
                },
                {
                  title: "24/7 Support",
                  description: "Our technical team is always ready to help you",
                  icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" // Chat
                },
                {
                  title: "Quick Installation",
                  description: "Get connected within 24 hours of service request",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" // Clock
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <motion.div 
                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                  >
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-bold mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.2 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.2 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
