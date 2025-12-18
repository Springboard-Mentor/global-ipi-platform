import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    type: 'general',
    rating: 5,
    subject: '',
    message: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'feedbacks'), {
        email: feedback.email,
        message: feedback.message,
        rating: feedback.rating,
        subject: feedback.subject,
        createdAt: Timestamp.now()
      });
      
      alert('Thank you for your feedback! We appreciate your input.');
      setFeedback({
        type: 'general',
        rating: 5,
        subject: '',
        message: '',
        email: ''
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Sorry, there was an error submitting your feedback. Please try again.');
    }
  };

  const handleChange = (field, value) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white hover:text-blue-300 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">Send Feedback</h1>
          <div></div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">We Value Your Feedback</h2>
            <p className="text-gray-300">Help us improve Global IP Intelligence Platform by sharing your thoughts and suggestions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="text-white text-sm mb-2 block">Feedback Type</label>
              <select
                value={feedback.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="text-white text-sm mb-2 block">Overall Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange('rating', star)}
                    className={`text-2xl transition-colors ${
                      star <= feedback.rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-gray-300 ml-2">({feedback.rating}/5)</span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-white text-sm mb-2 block">Subject</label>
              <input
                type="text"
                value={feedback.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                placeholder="Brief description of your feedback"
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-white text-sm mb-2 block">Message</label>
              <textarea
                value={feedback.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Please provide detailed feedback..."
                rows={6}
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-white text-sm mb-2 block">Email (Optional)</label>
              <input
                type="email"
                value={feedback.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <p className="text-gray-400 text-xs mt-1">We'll only use this to follow up on your feedback if needed.</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Send Feedback
              </button>
            </div>
          </form>

          {/* Quick Feedback Options */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/20 transition-colors">
                <div className="text-2xl mb-2">🐛</div>
                <div className="text-white font-medium">Report Bug</div>
                <div className="text-gray-400 text-sm">Found an issue?</div>
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/20 transition-colors">
                <div className="text-2xl mb-2">💡</div>
                <div className="text-white font-medium">Suggest Feature</div>
                <div className="text-gray-400 text-sm">Have an idea?</div>
              </button>
              <button className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/20 transition-colors">
                <div className="text-2xl mb-2">❤️</div>
                <div className="text-white font-medium">General Praise</div>
                <div className="text-gray-400 text-sm">Love something?</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;