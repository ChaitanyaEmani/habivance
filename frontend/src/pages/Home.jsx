import { useState, useEffect, useMemo } from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeatureSection from '../components/home/FeatureSection';
import HowItWorks from '../components/home/HowItWorks';
import CTASection from '../components/home/CTASection';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Memoize sections configuration to prevent recreating on every render
  const sections = useMemo(() => [
    {
      id: 'hero',
      component: HeroSection,
      props: { token: isAuthenticated },
      className: 'bg-blue-600 text-white'
    },
    {
      id: 'stats',
      component: StatsSection,
      props: {},
      className: 'bg-white py-16'
    },
    {
      id: 'features',
      component: FeatureSection,
      props: {},
      className: 'py-20'
    },
    {
      id: 'how-it-works',
      component: HowItWorks,
      props: {},
      className: 'bg-blue-50 py-20'
    },
    {
      id: 'cta',
      component: CTASection,
      props: { token: isAuthenticated },
      className: 'bg-blue-600 text-white py-20'
    }
  ], [isAuthenticated]);

  return (
    <div className="bg-gray-50">
      {sections.map(({ id, component: Component, props, className }) => (
        <section key={id} className={className}>
          <Component {...props} />
        </section>
      ))}
    </div>
  );
};

export default Home;