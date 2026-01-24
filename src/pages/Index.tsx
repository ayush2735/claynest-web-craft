import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Categories from '@/components/home/Categories';
import CTASection from '@/components/home/CTASection';
import OnlineUsersIndicator from '@/components/OnlineUsersIndicator';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <FeaturedProducts />
      <Categories />
      <CTASection />
      <OnlineUsersIndicator />
    </Layout>
  );
};

export default Index;
