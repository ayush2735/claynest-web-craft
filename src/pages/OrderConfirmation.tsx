import { useLocation, Link, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, Mail, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-accent" />
          </div>

          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-muted-foreground text-lg mb-2">
            Thank you for your order. We've received your request and will process it shortly.
          </p>

          <p className="text-sm text-muted-foreground mb-8">
            Order ID: <span className="font-mono font-medium text-foreground">{orderId}</span>
          </p>

          <div className="bg-card rounded-lg shadow-soft p-8 mb-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              What happens next?
            </h2>
            <ol className="text-left space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                <span>Our team will review your order and verify product availability.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                <span>You'll receive a confirmation email with payment instructions.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">3</span>
                <span>Once payment is confirmed, we'll prepare your order for shipping.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
                <span>You'll receive tracking details when your order ships.</span>
              </li>
            </ol>
          </div>

          <div className="bg-primary/5 rounded-lg p-6 mb-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-3">
              Questions about your order?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:9369635323"
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                9369635323
              </a>
              <a
                href="mailto:ayushsinghrajput643@gmail.com"
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                ayushsinghrajput643@gmail.com
              </a>
            </div>
          </div>

          <Button asChild size="lg">
            <Link to="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
