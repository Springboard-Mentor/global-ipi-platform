import React from 'react';

const technicalFields = ['AI', 'Mechanical', 'Electronics', 'BioTech', 'Chemistry', 'Software', 'Other'];

const StepPatentDetails = ({ formData, setFormData, errors }) => {
  const handle = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      if (name === 'drawingsFiles') {
        // multiple files
        const list = Array.from(files || []);
        // validate size (max 10MB) and types
        const valid = list.filter(f => f.size <= 10 * 1024 * 1024);
        setFormData(prev => ({ ...prev, drawingsFiles: valid }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const safeInventors = () => {
    const inv = formData.inventors;
    if (Array.isArray(inv)) return inv;
    if (!inv) return [{ name: '' }];
    if (typeof inv === 'string') return inv.split(',').map(s => ({ name: s.trim() })).filter(i => i.name);
    if (typeof inv === 'object') return [{ name: inv.name || '' }];
    return [{ name: '' }];
  };

  const updateInventor = (idx, value) => {
    const current = safeInventors();
    const next = [...current];
    next[idx] = { name: value };
    setFormData(prev => ({ ...prev, inventors: next }));
  };

  const addInventor = () => setFormData(prev => ({ ...prev, inventors: [...(Array.isArray(prev.inventors) ? prev.inventors : safeInventors()), { name: '' }] }));
  const removeInventor = (idx) => setFormData(prev => ({ ...prev, inventors: (Array.isArray(prev.inventors) ? prev.inventors : safeInventors()).filter((_, i) => i !== idx) }));

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Patent Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80">Patent Type</label>
          <select name="patentType" value={formData.patentType} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white">
            <option value="Utility" className="bg-slate-800 text-white">Utility</option>
            <option value="Design" className="bg-slate-800 text-white">Design</option>
            <option value="Provisional" className="bg-slate-800 text-white">Provisional</option>
            <option value="Plant" className="bg-slate-800 text-white">Plant</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Jurisdiction</label>
          <select name="jurisdiction" value={formData.jurisdiction} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white">
            <option className="bg-slate-800 text-white">India</option>
            <option className="bg-slate-800 text-white">US</option>
            <option className="bg-slate-800 text-white">WIPO</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80">Technical Field</label>
          <select name="technicalField" value={formData.technicalField} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white">
            <option value="" className="bg-slate-800 text-white">Select field</option>
            {technicalFields.map(f => <option key={f} value={f} className="bg-slate-800 text-white">{f}</option>)}
          </select>
          {errors?.technicalField && <p className="text-xs text-red-400 mt-1">{errors.technicalField}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Invention Title</label>
          <input name="title" value={formData.title} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          {errors?.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Abstract</label>
          <textarea name="abstract" rows={3} value={formData.abstract} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white resize-none" />
          <div className="flex items-center justify-between mt-1">
            {errors?.abstract ? (
              <p className="text-xs text-red-400">{errors.abstract}</p>
            ) : (
              <p className="text-xs text-white/60">Provide a brief abstract describing the invention.</p>
            )}
            <p className={`text-xs ${((formData.abstract || '').trim().length < 10) ? 'text-yellow-300' : 'text-green-300'}`}>
              {(formData.abstract || '').trim().length}/10
            </p>
          </div>
          {(formData.abstract || '').trim().length < 10 && (
            <p className="text-xs text-yellow-300 mt-1">Abstract must be at least 10 characters to proceed.</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Problem Statement</label>
          <textarea name="problemStatement" rows={3} value={formData.problemStatement} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white resize-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Novelty / Key Innovation</label>
          <textarea name="novelty" rows={2} value={formData.novelty} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white resize-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Inventors</label>
          <div className="space-y-2">
            {safeInventors().map((inv, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={inv.name} onChange={(e) => updateInventor(idx, e.target.value)} placeholder={`Inventor ${idx + 1}`} className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                <button type="button" onClick={() => removeInventor(idx)} className="px-3 py-2 bg-red-600/30 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addInventor} className="mt-2 px-3 py-2 bg-cyan-600 rounded">Add Inventor</button>
            {errors?.inventors && <p className="text-xs text-red-400 mt-1">{errors.inventors}</p>}
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80">Priority Claim</label>
            <select name="priorityClaim" value={formData.priorityClaim ? 'yes' : 'no'} onChange={(e) => setFormData(prev => ({ ...prev, priorityClaim: e.target.value === 'yes' }))} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white">
              <option value="no" className="bg-slate-800 text-white">No</option>
              <option value="yes" className="bg-slate-800 text-white">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Priority Application Number</label>
            <input name="priorityApplicationNumber" value={formData.priorityApplicationNumber} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80">Priority Date</label>
            <input name="priorityDate" type="date" value={formData.priorityDate} onChange={handle} className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white" />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Specification Document (PDF)</label>
          <input name="specificationFile" type="file" accept=".pdf" onChange={handle} className="mt-2 w-full text-sm text-white/70" />
          {formData.specificationFile && <div className="text-sm text-white/70 mt-2">{formData.specificationFile.name} ({formData.specificationFile.size ? Math.round(formData.specificationFile.size / 1024) : 'unknown'} KB)</div>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Claims Document (PDF)</label>
          <input name="claimsFile" type="file" accept=".pdf" onChange={handle} className="mt-2 w-full text-sm text-white/70" />
          {formData.claimsFile && <div className="text-sm text-white/70 mt-2">{formData.claimsFile.name} ({formData.claimsFile.size ? Math.round(formData.claimsFile.size / 1024) : 'unknown'} KB)</div>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80">Drawings (PDF / PNG) — multiple allowed</label>
          <input name="drawingsFiles" type="file" accept=".pdf,image/*" onChange={handle} className="mt-2 w-full text-sm text-white/70" multiple />
          <div className="mt-2 space-y-1">
            {(formData.drawingsFiles || []).map((f, i) => (
              <div key={i} className="text-sm text-white/70">{f.name} — {f.size ? Math.round(f.size / 1024) : 'unknown'} KB</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPatentDetails;
