import React from 'react';
import { FaHistory, FaGlobe, FaUsers, FaAward, FaCheckCircle } from 'react-icons/fa';
import AnimatedCard from '../components/animations/AnimatedCard';
import factoryCar from '../components/assets/factoryCar.png'

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-zip-blue-900 dark:bg-zip-blue-950 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="About background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-zip-blue-900 dark:bg-zip-blue-950 opacity-80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedCard animation="fade">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Zip Xpress
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Building the future of global logistics with Zip Xpress technology, reliability, and customer-first service.
            </p>
          </AnimatedCard>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <AnimatedCard animation="slide">
              <div>
                <h2 className="text-3xl font-extrabold text-zip-red-600 dark:text-white sm:text-4xl">
                  Our Story
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500 dark:text-gray-400">
                  Founded in 2004, Zip Xpress began with a simple mission: to make shipping and tracking accessible to everyone. What started as a small tracking service has grown into a comprehensive logistics platform serving customers worldwide.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-zip-red-600 dark:bg-zip-red-600 text-white">
                      <FaHistory className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-zip-red-600 dark:text-white">19+ Years of Experience</h3>
                      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                        Over 19 years of Zip Xpress excellence in the logistics industry.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-zip-red-600 dark:bg-zip-red-600 text-white">
                      <FaGlobe className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-zip-red-600 dark:text-white">Global Reach</h3>
                      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                        Operating in over 150 countries with local partners.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
            <div className="mt-8 lg:mt-0">
              <AnimatedCard animation="fade" delay="200ms">
                <div className="relative rounded-lg shadow-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={factoryCar}
                    alt="Our team"
                  />
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedCard animation="fade">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-zip-red-600 dark:text-white sm:text-4xl">
                Our Zip Xpress Core Values
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                The principles that guide our every action and decision.
              </p>
            </div>
          </AnimatedCard>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedCard animation="hover" delay="0ms">
              <div className="pt-6">
                <div className="flow-root bg-white dark:bg-gray-900 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-zip-red-600 dark:bg-zip-red-600 rounded-md shadow-lg">
                      <FaCheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-zip-red-600 dark:text-white tracking-tight">Reliability</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      We deliver on our promises, ensuring your packages arrive safely and on time, every time.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="hover" delay="200ms">
              <div className="pt-6">
                <div className="flow-root bg-white dark:bg-gray-900 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-zip-red-600 dark:bg-zip-red-600 rounded-md shadow-lg">
                      <FaUsers className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-zip-red-600 dark:text-white tracking-tight">Customer Focus</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      Our customers are at the heart of everything we do. We strive to exceed expectations.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard animation="hover" delay="400ms">
              <div className="pt-6">
                <div className="flow-root bg-white dark:bg-gray-900 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-zip-red-600 dark:bg-zip-red-600 rounded-md shadow-lg">
                      <FaAward className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-zip-red-600 dark:text-white tracking-tight">Excellence</h3>
                    <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                      We are committed to the highest standards of quality in all Zip Xpress services and operations.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-zip-red-600 dark:bg-zip-red-950">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedCard animation="fade">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Zip Xpress is Trusted by businesses worldwide
              </h2>
              <p className="mt-3 text-xl text-gray-300 sm:mt-4">
                Our Zip Xpress global network and technology-driven approach deliver results.
              </p>
            </AnimatedCard>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <AnimatedCard animation="fade" delay="0ms">
              <div className="flex flex-col">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">Countries Served</dt>
                <dd className="order-1 text-5xl font-extrabold text-white">150+</dd>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="fade" delay="200ms">
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">Happy Clients</dt>
                <dd className="order-1 text-5xl font-extrabold text-white">50k+</dd>
              </div>
            </AnimatedCard>
            <AnimatedCard animation="fade" delay="400ms">
              <div className="flex flex-col mt-10 sm:mt-0">
                <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">On-time Delivery</dt>
                <dd className="order-1 text-5xl font-extrabold text-white">99%</dd>
              </div>
            </AnimatedCard>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default About;