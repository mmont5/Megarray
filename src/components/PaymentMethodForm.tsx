import React, { useState } from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const injected = new InjectedConnector({
  supportedChainIds: [1, 137], // Ethereum and Polygon
});

interface PaymentMethodFormProps {
  onSuccess?: () => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ onSuccess }) => {
  const [paymentType, setPaymentType] = useState<'card' | 'crypto'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const { activate, account, library } = useWeb3React();

  const handleCardSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1000, // $10.00
          currency: 'usd',
        }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // Card details would be collected via Stripe Elements
          },
          billing_details: {
            name: 'Test User',
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success('Payment method added successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to add payment method');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      await activate(injected);
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleCryptoPayment = async () => {
    if (!account || !library) {
      await connectWallet();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: ethers.parseEther('0.01'),
          currency: 'ETH',
          walletAddress: account,
        }),
      });

      const paymentDetails = await response.json();

      // Handle crypto payment verification
      // This would typically involve monitoring for the transaction
      // and calling the verify endpoint once confirmed

      toast.success('Crypto payment initiated');
      onSuccess?.();
    } catch (error) {
      console.error('Crypto payment error:', error);
      toast.error('Failed to process crypto payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setPaymentType('card')}
          className={`flex-1 p-4 rounded-lg border-2 ${
            paymentType === 'card'
              ? 'border-[#00E5BE] bg-[#00E5BE]/10'
              : 'border-gray-200'
          }`}
        >
          <CreditCard className="w-6 h-6 mb-2" />
          <span className="block font-medium">Credit Card</span>
        </button>
        <button
          onClick={() => setPaymentType('crypto')}
          className={`flex-1 p-4 rounded-lg border-2 ${
            paymentType === 'crypto'
              ? 'border-[#00E5BE] bg-[#00E5BE]/10'
              : 'border-gray-200'
          }`}
        >
          <Wallet className="w-6 h-6 mb-2" />
          <span className="block font-medium">Crypto</span>
        </button>
      </div>

      {paymentType === 'card' ? (
        <form onSubmit={handleCardSubmit} className="space-y-4">
          {/* Stripe Elements would be integrated here */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Add Card'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={handleCryptoPayment}
              disabled={isLoading}
              className="w-full py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Pay with Crypto'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function PaymentMethodFormWrapper(props: PaymentMethodFormProps) {
  return (
    <Web3ReactProvider getLibrary={(provider) => new ethers.BrowserProvider(provider)}>
      <PaymentMethodForm {...props} />
    </Web3ReactProvider>
  );
}