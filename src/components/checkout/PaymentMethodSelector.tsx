import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Banknote, QrCode, Building2 } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  return (
    <div className="bg-card rounded-lg shadow-soft p-6">
      <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
        Payment Method
      </h2>

      <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
        {/* UPI QR Code */}
        <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${value === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <RadioGroupItem value="upi" id="upi" className="mt-1" />
          <Label htmlFor="upi" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <QrCode className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">UPI Payment</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan QR code and pay via any UPI app (GPay, PhonePe, Paytm, etc.)
            </p>
          </Label>
        </div>

        {/* Bank Transfer */}
        <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${value === 'bank_transfer' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
          <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Bank Transfer (NEFT/RTGS)</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transfer directly to our bank account. Order will be processed after payment confirmation.
            </p>
          </Label>
        </div>

        {/* Cash on Delivery */}
        <div className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${value === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
          <RadioGroupItem value="cod" id="cod" className="mt-1" />
          <Label htmlFor="cod" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Cash on Delivery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay when you receive your order. Available for all locations.
            </p>
          </Label>
        </div>
      </RadioGroup>

      {/* UPI QR Code Display */}
      {value === 'upi' && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
          <p className="font-semibold text-foreground mb-3">Scan to Pay</p>
          <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
            <div className="w-48 h-48 bg-muted rounded flex items-center justify-center">
              <QrCode className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            After placing your order, scan the QR code and complete payment. Share screenshot in order notes or via WhatsApp.
          </p>
        </div>
      )}

      {/* Bank Transfer Details */}
      {value === 'bank_transfer' && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-foreground mb-3">Bank Account Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank Name:</span>
              <span className="font-medium text-foreground">State Bank of India</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name:</span>
              <span className="font-medium text-foreground">Cermiconest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account No:</span>
              <span className="font-medium text-foreground">XXXXXXXXXXXX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IFSC Code:</span>
              <span className="font-medium text-foreground">SBIN0XXXXXX</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Please share payment receipt via email or WhatsApp after transfer.
          </p>
        </div>
      )}

      {/* COD Info */}
      {value === 'cod' && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💰 Pay in cash when your order is delivered. Our delivery partner will collect the payment at your doorstep.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
