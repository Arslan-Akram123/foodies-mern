import { MapPin, Phone, Mail, Clock, ExternalLink, Utensils } from 'lucide-react';

const About = () => {
  // Your specific location details
  const phoneNumber = "+923104761362";
  const mapLink = "https://maps.app.goo.gl/XomJDn6f71Ud5yg3A";
  
  // Embed URL generated from your location
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3403.270557913621!2d74.24500880598545!3d31.461742758530885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901d518d5d143%3A0xb5da2a6c29f2e077!2sDigital%20Logics!5e0!3m2!1sen!2sus!4v1767284442791!5m2!1sen!2sus";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-24 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="text-center space-y-6 mb-4 animate-in fade-in slide-in-from-top-10 duration-700">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-primary px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] mb-2">
          <Utensils size={14}/> Our Story
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
          About <span className="text-brand-primary">Foodies</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
          We are on a mission to bring high-quality, chef-made fast food to your doorstep. 
          Fresh ingredients, bold Pakistani flavors, and lightning-fast delivery.
        </p>
      </section>

      {/* --- MAP & CONTACT SECTION --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        
        {/* Interactive Map Container */}
        <div className="rounded-lg overflow-hidden shadow-md h-full relative border-8 border-white group">
           <iframe 
             title="Foodies Location"
             src={mapEmbedUrl} 
             className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000"
             allowFullScreen="" 
             loading="lazy"
             referrerPolicy="no-referrer-when-downgrade"
           ></iframe>
           
           {/* Floating "Open in Maps" Button */}
           <a 
             href={mapLink} 
             target="_blank" 
             rel="noreferrer"
             className="absolute bottom-6 right-6 bg-dark-100 text-white px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-brand-primary transition-all active:scale-95"
           >
             <ExternalLink size={16}/> Open in Google Maps
           </a>
        </div>

        {/* Contact Details List */}
        <div className="space-y-12">
           <div className="space-y-2">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-dark-100">
                Visit Our <span className="text-brand-primary">Kitchen</span>
              </h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Experience the taste live</p>
           </div>

           <div className="space-y-10">
              {/* Address */}
              <div className="flex gap-6 group">
                <div className="w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  <MapPin size={28}/>
                </div>
                <div>
                  <p className="font-black text-dark-100 uppercase text-xs tracking-widest mb-1">Our Location</p>
                  <p className="text-gray-500 font-medium text-lg leading-snug">
                    Ali Town, Lahore, <br/>Punjab, Pakistan.
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex gap-6 group">
                <div className="w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  <Clock size={28}/>
                </div>
                <div>
                  <p className="font-black text-dark-100 uppercase text-xs tracking-widest mb-1">Working Hours</p>
                  <p className="text-gray-500 font-medium text-lg">
                    Mon - Sun: <span className="text-brand-primary font-black">10:00 AM - 02:00 AM</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Open 7 days a week</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-6 group">
                <div className="w-16 h-16 bg-orange-50 rounded-lg flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                  <Phone size={28}/>
                </div>
                <div>
                  <p className="font-black text-dark-100 uppercase text-xs tracking-widest mb-1">Order by Phone</p>
                  <a href={`tel:${phoneNumber}`} className="text-gray-500 font-black text-2xl hover:text-brand-primary transition-colors">
                    {phoneNumber}
                  </a>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Call us for home delivery</p>
                </div>
              </div>
           </div>

           {/* Newsletter / Contact CTA */}
           <div className="bg-dark-100 p-8 rounded-lg text-white flex items-center justify-between shadow-2xl shadow-orange-900/20">
              <div>
                <h4 className="font-black uppercase tracking-tighter italic">Got a Question?</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email our support team</p>
              </div>
              <a href="mailto:support@foodies.com" className="p-4 bg-brand-primary rounded-lg hover:scale-110 transition-transform shadow-lg shadow-orange-900/20">
                <Mail size={20}/>
              </a>
           </div>
        </div>
      </section>
    </div>
  );
};

export default About;