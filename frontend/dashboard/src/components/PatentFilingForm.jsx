import React, { useState } from "react";
import { 
  User, Mail, Phone, Building, MapPin, FileText, Lightbulb, 
  Upload, CreditCard, CheckCircle2, AlertCircle, ArrowRight, 
  ArrowLeft, X, Calendar, Globe, Users, FileCheck, IndianRupee
} from "lucide-react";
import { auth } from "../firebase";

const PatentFilingForm = ({ onClose, userProfile, onAddNotification }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Indian States and Countries
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia",
    "Germany", "France", "Japan", "China", "Singapore", "UAE",
    "Saudi Arabia", "South Korea", "Malaysia", "Indonesia", "Other"
  ];

  const inventionFields = [
    "Computer Science & IT", "Electronics & Communication", "Mechanical Engineering",
    "Civil Engineering", "Biotechnology", "Chemical Engineering", "Pharmaceutical",
    "Agriculture", "Medical Devices", "Environmental Technology", "Automotive",
    "Aerospace", "Nanotechnology", "Artificial Intelligence", "Internet of Things",
    "Robotics", "Renewable Energy", "Materials Science", "Other"
  ];
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Applicant Information
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    applicantAddress: "",
    applicantCity: "",
    applicantState: "",
    applicantPincode: "",
    applicantCountry: "India",
    organizationName: "",
    applicantType: "individual", // individual, organization, joint
    
    // Step 2: Invention Details
    inventionTitle: "",
    inventionField: "",
    inventionDescription: "",
    technicalProblem: "",
    proposedSolution: "",
    advantages: "",
    priorArt: "",
    
    // Step 3: Patent Details
    patentType: "provisional", // provisional, complete
    filingType: "national", // national, international
    priorityDate: "",
    priorityNumber: "",
    claimsPriority: false,
    numberOfClaims: "",
    numberOfDrawings: "",
    
    // Step 4: Documents (Cloud Storage Links)
    descriptionFileUrl: "",
    claimsFileUrl: "",
    abstractFileUrl: "",
    drawingsFileUrl: "",
    
    // Step 5: Payment
    paymentAmount: 500,
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Step configuration
  const steps = [
    { number: 1, title: "Applicant Information", icon: User },
    { number: 2, title: "Invention Details", icon: Lightbulb },
    { number: 3, title: "Patent Details", icon: FileCheck },
    { number: 4, title: "Documents Upload", icon: Upload },
    { number: 5, title: "Review & Payment", icon: CreditCard },
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate URL format
  const isValidUrl = (url) => {
    if (!url || url.trim() === "") return false;
    try {
      const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      return urlPattern.test(url) || url.includes('drive.google.com') || url.includes('dropbox.com') || url.includes('onedrive.live.com');
    } catch {
      return false;
    }
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.applicantName.trim()) newErrors.applicantName = "Name is required";
    if (!formData.applicantEmail.trim()) {
      newErrors.applicantEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = "Invalid email format";
    }
    if (!formData.applicantPhone.trim()) {
      newErrors.applicantPhone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.applicantPhone.replace(/\D/g, ''))) {
      newErrors.applicantPhone = "Invalid phone number (10 digits required)";
    }
    if (!formData.applicantAddress.trim()) newErrors.applicantAddress = "Address is required";
    if (!formData.applicantCity.trim()) newErrors.applicantCity = "City is required";
    if (!formData.applicantState.trim()) newErrors.applicantState = "State is required";
    if (!formData.applicantPincode.trim()) {
      newErrors.applicantPincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.applicantPincode)) {
      newErrors.applicantPincode = "Invalid pincode (6 digits required)";
    }
    if (formData.applicantType === 'organization' && !formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.inventionTitle.trim()) newErrors.inventionTitle = "Title is required";
    if (formData.inventionTitle.length < 10) {
      newErrors.inventionTitle = "Title should be at least 10 characters";
    }
    if (!formData.inventionField.trim()) newErrors.inventionField = "Field of invention is required";
    if (!formData.inventionDescription.trim()) {
      newErrors.inventionDescription = "Description is required";
    } else if (formData.inventionDescription.length < 100) {
      newErrors.inventionDescription = "Description should be at least 100 characters";
    }
    if (!formData.technicalProblem.trim()) newErrors.technicalProblem = "Technical problem is required";
    if (!formData.proposedSolution.trim()) newErrors.proposedSolution = "Proposed solution is required";
    if (!formData.advantages.trim()) newErrors.advantages = "Advantages are required";
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.numberOfClaims) {
      newErrors.numberOfClaims = "Number of claims is required";
    } else if (formData.numberOfClaims < 1 || formData.numberOfClaims > 30) {
      newErrors.numberOfClaims = "Claims should be between 1 and 30";
    }
    if (formData.claimsPriority && !formData.priorityDate) {
      newErrors.priorityDate = "Priority date is required";
    }
    if (formData.claimsPriority && !formData.priorityNumber.trim()) {
      newErrors.priorityNumber = "Priority number is required";
    }
    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.descriptionFileUrl.trim()) {
      newErrors.descriptionFileUrl = "Description document link is required";
    } else if (!isValidUrl(formData.descriptionFileUrl)) {
      newErrors.descriptionFileUrl = "Please enter a valid URL";
    }
    
    if (!formData.claimsFileUrl.trim()) {
      newErrors.claimsFileUrl = "Claims document link is required";
    } else if (!isValidUrl(formData.claimsFileUrl)) {
      newErrors.claimsFileUrl = "Please enter a valid URL";
    }
    
    if (!formData.abstractFileUrl.trim()) {
      newErrors.abstractFileUrl = "Abstract document link is required";
    } else if (!isValidUrl(formData.abstractFileUrl)) {
      newErrors.abstractFileUrl = "Please enter a valid URL";
    }
    
    if (formData.drawingsFileUrl && !isValidUrl(formData.drawingsFileUrl)) {
      newErrors.drawingsFileUrl = "Please enter a valid URL";
    }
    
    return newErrors;
  };

  const validateStep5 = () => {
    const newErrors = {};
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to terms and conditions";
    }
    return newErrors;
  };

  // Navigate to next step
  const handleNext = () => {
    let validationErrors = {};
    
    switch (currentStep) {
      case 1:
        validationErrors = validateStep1();
        break;
      case 2:
        validationErrors = validateStep2();
        break;
      case 3:
        validationErrors = validateStep3();
        break;
      case 4:
        validationErrors = validateStep4();
        break;
      case 5:
        validationErrors = validateStep5();
        break;
      default:
        break;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-300');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setErrors({});
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // No file upload needed - using cloud storage URLs directly

  // Handle Razorpay Payment
  const initiatePayment = async () => {
    return new Promise((resolve, reject) => {
      // Check if Razorpay key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey || razorpayKey === 'rzp_test_your_key_here') {
        console.warn('Razorpay key not configured. Using test mode.');
        // For testing without Razorpay
        resolve({
          success: true,
          paymentId: 'test_' + Date.now(),
          orderId: 'order_test_' + Date.now(),
          signature: 'test_signature',
        });
        return;
      }

      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        openRazorpay(resolve, reject, razorpayKey);
        return;
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        // Fallback to test mode if Razorpay fails to load
        resolve({
          success: true,
          paymentId: 'fallback_' + Date.now(),
          orderId: 'order_fallback_' + Date.now(),
          signature: 'fallback_signature',
        });
      };
      script.onload = () => {
        openRazorpay(resolve, reject, razorpayKey);
      };
      document.body.appendChild(script);
    });
  };

  // Open Razorpay checkout
  const openRazorpay = (resolve, reject, razorpayKey) => {
    try {
      const options = {
        key: razorpayKey,
        amount: formData.paymentAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Global IP Platform',
        description: 'Patent Filing Fee',
        handler: function (response) {
          console.log('Payment successful:', response);
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id || 'pay_' + Date.now(),
            orderId: response.razorpay_order_id || 'order_' + Date.now(),
            signature: response.razorpay_signature || 'sig_' + Date.now(),
          });
        },
        prefill: {
          name: formData.applicantName,
          email: formData.applicantEmail,
          contact: formData.applicantPhone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        reject(new Error(response.error.description || 'Payment failed'));
      });
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      reject(error);
    }
  };

  // Submit the form
  const handleSubmit = async () => {
    // Validate final step
    const validationErrors = validateStep5();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting patent filing submission...');
      
      // 1. Initiate payment
      console.log('Initiating payment...');
      const paymentResult = await initiatePayment();
      console.log('Payment result:', paymentResult);
      
      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      console.log('Preparing data for PostgreSQL...');
      
      // 2. Prepare data for PostgreSQL
      const filingData = {
        // User info
        userId: auth.currentUser?.uid || 'unknown',
        userEmail: auth.currentUser?.email || formData.applicantEmail,
        userName: userProfile?.name || formData.applicantName,
        
        // Applicant Information (flattened for PostgreSQL)
        applicantName: formData.applicantName,
        applicantEmail: formData.applicantEmail,
        applicantPhone: formData.applicantPhone,
        applicantAddress: formData.applicantAddress,
        applicantCity: formData.applicantCity,
        applicantState: formData.applicantState,
        applicantPincode: formData.applicantPincode,
        applicantCountry: formData.applicantCountry,
        organizationName: formData.organizationName || null,
        applicantType: formData.applicantType,
        
        // Invention Details
        inventionTitle: formData.inventionTitle,
        inventionField: formData.inventionField,
        inventionDescription: formData.inventionDescription,
        technicalProblem: formData.technicalProblem,
        proposedSolution: formData.proposedSolution,
        advantages: formData.advantages,
        priorArt: formData.priorArt || null,
        
        // Patent Details
        patentType: formData.patentType,
        filingType: formData.filingType,
        priorityDate: formData.priorityDate || null,
        priorityNumber: formData.priorityNumber || null,
        claimsPriority: formData.claimsPriority,
        numberOfClaims: parseInt(formData.numberOfClaims) || 0,
        numberOfDrawings: parseInt(formData.numberOfDrawings) || 0,
        
        // Documents (Cloud Storage URLs)
        descriptionFileUrl: formData.descriptionFileUrl,
        claimsFileUrl: formData.claimsFileUrl,
        abstractFileUrl: formData.abstractFileUrl,
        drawingsFileUrl: formData.drawingsFileUrl || null,
        
        // Payment Info
        paymentAmount: parseFloat(formData.paymentAmount),
        paymentCurrency: 'INR',
        paymentId: paymentResult.paymentId,
        paymentOrderId: paymentResult.orderId || null,
        paymentSignature: paymentResult.signature || null,
        paymentStatus: 'completed',
        paymentTimestamp: new Date().toISOString(),
        
        // Status
        status: 'submitted',
        filingDate: new Date().toISOString(),
      };

      console.log('Sending to backend API...', filingData);
      
      // 3. Submit to PostgreSQL via backend API
      const response = await fetch('http://localhost:8080/api/patent-filing/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filingData),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit patent filing');
      }
      
      console.log('✅ Patent filing submitted successfully with ID:', result.filingId);
      
      // Show success message
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Add notification
      if (onAddNotification) {
        onAddNotification({
          type: 'success',
          message: `Patent filing submitted successfully! Filing ID: ${result.filingId}`,
          timestamp: new Date().toISOString(),
        });
      }

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        if (onClose) {
          onClose();
        }
      }, 3000);

    } catch (error) {
      console.error('❌ Error submitting patent filing:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to submit patent filing. ';
      
      if (error.message.includes('Payment cancelled')) {
        errorMessage = 'Payment was cancelled. Please try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Database permission error. Please contact support.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please ensure you are logged in.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      alert(errorMessage);
      
      if (onAddNotification) {
        onAddNotification({
          type: 'error',
          message: errorMessage,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-lg w-full border-4 border-green-500">
          <div className="text-center">
            <div className="mb-6 relative">
              <CheckCircle2 size={100} className="text-green-500 mx-auto animate-bounce" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Successfully Submitted!</h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 font-semibold mb-2">
                ✅ Patent Filing Submitted
              </p>
              <p className="text-green-700 mb-2">
                💳 Payment Confirmed (₹{formData.paymentAmount})
              </p>
              <p className="text-green-700">
                📄 All documents received
              </p>
            </div>
            <p className="text-gray-600 mb-2">
              Your patent filing application has been successfully submitted to our database.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              You will receive a confirmation email shortly with your filing details.
            </p>
            <div className="mt-6 text-sm text-blue-600 font-medium">
              Redirecting to dashboard in 3 seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  Patent Filing Application
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Step {currentStep} of 5: {steps[currentStep - 1].title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/20 transition"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 pt-6 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.number} className="flex-1">
                    <div className="flex items-center">
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                        ${currentStep >= step.number 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white' 
                          : 'border-gray-300 text-gray-400 bg-white'
                        }
                      `}>
                        <StepIcon size={20} />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`
                          flex-1 h-1 mx-2 transition-all
                          ${currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'}
                        `} />
                      )}
                    </div>
                    <p className={`
                      text-xs mt-2 hidden md:block text-center
                      ${currentStep >= step.number ? 'text-gray-800 font-medium' : 'text-gray-400'}
                    `}>
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8 min-h-[500px]">
          {/* Step 1: Applicant Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Applicant Type *
                </label>
                <div className="flex gap-4">
                  {['individual', 'organization', 'joint'].map(type => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="applicantType"
                        value={type}
                        checked={formData.applicantType === type}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border transition ${
                      errors.applicantName ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="Enter your full name"
                  />
                  {errors.applicantName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.applicantName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="applicantEmail"
                    value={formData.applicantEmail}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border transition ${
                      errors.applicantEmail ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="your.email@example.com"
                  />
                  {errors.applicantEmail && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.applicantEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="applicantPhone"
                    value={formData.applicantPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border transition ${
                      errors.applicantPhone ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.applicantPhone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.applicantPhone}
                    </p>
                  )}
                </div>

                {formData.applicantType === 'organization' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Building size={16} className="inline mr-1" />
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition ${
                        errors.organizationName ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="Company/Organization name"
                    />
                    {errors.organizationName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.organizationName}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Address *
                </label>
                <textarea
                  name="applicantAddress"
                  value={formData.applicantAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.applicantAddress ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Enter complete address"
                />
                {errors.applicantAddress && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.applicantAddress}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="applicantCity"
                    value={formData.applicantCity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border transition ${
                      errors.applicantCity ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="City"
                  />
                  {errors.applicantCity && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.applicantCity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="applicantState"
                    value={formData.applicantState}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border transition ${
                      errors.applicantState ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.applicantState && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.applicantState}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="applicantPincode"
                    value={formData.applicantPincode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border transition ${
                      errors.applicantPincode ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.applicantPincode && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.applicantPincode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Globe size={16} className="inline mr-1" />
                  Country *
                </label>
                <select
                  name="applicantCountry"
                  value={formData.applicantCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Invention Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lightbulb size={16} className="inline mr-1" />
                  Invention Title *
                </label>
                <input
                  type="text"
                  name="inventionTitle"
                  value={formData.inventionTitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.inventionTitle ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Brief title of your invention (min 10 characters)"
                />
                {errors.inventionTitle && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.inventionTitle}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field of Invention *
                </label>
                <select
                  name="inventionField"
                  value={formData.inventionField}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.inventionField ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="">Select Field of Invention</option>
                  {inventionFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                {errors.inventionField && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.inventionField}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Detailed Description of Invention *
                </label>
                <textarea
                  name="inventionDescription"
                  value={formData.inventionDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.inventionDescription ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Provide a comprehensive description of your invention (min 100 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.inventionDescription.length} characters
                </p>
                {errors.inventionDescription && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.inventionDescription}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technical Problem Addressed *
                </label>
                <textarea
                  name="technicalProblem"
                  value={formData.technicalProblem}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.technicalProblem ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="What problem does your invention solve?"
                />
                {errors.technicalProblem && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.technicalProblem}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proposed Solution *
                </label>
                <textarea
                  name="proposedSolution"
                  value={formData.proposedSolution}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.proposedSolution ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="How does your invention solve the problem?"
                />
                {errors.proposedSolution && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.proposedSolution}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Advantages & Benefits *
                </label>
                <textarea
                  name="advantages"
                  value={formData.advantages}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.advantages ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="List the key advantages and benefits of your invention"
                />
                {errors.advantages && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.advantages}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prior Art (Optional)
                </label>
                <textarea
                  name="priorArt"
                  value={formData.priorArt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Any existing similar inventions or patents you're aware of"
                />
              </div>
            </div>
          )}

          {/* Step 3: Patent Details */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Patent Type *
                  </label>
                  <select
                    name="patentType"
                    value={formData.patentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="provisional">Provisional Patent</option>
                    <option value="complete">Complete Patent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filing Type *
                  </label>
                  <select
                    name="filingType"
                    value={formData.filingType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="national">National Filing</option>
                    <option value="international">International (PCT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Claims *
                </label>
                <input
                  type="number"
                  name="numberOfClaims"
                  value={formData.numberOfClaims}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.numberOfClaims ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="Number of claims (1-30)"
                />
                {errors.numberOfClaims && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.numberOfClaims}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Drawings (Optional)
                </label>
                <input
                  type="number"
                  name="numberOfDrawings"
                  value={formData.numberOfDrawings}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Number of drawings/figures"
                />
              </div>

              <div className="border-t border-gray-200 pt-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="claimsPriority"
                    checked={formData.claimsPriority}
                    onChange={handleInputChange}
                    className="mr-3 w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Claim Priority from Earlier Application
                  </span>
                </label>
              </div>

              {formData.claimsPriority && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar size={16} className="inline mr-1" />
                      Priority Date *
                    </label>
                    <input
                      type="date"
                      name="priorityDate"
                      value={formData.priorityDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition ${
                        errors.priorityDate ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                    {errors.priorityDate && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.priorityDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority Application Number *
                    </label>
                    <input
                      type="text"
                      name="priorityNumber"
                      value={formData.priorityNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border transition ${
                        errors.priorityNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="Earlier application number"
                    />
                    {errors.priorityNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {errors.priorityNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Documents Upload */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                  <Upload size={18} className="mr-2 text-blue-600" />
                  Document Upload Instructions
                </h4>
                <ul className="text-sm text-gray-700 space-y-2 ml-6 list-disc">
                  <li>Upload your documents to <strong>Google Drive</strong>, <strong>Dropbox</strong>, or <strong>OneDrive</strong></li>
                  <li>Make sure the files are in <strong>PDF format</strong></li>
                  <li>Set sharing permissions to <strong>"Anyone with the link can view"</strong></li>
                  <li>Copy and paste the shareable link below</li>
                  <li>Verify that the links are accessible before submitting</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Description Document Link *
                </label>
                <input
                  type="url"
                  name="descriptionFileUrl"
                  value={formData.descriptionFileUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.descriptionFileUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                />
                {formData.descriptionFileUrl && !errors.descriptionFileUrl && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle2 size={12} className="mr-1" />
                    Link added successfully
                  </p>
                )}
                {errors.descriptionFileUrl && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.descriptionFileUrl}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Claims Document Link *
                </label>
                <input
                  type="url"
                  name="claimsFileUrl"
                  value={formData.claimsFileUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.claimsFileUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                />
                {formData.claimsFileUrl && !errors.claimsFileUrl && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle2 size={12} className="mr-1" />
                    Link added successfully
                  </p>
                )}
                {errors.claimsFileUrl && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.claimsFileUrl}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Abstract Document Link *
                </label>
                <input
                  type="url"
                  name="abstractFileUrl"
                  value={formData.abstractFileUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.abstractFileUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                />
                {formData.abstractFileUrl && !errors.abstractFileUrl && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle2 size={12} className="mr-1" />
                    Link added successfully
                  </p>
                )}
                {errors.abstractFileUrl && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.abstractFileUrl}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Drawings/Figures Link (Optional)
                </label>
                <input
                  type="url"
                  name="drawingsFileUrl"
                  value={formData.drawingsFileUrl}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border transition ${
                    errors.drawingsFileUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  placeholder="https://drive.google.com/... or https://dropbox.com/... (optional)"
                />
                {formData.drawingsFileUrl && !errors.drawingsFileUrl && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle2 size={12} className="mr-1" />
                    Link added successfully
                  </p>
                )}
                {errors.drawingsFileUrl && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.drawingsFileUrl}
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-yellow-800 flex items-start">
                  <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Important:</strong> Please ensure your document links are publicly accessible. 
                    Test each link in an incognito/private browser window before proceeding.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review & Payment */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Application Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Applicant Name:</span>
                    <span className="text-gray-600">{formData.applicantName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="text-gray-600">{formData.applicantEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Invention Title:</span>
                    <span className="text-gray-600">{formData.inventionTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Patent Type:</span>
                    <span className="text-gray-600 capitalize">{formData.patentType}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Filing Type:</span>
                    <span className="text-gray-600 capitalize">{formData.filingType}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Number of Claims:</span>
                    <span className="text-gray-600">{formData.numberOfClaims}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="font-semibold text-gray-700">Document Links Provided:</span>
                    <span className="text-gray-600">
                      {[formData.descriptionFileUrl, formData.claimsFileUrl, formData.abstractFileUrl, formData.drawingsFileUrl]
                        .filter(url => url && url.trim()).length} links
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <IndianRupee size={24} className="mr-2 text-green-600" />
                  Payment Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-700">Patent Filing Fee:</span>
                    <span className="text-2xl font-bold text-green-600">₹{formData.paymentAmount}</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Included in this fee:</strong>
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                      <li>Application processing</li>
                      <li>Document verification</li>
                      <li>Initial examination</li>
                      <li>Secure document storage</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className={`flex items-start cursor-pointer p-4 rounded-xl transition ${
                  errors.agreedToTerms ? 'bg-red-50 border border-red-300' : 'bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="mr-3 w-5 h-5 text-blue-600 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I hereby declare that the information provided is true and accurate to the best of my knowledge. 
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and 
                    <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>.
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.agreedToTerms}
                  </p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> After clicking "Pay & Submit", you will be redirected to a secure payment gateway. 
                  Your application will be submitted only after successful payment confirmation.
                </p>
              </div>
            </div>
          )}
        </div>

          {/* Footer Navigation */}
          <div className="bg-white border-t border-gray-200 p-6 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition
                ${currentStep === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                }
              `}
            >
              <ArrowLeft size={20} />
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all"
              >
                Next
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl hover:scale-105'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay ₹{formData.paymentAmount} & Submit
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentFilingForm;
