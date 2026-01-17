import React, { useState, useEffect } from 'react';
import {
  Check, X, ArrowLeft, Smartphone,
  CreditCard, Landmark, Loader2, Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';

const REFUND_WINDOW = 15 * 60 * 1000; // 15 minutes

const PricingPage = ({ onNavigate, onUpdateUser }) => {
  const [user, setUser] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState('methods');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

  /* ================= USER INIT ================= */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;

    const u = JSON.parse(stored);
    setUser(u);

    if (!u.subscriptionDate) return;

    const elapsed = Date.now() - new Date(u.subscriptionDate).getTime();

    if (elapsed >= REFUND_WINDOW) {
      setTimeLeft(0);
      return;
    }

    startTimer(u.subscriptionDate);
  }, []);

  /* ================= TIMER ================= */
  const startTimer = (date) => {
    const interval = setInterval(() => {
      const endTime = new Date(date).getTime() + REFUND_WINDOW;
      const diff = endTime - Date.now();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        return;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s < 10 ? '0' : ''}${s}`);
    }, 1000);
  };

  /* ================= PLANS ================= */
  const plans = [
    {
      id: 'PRO',
      name: 'Professional',
      price: 29,
      yearly: 290,
      features: ['50 Patent Tracking', 'Email Alerts', 'PDF Export']
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 99,
      yearly: 990,
      recommended: true,
      features: ['Unlimited Tracking', 'Team Access', 'Priority Support']
    },
    {
      id: 'ULTIMATE',
      name: 'Ultimate',
      price: 199,
      yearly: 1990,
      features: ['AI Predictions', 'Global Data', 'White Label']
    }
  ];

  const getPrice = () =>
    billingCycle === 'monthly'
      ? selectedPlan.price
      : selectedPlan.yearly;

  /* ================= PAYMENT SUCCESS ================= */
  const completePayment = () => {
    setPaymentStep('processing');

    setTimeout(() => {
      const subDate = new Date().toISOString();

      const updatedUser = {
        ...user,
        planType: selectedPlan.id,
        subscriptionDate: subDate
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      onUpdateUser?.(updatedUser);

      startTimer(subDate);
      setPaymentStep('success');

      confetti({ particleCount: 200, spread: 90 });
    }, 2000);
  };

  /* ================= CANCEL SUBSCRIPTION ================= */
  const cancelSubscription = () => {
    if (!timeLeft || timeLeft === 0) return;

    const updatedUser = {
      ...user,
      planType: null,
      subscriptionDate: null
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    onUpdateUser?.(updatedUser);

    setTimeLeft(null);
    alert('Subscription cancelled. Refund will be processed.');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pb-32">

      {/* HEADER */}
      <div className="flex justify-between items-center px-10 py-6 text-white">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 font-black text-sm"
        >
          <ArrowLeft size={18} /> Dashboard
        </button>

        {timeLeft > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
              <Clock size={14} />
              <span className="font-black text-xs">
                Refund available: {timeLeft}
              </span>
            </div>

            <button
              onClick={cancelSubscription}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-black text-xs"
            >
              Cancel Plan
            </button>
          </div>
        )}
      </div>

      {/* HERO */}
      <div className="text-center text-white py-16">
        <h1 className="text-6xl font-black mb-3">
          Choose Your Global IP Plan
        </h1>
        <p className="opacity-90 font-semibold">
          Simple pricing. Powerful protection.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          {['monthly', 'yearly'].map(cycle => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-8 py-3 rounded-full font-black text-sm transition ${
                billingCycle === cycle
                  ? 'bg-white text-indigo-700'
                  : 'bg-white/20'
              }`}
            >
              {cycle.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-8 -mt-10">
        {plans.map(plan => {
          const active = user.planType === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-[2.5rem] p-10 shadow-2xl transition transform hover:-translate-y-3 ${
                plan.recommended ? 'ring-4 ring-pink-500' : ''
              }`}
            >
              {plan.recommended && (
                <span className="inline-block bg-pink-500 text-white text-xs font-black px-4 py-1 rounded-full mb-4">
                  MOST POPULAR
                </span>
              )}

              <h3 className="font-black text-sm uppercase">
                {plan.name}
              </h3>

              <p className="text-6xl font-black my-6">
                ${billingCycle === 'monthly' ? plan.price : plan.yearly}
              </p>

              <ul className="space-y-3 mb-10">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2 font-bold">
                    <Check className="text-indigo-600" size={16} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={active}
                onClick={() => {
                  setSelectedPlan(plan);
                  setIsPaymentOpen(true);
                  setPaymentStep('methods');
                }}
                className={`w-full py-4 rounded-xl font-black uppercase text-sm ${
                  active
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white'
                }`}
              >
                {active ? 'Active Plan' : 'Upgrade'}
              </button>

              {active && timeLeft === 0 && (
                <p className="text-xs text-center mt-3 opacity-70">
                  Refund period expired
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {isPaymentOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden">

            <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-4 flex justify-between">
              <span className="font-black">Global IP Payment</span>
              <button onClick={() => setIsPaymentOpen(false)}>
                <X />
              </button>
            </div>

            {paymentStep === 'methods' && (
              <div className="p-6 space-y-4">

                <button onClick={() => setSelectedMethod('upi')} className="payment-btn">
                  <Smartphone /> UPI (Google Pay / PhonePe)
                </button>

                <button onClick={() => setSelectedMethod('card')} className="payment-btn">
                  <CreditCard /> Credit / Debit Card
                </button>

                <button onClick={() => setSelectedMethod('net')} className="payment-btn">
                  <Landmark /> Net Banking
                </button>

                {selectedMethod === 'upi' && (
                  <div className="space-y-4 text-center">
                    {!isMobile && (
                      <QRCodeSVG
                        value={`upi://pay?pa=globalip@upi&am=${getPrice()}`}
                        size={180}
                        className="mx-auto"
                      />
                    )}

                    <button onClick={completePayment} className="confirm-btn">
                      Confirm Payment
                    </button>
                  </div>
                )}

                {selectedMethod === 'card' && (
                  <div className="space-y-3">
                    <input className="input" placeholder="Card Number" />
                    <input className="input" placeholder="Card Holder Name" />
                    <div className="flex gap-3">
                      <input className="input" placeholder="MM/YY" />
                      <input className="input" placeholder="CVV" />
                    </div>
                    <button onClick={completePayment} className="confirm-btn">
                      Pay ${getPrice()}
                    </button>
                  </div>
                )}

                {selectedMethod === 'net' && (
                  <div className="space-y-3">
                    <select className="input">
                      <option>Select Bank</option>
                      <option>SBI</option>
                      <option>HDFC</option>
                      <option>ICICI</option>
                    </select>
                    <input className="input" placeholder="Account Number" />
                    <input className="input" placeholder="IFSC Code" />
                    <button onClick={completePayment} className="confirm-btn">
                      Pay ${getPrice()}
                    </button>
                  </div>
                )}
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="p-20 text-center">
                <Loader2 className="animate-spin mx-auto" size={48} />
                <p className="font-black mt-6">Processing Payment...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-10 text-center space-y-4">
                <Check size={48} className="text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-black">
                  Plan Activated 🎉
                </h2>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="confirm-btn"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INLINE STYLES */}
      <style>{`
        .payment-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-weight: 800;
          display: flex;
          gap: 12px;
          align-items: center;
          border: 2px solid #e5e7eb;
        }
        .confirm-btn {
          width: 100%;
          background: linear-gradient(to right, #6366f1, #ec4899);
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-weight: 900;
        }
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default PricingPage;
