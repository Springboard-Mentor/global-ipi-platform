import React from 'react';

const StepApplicantDetails = ({ formData, setFormData, errors }) => {
  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: v }));
  };

  const handleCorrespondenceToggle = (e) => {
    const checked = e.target.checked;
    setFormData(prev => {
      const next = { ...prev, correspondenceSame: checked };
      if (checked) {
        next.correspondenceStreet = prev.addressStreet;
        next.correspondenceCity = prev.addressCity;
        next.correspondenceState = prev.addressState;
        next.correspondencePostalCode = prev.addressPostalCode;
      }
      return next;
    });
  };

  const handleAddressField = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Applicant Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80">Applicant Name</label>
          <input name="applicantName" value={formData.applicantName} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" aria-label="Applicant Name" />
          {errors?.applicantName && <p className="text-xs text-red-400 mt-1">{errors.applicantName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Applicant Email</label>
          <input name="email" type="email" value={formData.email} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Phone</label>
          <input name="phone" type="tel" value={formData.phone || ''} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Applicant Type</label>
          <select name="applicantType" value={formData.applicantType} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white">
            <option className="bg-slate-800 text-white">Individual</option>
            <option className="bg-slate-800 text-white">Startup</option>
            <option className="bg-slate-800 text-white">Company</option>
            <option className="bg-slate-800 text-white">University</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Nationality</label>
          <input name="nationality" value={formData.nationality} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.nationality && <p className="text-xs text-red-400 mt-1">{errors.nationality}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Address (Street)</label>
          <input name="addressStreet" value={formData.addressStreet} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.addressStreet && <p className="text-xs text-red-400 mt-1">{errors.addressStreet}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">City</label>
          <input name="addressCity" value={formData.addressCity} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.addressCity && <p className="text-xs text-red-400 mt-1">{errors.addressCity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">State</label>
          <input name="addressState" value={formData.addressState} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.addressState && <p className="text-xs text-red-400 mt-1">{errors.addressState}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Postal Code</label>
          <input name="addressPostalCode" value={formData.addressPostalCode} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.addressPostalCode && <p className="text-xs text-red-400 mt-1">{errors.addressPostalCode}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">ID Type</label>
          <select name="idType" value={formData.idType} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white">
            <option value="" className="bg-slate-800 text-white">Select ID</option>
            <option className="bg-slate-800 text-white">Aadhaar</option>
            <option className="bg-slate-800 text-white">Passport</option>
            <option className="bg-slate-800 text-white">Company Registration</option>
          </select>
          {errors?.idType && <p className="text-xs text-red-400 mt-1">{errors.idType}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">ID Number</label>
          <input name="idNumber" value={formData.idNumber} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.idNumber && <p className="text-xs text-red-400 mt-1">{errors.idNumber}</p>}
        </div>

        <div className="md:col-span-2 flex items-center gap-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" name="correspondenceSame" checked={!!formData.correspondenceSame} onChange={handleCorrespondenceToggle} />
            Correspondence address same as applicant address
          </label>
        </div>

        {!formData.correspondenceSame && (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/80">Correspondence Street</label>
              <input name="correspondenceStreet" value={formData.correspondenceStreet} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Correspondence City</label>
              <input name="correspondenceCity" value={formData.correspondenceCity} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Correspondence State</label>
              <input name="correspondenceState" value={formData.correspondenceState} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Correspondence Postal Code</label>
              <input name="correspondencePostalCode" value={formData.correspondencePostalCode} onChange={handleAddressField} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            </div>
          </>
        )}

        <div className="md:col-span-2 flex items-center justify-between mt-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input type="checkbox" name="isInventor" checked={!!formData.isInventor} onChange={handle} />
              Are you the inventor?
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Filing Role</label>
            <select name="filingRole" value={formData.filingRole} onChange={handle} className="mt-1 w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white">
              <option className="bg-slate-800 text-white">Inventor</option>
              <option className="bg-slate-800 text-white">Assignee</option>
              <option className="bg-slate-800 text-white">Agent</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepApplicantDetails;
