import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import StepApplicantDetails from './StepApplicantDetails';
import StepPatentDetails from './StepPatentDetails';
import StepFeesPayment from './StepFeesPayment';
import StepReviewSubmit from './StepReviewSubmit';
import { addFiling } from '../utils/filings';

const STEPS = ['Applicant Details', 'Patent Details', 'Fees & Payment', 'Review & Submit'];

const initialForm = {
  // Applicant
  applicantName: '',
  applicantType: 'Individual',
  nationality: '',
  // Address broken down
  addressStreet: '',
  addressCity: '',
  addressState: '',
  addressPostalCode: '',
  correspondenceSame: true,
  correspondenceStreet: '',
  correspondenceCity: '',
  correspondenceState: '',
  correspondencePostalCode: '',
  email: '',
  phone: '',
  filingRole: 'Inventor',
  isInventor: true,
  idType: '',
  idNumber: '',

  // Patent
  patentType: 'Utility',
  jurisdiction: 'India',
  technicalField: '',
  title: '',
  abstract: '',
  problemStatement: '',
  novelty: '',
  inventors: [{ name: '' }],
  priorityClaim: false,
  priorityApplicationNumber: '',
  priorityDate: '',
  specificationFile: null,
  claimsFile: null,
  drawingsFiles: [],

  // Payment
  paymentMethod: '',
  paymentStatus: 'unpaid',
};

const PatentFilingWizard = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { message: 'Please log in to file a patent application' } });
    }
  }, [navigate]);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem('patentFilingDraft');
      if (!raw) return initialForm;
      const parsed = JSON.parse(raw);
      // Normalize inventors to an array of {name}
      if (!parsed.inventors) parsed.inventors = initialForm.inventors;
      else if (!Array.isArray(parsed.inventors)) {
        // If older format was a comma-separated string or single object, coerce
        if (typeof parsed.inventors === 'string') {
          parsed.inventors = parsed.inventors.split(',').map(s => ({ name: s.trim() })).filter(i => i.name);
        } else if (typeof parsed.inventors === 'object') {
          parsed.inventors = [{ name: parsed.inventors.name || '' }];
        } else {
          parsed.inventors = initialForm.inventors;
        }
      }

      // Ensure missing keys fall back to initialForm
      return { ...initialForm, ...parsed };
    } catch (e) {
      return initialForm;
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ message: '', type: '' });

  useEffect(() => {
    // Serialize formData but omit File objects (store file names only)
    try {
      const draft = { ...formData };
      ['specificationFile', 'claimsFile'].forEach((k) => {
        const v = draft[k];
        if (v instanceof File) draft[k] = { name: v.name };
        else if (!v) draft[k] = null;
      });
      // drawingsFiles may be an array of File objects or metadata
      if (Array.isArray(draft.drawingsFiles)) {
        draft.drawingsFiles = draft.drawingsFiles.map(f => (f && f.name) ? { name: f.name } : f);
      } else if (!draft.drawingsFiles) {
        draft.drawingsFiles = [];
      }
      localStorage.setItem('patentFilingDraft', JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save draft', e);
    }
  }, [formData]);

  const validateStep = (s = step) => {
    const e = {};
    if (s === 0) {
      if (!formData.applicantName) e.applicantName = 'Applicant name is required';
      if (!formData.email) {
        e.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        e.email = 'Invalid email address';
      }
      if (!formData.nationality) e.nationality = 'Nationality is required';
      if (!formData.addressStreet) e.addressStreet = 'Street is required';
      if (!formData.addressCity) e.addressCity = 'City is required';
      if (!formData.addressState) e.addressState = 'State is required';
      if (!formData.addressPostalCode) e.addressPostalCode = 'Postal code is required';
      if (!formData.phone) e.phone = 'Phone is required';
      if (!formData.idType) e.idType = 'ID type is required';
      if (!formData.idNumber) e.idNumber = 'ID number is required';
    }
    if (s === 1) {
      if (!formData.title) e.title = 'Invention title is required';
      const invs = Array.isArray(formData.inventors) ? formData.inventors : (formData.inventors ? [formData.inventors] : []);
      if (!invs || invs.filter(i => i && i.name && i.name.trim()).length === 0) e.inventors = 'At least one inventor is required';
      if (!formData.technicalField) e.technicalField = 'Technical field is required';
      if (!formData.abstract || formData.abstract.trim().length < 10) e.abstract = 'Abstract must be at least 10 characters';
    }
    if (s === 2) {
      // No required fields for mock payment, but ensure a method chosen before confirming
      if (formData.paymentStatus !== 'paid' && !formData.paymentMethod) e.paymentMethod = 'Select a payment option or mark as test-paid';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    // Final validation across steps
    if (!validateStep(0) || !validateStep(1)) {
      setStep(0);
      return;
    }
    if (formData.paymentStatus !== 'paid') {
      setErrors({ paymentMethod: 'Please complete the test payment before submitting' });
      setStep(2);
      return;
    }

    setLoading(true);
    // Create a filing and persist to backend
    try {
      const filing = await addFiling(formData);
      setLoading(false);
      setPopup({ message: 'Patent application saved successfully!', type: 'success' });
      localStorage.removeItem('patentFilingDraft');
      setTimeout(() => navigate('/my-filings'), 700);
    } catch (e) {
      setLoading(false);
      const errorMessage = e.message || 'Failed to save filing. Please try again.';
      setPopup({ message: errorMessage, type: 'error' });

      // If unauthorized, suggest logging in
      if (errorMessage.includes('session') || errorMessage.includes('log in') || errorMessage.includes('Authentication')) {
        setTimeout(() => {
          if (window.confirm('You need to be logged in to submit a filing. Would you like to go to the login page?')) {
            navigate('/login');
          }
        }, 2000);
      }
    }
  };

  const canProceed = () => {
    if (step === 0) {
      return !!(
        formData.applicantName && formData.email && formData.nationality &&
        formData.addressStreet && formData.addressCity && formData.addressState && formData.addressPostalCode &&
        formData.phone && formData.idType && formData.idNumber
      );
    }
    if (step === 1) {
      const invs = Array.isArray(formData.inventors) ? formData.inventors : (formData.inventors ? [formData.inventors] : []);
      const hasInventor = invs.filter(i => i && i.name && i.name.trim()).length > 0;
      return !!(
        formData.title && hasInventor && formData.technicalField && formData.abstract && formData.abstract.trim().length >= 10
      );
    }
    if (step === 2) {
      // allow proceeding if payment was done, or a payment method is selected (mock flows)
      return formData.paymentStatus === 'paid' || !!formData.paymentMethod;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A1A4A] via-[#301B55] to-[#4B1F70] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">File a New Patent</h1>
            <p className="text-sm text-white/70">A guided multi-step filing wizard to prepare your application.</p>
          </div>
          <div className="text-sm text-white/60">Estimated time: <span className="font-semibold">~10 min</span></div>
        </div>

        {/* Stepper */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-4">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${i <= step ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-black' : 'bg-white/10'}`}>
                  {i + 1}
                </div>
                <div className={`text-sm ${i <= step ? 'text-white' : 'text-white/60'}`}>{label}</div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? 'bg-cyan-400' : 'bg-white/10'} mx-3`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="transition-all duration-300">
            {step === 0 && (
              <div className="animate-fade">
                <StepApplicantDetails formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
              </div>
            )}
            {step === 1 && (
              <div className="animate-fade">
                <StepPatentDetails formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
              </div>
            )}
            {step === 2 && (
              <div className="animate-fade">
                <StepFeesPayment formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
              </div>
            )}
            {step === 3 && (
              <div className="animate-fade">
                <StepReviewSubmit formData={formData} setStep={setStep} />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              {step > 0 && (
                <button onClick={handleBack} className="px-4 py-2 text-white/80 hover:text-white">Back</button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { localStorage.removeItem('patentFilingDraft'); setFormData(initialForm); setStep(0); }} className="px-3 py-2 text-sm text-white/80 hover:text-white">Clear Draft</button>
              {step < STEPS.length - 1 ? (
                <button onClick={handleNext} disabled={!canProceed()} className={`px-4 py-2 rounded-lg font-semibold transition ${canProceed() ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-white/10 opacity-60 cursor-not-allowed'}`}>
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className={`px-4 py-2 rounded-lg font-semibold transition ${loading ? 'bg-white/10 opacity-70' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ message: '', type: '' })} />
    </div>
  );
};

export default PatentFilingWizard;
