import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, CircleDollarSign, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { getShippingConfig, updateShippingConfig } from '../../features/shippingSlice';

const ManageShipping = () => {
  const dispatch = useDispatch();
  
  // Get existing config and loading state from Redux
  const { config, isLoading } = useSelector((state) => state.shipping);

  // Local state for the form
  const [shippingType, setShippingType] = useState('standard'); 
  const [standardPrice, setStandardPrice] = useState(250);
  const [customPrice, setCustomPrice] = useState(0);
  const [thresholdEnabled, setThresholdEnabled] = useState(true);
  const [thresholdAmount, setThresholdAmount] = useState(2000);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Initial Fetch from DB
  useEffect(() => {
    dispatch(getShippingConfig());
  }, [dispatch]);

  // 2. Sync local form with Redux data once fetched
  useEffect(() => {
    if (config) {
      setShippingType(config.type || 'standard');
      setStandardPrice(config.standardPrice || 250);
      setCustomPrice(config.customPrice || 0);
      setThresholdEnabled(config.thresholdEnabled !== undefined ? config.thresholdEnabled : true);
      setThresholdAmount(config.thresholdAmount || 2000);
    }
  }, [config]);

  // 3. Handle Save to DB
  const handleSaveConfiguration = async () => {
    const updatedData = {
      type: shippingType,
      standardPrice: Number(standardPrice),
      customPrice: Number(customPrice),
      thresholdEnabled,
      thresholdAmount: Number(thresholdAmount)
    };

    const result = await dispatch(updateShippingConfig(updatedData));
    
    if (!result.error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s
    } else {
      alert("Failed to save configuration: " + result.payload);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-dark-100 italic">
            Delivery <span className="text-brand-primary">Settings</span>
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">
            Configure shipping rates and free delivery rules
          </p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase tracking-widest animate-bounce">
            <CheckCircle2 size={16}/> Settings Updated
          </div>
        )}
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[0.5rem] shadow-sm border border-gray-100 space-y-12 relative overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && !config && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-primary" size={40}/>
          </div>
        )}

        {/* --- Section 1: Delivery Mode --- */}
        <section className="space-y-8">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] text-gray-400 flex items-center gap-3">
            <Truck className="text-brand-primary" size={18}/> 01. Delivery Charge Mode
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'free', label: 'Always Free', price: 0 },
              { id: 'standard', label: 'Standard', price: standardPrice },
              { id: 'custom', label: 'Custom Rate', price: customPrice },
            ].map((type) => (
              <label 
                key={type.id} 
                className={`p-8 rounded-[0.5rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-3 relative group ${
                  shippingType === type.id 
                  ? 'border-brand-primary bg-orange-50 shadow-lg shadow-orange-100' 
                  : 'border-gray-50 bg-gray-50/30 hover:border-gray-200'
                }`}
              >
                <input 
                  type="radio" 
                  name="shipping" 
                  checked={shippingType === type.id} 
                  onChange={() => setShippingType(type.id)}
                  className="hidden"
                />
                <span className={`font-black uppercase text-[10px] tracking-[0.2em] ${shippingType === type.id ? 'text-brand-primary' : 'text-gray-400'}`}>
                  {type.label}
                </span>
                <span className={`text-3xl font-black tracking-tighter ${shippingType === type.id ? 'text-dark-100' : 'text-gray-300'}`}>
                  Rs {type.price}
                </span>
                {shippingType === type.id && (
                  <div className="absolute -top-2 -right-2 bg-brand-primary text-white p-1 rounded-full shadow-md">
                    <CheckCircle2 size={16} strokeWidth={3}/>
                  </div>
                )}
              </label>
            ))}
          </div>
          
          {/* Specific Inputs based on selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {shippingType === 'standard' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Standard Rate Amount</label>
                <input 
                  type="number" 
                  value={standardPrice} 
                  onChange={(e) => setStandardPrice(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold" 
                />
              </div>
            )}
            {shippingType === 'custom' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Custom Rate Amount</label>
                <input 
                  type="number" 
                  value={customPrice} 
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-md border-none focus:ring-2 focus:ring-brand-primary outline-none font-bold" 
                />
              </div>
            )}
          </div>
        </section>

        {/* --- Section 2: Free Threshold --- */}
        <section className="p-8 md:p-10 bg-gray-50 rounded-[0.5rem] border border-gray-100 space-y-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white rounded-md shadow-sm text-brand-primary">
                <CircleDollarSign size={24}/>
              </div>
              <div>
                <h3 className="font-black text-lg text-dark-100 uppercase tracking-tight italic">Free Delivery Threshold</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm">
                  Switch this on to provide free delivery automatically when a customer's order reaches a specific total.
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={thresholdEnabled} 
                onChange={() => setThresholdEnabled(!thresholdEnabled)}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
          </div>

          {thresholdEnabled && (
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-5 rounded-md border border-gray-100 animate-in zoom-in-95 duration-300">
               <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest px-2">Free if total exceeds:</span>
               <div className="flex-1 flex items-center bg-gray-50 rounded-md px-5 w-full">
                  <span className="font-black text-brand-primary text-xl">Rs</span>
                  <input 
                    type="number" 
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(e.target.value)}
                    className="w-full p-4 bg-transparent border-none outline-none font-black text-xl text-dark-100" 
                  />
               </div>
            </div>
          )}
        </section>

        {/* --- Action Button --- */}
        <button 
          onClick={handleSaveConfiguration}
          disabled={isLoading}
          className="w-full bg-dark-100 text-white py-6 rounded-[0.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-primary transition-all shadow-2xl shadow-orange-900/10 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24}/>
          ) : (
            <>
              <Save size={24}/> 
              <span>SAVE SHIPPING CONFIGURATION</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ManageShipping;