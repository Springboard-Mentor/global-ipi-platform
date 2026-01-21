import React, { useState } from 'react';

const mockNetBanks = ['HDFC', 'ICICI', 'SBI', 'Axis Bank', 'Other Bank'];

const StepFeesPayment = ({ formData, setFormData, errors, setErrors }) => {
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' });
  const [selected, setSelected] = useState(formData.paymentMethod || 'card');

  const base = 300;
  const patentTypeMultiplier = formData.patentType === 'Design' ? 0.8 : formData.patentType === 'Provisional' ? 0.5 : 1;
  const applicantMultiplier = formData.applicantType === 'Individual' ? 1 : formData.applicantType === 'Startup' ? 0.9 : formData.applicantType === 'Company' ? 1.2 : formData.applicantType === 'University' ? 0.8 : 1;
  const jurisdictionMultiplier = (formData.jurisdiction || '').toLowerCase().includes('us') ? 1.5 : (formData.jurisdiction || '').toLowerCase().includes('wipo') ? 1.8 : 1;
  const total = Math.round(base * patentTypeMultiplier * applicantMultiplier * jurisdictionMultiplier);

  const confirmPayment = (method) => {
    // Simple mock flow
    if (method === 'card') {
      if (!card.number || !card.name) return setErrors({ paymentMethod: 'Fill fake card details' });
    }
    setErrors({});
    setFormData(prev => ({ ...prev, paymentMethod: method, paymentStatus: 'paid' }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Fees & Payment (Test Mode)</h2>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/80">Base filing fee</div>
          <div className="font-medium text-white">${base}</div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-white/80">Type multiplier</div>
          <div className="font-medium text-white">{patentTypeMultiplier}x</div>
        </div>
        <div className="border-t border-white/10 my-2" />
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Total</div>
          <div className="text-xl font-bold text-white">${total}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => { setSelected('card'); }} className={`p-4 rounded-lg ${selected === 'card' ? 'ring-2 ring-cyan-400' : 'bg-white/5'}`}>
          <div className="font-medium">Credit / Debit Card</div>
          <div className="text-xs text-white/60 mt-1">Test mode - enter any card to proceed</div>
        </button>

        <button onClick={() => { setSelected('upi'); }} className={`p-4 rounded-lg ${selected === 'upi' ? 'ring-2 ring-cyan-400' : 'bg-white/5'}`}>
          <div className="font-medium">UPI QR</div>
          <div className="text-xs text-white/60 mt-1">Scan static test QR</div>
        </button>

        <button onClick={() => { setSelected('netbank'); }} className={`p-4 rounded-lg ${selected === 'netbank' ? 'ring-2 ring-cyan-400' : 'bg-white/5'}`}>
          <div className="font-medium">Net Banking</div>
          <div className="text-xs text-white/60 mt-1">Select bank and confirm</div>
        </button>
      </div>

      <div className="mt-4">
        {selected === 'card' && (
          <div className="bg-white/5 p-4 rounded-lg">
            <input placeholder="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className="w-full p-3 rounded mb-2 bg-white/6 text-white" disabled={formData.paymentStatus === 'paid'} />
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Name on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="w-full p-3 rounded bg-white/6 text-white" disabled={formData.paymentStatus === 'paid'} />
              <input placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} className="w-full p-3 rounded bg-white/6 text-white" disabled={formData.paymentStatus === 'paid'} />
            </div>
            <input placeholder="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className="mt-2 w-32 p-3 rounded bg-white/6 text-white" disabled={formData.paymentStatus === 'paid'} />

            <div className="mt-3 flex items-center gap-3">
              <button onClick={() => confirmPayment('card')} disabled={formData.paymentStatus === 'paid'} className={`px-4 py-2 ${formData.paymentStatus === 'paid' ? 'bg-white/10 text-white/60' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} rounded`}>Pay ${total} (Test)</button>
            </div>
            {formData.paymentStatus === 'paid' && (
              <div className="mt-4 flex items-center gap-3">
                <div className="text-green-300 text-2xl">✔</div>
                <div className="text-sm text-green-300">Payment Successful (Test Mode)</div>
              </div>
            )}
          </div>
        )}

        {selected === 'upi' && (
          <div className="bg-white/5 p-6 rounded-lg text-center">
            <div className="mx-auto w-48 h-48 bg-white/10 rounded-lg flex items-center justify-center">
              <img src="https://qrcg-free-editor.qr-code-generator.com/latest/assets/images/websiteQRCode_noFrame.png" alt="UPI QR" className="w-40 h-40" />
            </div>
            <div className="mt-3 text-sm text-white/70">Scan with your UPI app and then click Confirm (test)</div>
            <div className="mt-3">
              <button onClick={() => confirmPayment('upi')} disabled={formData.paymentStatus === 'paid'} className={`px-4 py-2 ${formData.paymentStatus === 'paid' ? 'bg-white/10 text-white/60' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} rounded`}>Confirm Payment (Test)</button>
            </div>
            {formData.paymentStatus === 'paid' && <div className="mt-3 text-green-300">Payment Successful (Test Mode)</div>}
          </div>
        )}

        {selected === 'netbank' && (
          <div className="bg-white/5 p-4 rounded-lg">
            <select onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))} defaultValue="" className="w-full p-3 rounded bg-white/6 text-white" disabled={formData.paymentStatus === 'paid'}>
              <option value="">Choose bank</option>
              {mockNetBanks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="mt-3">
              <button onClick={() => confirmPayment('netbank')} disabled={formData.paymentStatus === 'paid'} className={`px-4 py-2 ${formData.paymentStatus === 'paid' ? 'bg-white/10 text-white/60' : 'bg-gradient-to-r from-cyan-500 to-blue-600'} rounded`}>Proceed (Test)</button>
            </div>
            {formData.paymentStatus === 'paid' && <div className="mt-3 text-green-300">Payment Successful (Test Mode)</div>}
          </div>
        )}
      </div>

      {errors?.paymentMethod && <p className="text-xs text-red-400 mt-2">{errors.paymentMethod}</p>}

      {formData.paymentStatus === 'paid' && <div className="mt-3 text-sm text-green-300">Payment Successful (Test Mode)</div>}
    </div>
  );
};

export default StepFeesPayment;
