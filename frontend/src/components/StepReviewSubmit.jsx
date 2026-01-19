import React from 'react';

const FileRow = ({ label, file }) => (
  <div className="flex items-center justify-between py-1">
    <div className="text-sm text-white/80">{label}</div>
    <div className="text-sm text-white">{file ? (file.name || (Array.isArray(file) ? file.map(f => f.name).join(', ') : (typeof file === 'string' ? file : ''))) : '—'}</div>
  </div>
);

const StepReviewSubmit = ({ formData, setStep }) => {
  const base = 300;
  const patentTypeMultiplier = formData.patentType === 'Design' ? 0.8 : formData.patentType === 'Provisional' ? 0.5 : 1;
  const applicantMultiplier = formData.applicantType === 'Individual' ? 1 : formData.applicantType === 'Startup' ? 0.9 : formData.applicantType === 'Company' ? 1.2 : formData.applicantType === 'University' ? 0.8 : 1;
  const jurisdictionMultiplier = (formData.jurisdiction || '').toLowerCase().includes('us') ? 1.5 : (formData.jurisdiction || '').toLowerCase().includes('wipo') ? 1.8 : 1;
  const total = Math.round(base * patentTypeMultiplier * applicantMultiplier * jurisdictionMultiplier);
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Review & Submit</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="font-medium mb-2">Applicant</h3>
          <div className="text-sm text-white/80">Name: {formData.applicantName}</div>
          <div className="text-sm text-white/80">Type: {formData.applicantType}</div>
          <div className="text-sm text-white/80">Nationality: {formData.nationality}</div>
          <div className="text-sm text-white/80">Phone: {formData.phone}</div>
          <div className="text-sm text-white/80">Email: {formData.email}</div>
          <div className="text-sm text-white/80">Role: {formData.filingRole} {formData.isInventor ? '(Inventor)' : ''}</div>
          <div className="mt-3">
            <button onClick={() => setStep(0)} className="px-3 py-1 bg-white/10 rounded">Edit</button>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="font-medium mb-2">Patent</h3>
          <div className="text-sm text-white/80">Type: {formData.patentType}</div>
          <div className="text-sm text-white/80">Jurisdiction: {formData.jurisdiction}</div>
          <div className="text-sm text-white/80">Field: {formData.technicalField}</div>
          <div className="text-sm text-white/80">Title: {formData.title}</div>
          <div className="mt-3">
            <button onClick={() => setStep(1)} className="px-3 py-1 bg-white/10 rounded">Edit</button>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="font-medium mb-2">Abstract</h3>
        <div className="text-sm text-white/80 whitespace-pre-wrap">{formData.abstract || '—'}</div>
      </div>

      <div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="font-medium mb-2">Uploads</h3>
        <FileRow label="Specification" file={formData.specificationFile} />
        <FileRow label="Claims" file={formData.claimsFile} />
        <FileRow label="Drawings" file={formData.drawingsFiles} />
      </div>

      <div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="font-medium mb-2">Fees</h3>
        <div className="text-sm text-white/80">Base: ${base}</div>
        <div className="text-sm text-white/80">Patent type multiplier: {patentTypeMultiplier}x</div>
        <div className="text-sm text-white/80">Applicant type multiplier: {applicantMultiplier}x</div>
        <div className="text-sm text-white/80">Jurisdiction multiplier: {jurisdictionMultiplier}x</div>
        <div className="border-t border-white/10 my-2" />
        <div className="text-sm font-semibold">Total (mock): ${total}</div>
        <div className="mt-2">
          <button onClick={() => setStep(2)} className="px-3 py-1 bg-white/10 rounded">Edit Payment</button>
        </div>
        <div className="mt-3 text-sm text-white/80">Payment method: {formData.paymentMethod || '—'}</div>
        <div className="text-sm text-green-300">Payment status: {formData.paymentStatus}</div>
      </div>
    </div>
  );
};

export default StepReviewSubmit;
