import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { subscriptionPlans } from '../data/subscriptionPlans';
import { useSubscription } from '../context/SubscriptionContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { planKey } = useParams();
  const { upgradePlan } = useSubscription();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: ''
  });

  const plan = subscriptionPlans[planKey];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const success = await upgradePlan(planKey);
      setProcessing(false);
      
      if (success) {
        navigate('/subscription-status?success=true');
      } else {
        alert("Payment processing failed. Please try again.");
      }
    } catch (error) {
      setProcessing(false);
      alert("An error occurred during checkout.");
    }
  };

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-white/70">Upgrade to {plan.name} Plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>{plan.name} Plan</span>
                <span>${plan.price}/{plan.period}</span>
              </div>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${plan.price}/{plan.period}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold mb-2">What's included:</h3>
              <ul className="space-y-1 text-sm">
                <li>• {plan.features.ipSearch.limit === -1 ? 'Unlimited' : plan.features.ipSearch.limit} IP Searches</li>
                <li>• {plan.features.filingTracker.limit === -1 ? 'Unlimited' : plan.features.filingTracker.limit} Filing Tracking</li>
                {plan.features.alerts && <li>• Email Alerts</li>}
                {plan.features.analytics && <li>• Advanced Analytics</li>}
                {plan.features.apiAccess && <li>• API Access</li>}
                <li>• {plan.features.support} Support</li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-sm text-yellow-200">
                ⚠️ This is a test checkout. No real payment will be processed.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/pricing')}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Pay $${plan.price}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;