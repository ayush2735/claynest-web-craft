import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import StatsCounter from '@/components/home/StatsCounter';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import CTASection from '@/components/home/CTASection';
import OnlineUsersIndicator from '@/components/OnlineUsersIndicator';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <FeaturedProducts />
      <StatsCounter />
      <Categories />
      <Testimonials />
      <Newsletter />
      <CTASection />
      <OnlineUsersIndicator />
    </Layout>
  );
};

export default Index;
