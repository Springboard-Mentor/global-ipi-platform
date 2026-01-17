import React, { useState, useEffect } from 'react';
import { 
  Check, ArrowLeft, Zap, Shield, Crown, 
  Clock, AlertTriangle, X, RefreshCw 
} from 'lucide-react';
import axios from 'axios';
import confetti from 'canvas-confetti';

// --- CONFIGURATION ---
const RAZORPAY_KEY_ID = "rzp_test_1DP5mmOlF5G5ag"; 
const API_BASE = "http://localhost:5001/api"; 

const PricingPage = ({ onNavigate, onUpdateUser }) => {
  const [user, setUser] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); 
  const [loading, setLoading] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);

  // --- 1. LOAD USER DATA ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("👤 Pricing Page Loaded. Current User Plan:", parsedUser.planType); // DEBUG LOG
      setUser(parsedUser);
      if (parsedUser.subscriptionDate) calculateRefundValue(parsedUser);
    } else {
        console.warn("⚠️ No user found in LocalStorage!");
    }
  }, []);

  // --- 2. REFUND CALCULATOR ---
  useEffect(() => {
    let interval;
    if (user?.planType && user.planType !== 'STARTUP') {
      interval = setInterval(() => calculateRefundValue(user), 60000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const calculateRefundValue = (currentUser) => {
    if (!currentUser.subscriptionDate || !currentUser.amountPaid) {
      setRefundAmount(0);
      return;
    }
    const start = new Date(currentUser.subscriptionDate).getTime();
    const now = new Date().getTime();
    const durationDays = currentUser.durationDays || 30; 
    const totalDurationMs = durationDays * 24 * 60 * 60 * 1000;
    const timeUsed = now - start;
    const percentageUsed = Math.min(Math.max(timeUsed / totalDurationMs, 0), 1);
    const refund = currentUser.amountPaid * (1 - percentageUsed);
    setRefundAmount(Math.max(0, Math.floor(refund)));
  };

  // --- 3. RAZORPAY PAYMENT LOGIC ---
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    if (plan.monthlyPrice === 0) return;

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load.');
      setLoading(false);
      return;
    }

    const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    
    const options = {
      key: RAZORPAY_KEY_ID, 
      currency: "INR", 
      amount: amount * 100, 
      name: "Global IP Platform",
      description: `${plan.name} - ${billingCycle}`,
      image: "https://cdn-icons-png.flaticon.com/512/2038/2038022.png",
      handler: function (response) {
        console.log("💰 Payment Success ID:", response.razorpay_payment_id);
        updateUserPlan(plan, amount, response.razorpay_payment_id);
      },
      prefill: {
        name: user?.name || "User",
        email: user?.email || "user@example.com",
        contact: user?.phone || "9999999999"
      },
      theme: { color: "#4F46E5" }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  // --- 4. SUBSCRIBE UPDATE LOGIC ---
  const updateUserPlan = async (plan, amountPaid = 0, paymentId = 'free_tier') => {
    const startDate = new Date();
    const durationDays = billingCycle === 'monthly' ? 30 : 365;
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + durationDays);

    const updatedUser = {
      ...user,
      planType: plan.id, 
      plan: plan.id,          
      planName: plan.name,    
      billingCycle,
      subscriptionDate: startDate.toISOString(),
      renewalDate: renewalDate.toDateString(), 
      amountPaid: amountPaid,
      durationDays: durationDays
    };

    try {
        console.log("🚀 Syncing Subscription to Backend...");
        await axios.post(`${API_BASE}/subscriptions/subscribe`, {
            userId: user.id,
            planName: plan.id, 
            billingCycle: billingCycle,
            amount: amountPaid,
            paymentId: paymentId 
        });
        console.log("✅ Backend Sync Success!");
    } catch (error) {
        console.error("❌ Backend Sync Failed:", error);
        alert("Payment successful, but server sync failed. Please contact support.");
    }

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    if (onUpdateUser) onUpdateUser(updatedUser);

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  // --- 5. 🛑 DEBUGGED CANCEL LOGIC 🛑 ---
  const handleCancel = async () => {
    // 🛑 LOG 1: Start
    console.log("🖱️ Cancel Button Clicked");

    if (!user || !user.id) {
        console.error("❌ User ID missing in state:", user);
        alert("Error: User ID missing. Try logging in again.");
        return;
    }

    if (window.confirm(`Are you sure you want to cancel? Refund value: ₹${refundAmount}`)) {
      
      // 🛑 LOG 2: Sending Request
      console.log(`🚀 Sending POST request to: ${API_BASE}/subscriptions/cancel`);
      console.log("📦 Payload:", { userId: user.id });

      try {
          const response = await axios.post(`${API_BASE}/subscriptions/cancel`, { 
              userId: user.id 
          });

          // 🛑 LOG 3: Success
          console.log("✅ Backend Response:", response.data);

          // Update Local State to Free Tier
          const updatedUser = {
            ...user,
            planType: 'STARTUP',
            plan: 'STARTUP', 
            planName: 'Inventor Basic',
            subscriptionDate: null,
            renewalDate: null,
            amountPaid: 0
          };
          
          console.log("🔄 Updating Local Storage...");
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
          if (onUpdateUser) onUpdateUser(updatedUser);
          
          alert("Subscription Cancelled Successfully.");
          
          // Optional: Force reload to clear any cached UI states
          // window.location.reload(); 

      } catch (error) {
          // 🛑 LOG 4: Error Handling
          console.error("❌ CANCEL REQUEST FAILED:", error);
          
          if (error.response) {
              console.error("   Server Error Data:", error.response.data);
              console.error("   Server Status:", error.response.status);
              alert(`Server Error: ${error.response.data.error || "Failed to cancel"}`);
          } else if (error.request) {
              console.error("   No response received from backend.");
              alert("Network Error: Backend is not reachable.");
          } else {
              alert("Error: " + error.message);
          }
      }
    }
  };

  // --- PLANS DATA ---
  const plans = [
    {
      id: 'STARTUP',
      name: 'Inventor Basic',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Essential tools for students & starters.',
      features: ['Basic Patent Search', 'View Public IP Analytics', 'No Filings Allowed', 'Email Support'],
      color: 'bg-slate-500',
      btnText: 'Current Plan'
    },
    {
      id: 'PRO',
      name: 'IP Professional',
      monthlyPrice: 199,  
      yearlyPrice: 1999,
      popular: true,
      description: 'Perfect for freelancers & individual agents.',
      features: ['10 Patent Searches / Month', 'Full IP Analytics Access', '5 Patent Filing Application', 'Send Request to Admin', 'Priority Email Support'],
      color: 'bg-indigo-600',
      btnText: 'Subscribe @ ₹199'
    },
    {
      id: 'ENTERPRISE',
      name: 'Global Enterprise',
      monthlyPrice: 499, 
      yearlyPrice: 4999,
      description: 'Unlimited power for serious firms.',
      features: ['Unlimited Searches', 'Unlimited Filings', 'Download AI Reports', 'Real-time Status', 'Dedicated Admin Support'],
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      btnText: 'Go Enterprise @ ₹499'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER */}
      <div className="bg-[#0f172a] text-white px-6 py-4 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-300 hover:text-white transition font-semibold">
            <ArrowLeft size={20} /> Back to Dashboard
          </button>

          {/* Show Active Plan Details if NOT Startup */}
          {user?.planType && user.planType !== 'STARTUP' && (
            <div className="flex items-center gap-4 bg-slate-800 p-2 pr-4 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
              <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><Crown size={20} /></div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Plan</p>
                <p className="font-bold text-white text-sm leading-none">{user.planName || user.planType}</p>
              </div>
              <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>
              <div className="text-right">
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Refund Value</p>
                 <p className="text-emerald-400 font-mono font-bold text-sm">₹{refundAmount}</p>
              </div>
              <button onClick={handleCancel} className="ml-2 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Accessible Innovation Pricing</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Get started for as low as ₹199. Cancel anytime.</p>
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center items-center mt-8 gap-4 select-none">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')} className="relative w-14 h-7 bg-indigo-600 rounded-full p-1 transition-all cursor-pointer">
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-emerald-600 text-xs bg-emerald-100 px-2 py-0.5 rounded-full ml-1 font-extrabold">-20%</span></span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => {
            const isCurrent = user?.planType === plan.id; 
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <div key={plan.id} className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all hover:-translate-y-2 hover:shadow-2xl overflow-hidden flex flex-col h-full ${plan.popular ? 'border-indigo-600 scale-105 z-10' : 'border-slate-100'}`}>
                {plan.popular && <div className="bg-indigo-600 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest">Best Value</div>}
                
                <div className="p-8 pb-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mt-2 min-h-[40px]">{plan.description}</p>
                  
                  <div className="my-6">
                    <span className="text-5xl font-extrabold text-slate-900">₹{price}</span>
                    <span className="text-slate-400 font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleSubscribe(plan)} 
                    disabled={isCurrent || loading} 
                    className={`w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-md ${isCurrent ? 'bg-emerald-100 text-emerald-700 cursor-default shadow-none border border-emerald-200' : plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    {loading ? 'Processing...' : (isCurrent ? 'Current Plan' : plan.btnText)}
                  </button>
                </div>
                
                <div className="p-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">What's included</p>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 ${plan.popular ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}><Check size={14} strokeWidth={3} /></div>
                        <span className="text-sm font-medium text-slate-700 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;