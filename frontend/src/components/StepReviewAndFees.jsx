import React from 'react';

const FeeRow = ({ label, amount }) => (
  <div className="flex items-center justify-between py-2">
    <div className="text-sm text-white/80">{label}</div>
    <div className="font-medium text-white">{amount}</div>
  </div>
);

const StepReviewAndFees = ({ formData }) => {
  // Mock fee calculation
  const base = 300;
  const typeMultiplier = formData.patentType === 'Design' ? 0.8 : formData.patentType === 'Provisional' ? 0.5 : 1;
  const total = Math.round(base * typeMultiplier);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Review & Fees</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="font-medium mb-2">Applicant</h3>
          <div className="text-sm text-white/80">{formData.applicantName}</div>
          <div className="text-sm text-white/80">{formData.email}</div>
          <div className="text-sm text-white/80">{formData.country} — {formData.applicantType}</div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="font-medium mb-2">Patent</h3>
          <div className="text-sm text-white/80">Type: {formData.patentType}</div>
          <div className="text-sm text-white/80">Title: {formData.title}</div>
          <div className="text-sm text-white/80">Inventors: {formData.inventors}</div>
          <div className="text-sm text-white/80">Filing date: {formData.filingDate}</div>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-4">
        <h3 className="font-medium mb-2">Fee Summary</h3>
        <FeeRow label="Base filing fee" amount={`$${base}`} />
        <FeeRow label={`${formData.patentType} multiplier`} amount={`${(typeMultiplier).toFixed(2)}x`} />
        <div className="border-t border-white/10 my-2" />
        <FeeRow label="Total (mock)" amount={`$${total}`} />
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="font-medium mb-2">Abstract</h3>
        <div className="text-sm text-white/80 whitespace-pre-wrap">{formData.abstract || '—'}</div>
      </div>
    </div>
  );
};

export default StepReviewAndFees;
