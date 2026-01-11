import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-100 text-gray-400 py-16 px-4 md:px-20 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h2 className="text-white text-2xl font-bold mb-6">FOODIE<span className="text-brand-primary">S</span></h2>
          <p className="text-sm">Bringing the best fast food right to your doorstep. Fresh ingredients, fast delivery, and unbeatable taste.</p>
          <div className="flex gap-4 mt-6">
            <Facebook className="hover:text-brand-primary cursor-pointer"/>
            <Instagram className="hover:text-brand-primary cursor-pointer"/>
            <Twitter className="hover:text-brand-primary cursor-pointer"/>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-6 underline decoration-brand-primary underline-offset-8">Quick Links</h3>
          <ul className="space-y-4 text-sm">
            <li>Home</li><li>Menu</li><li>Contact Us</li><li>About Company</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 underline decoration-brand-primary underline-offset-8">Support</h3>
          <ul className="space-y-4 text-sm">
            <li>Privacy Policy</li><li>Terms & Conditions</li><li>Refund Policy</li><li>FAQs</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 underline decoration-brand-primary underline-offset-8">Newsletter</h3>
          <p className="text-sm mb-4">Subscribe to get latest deals.</p>
          <div className="flex bg-dark-200 rounded-lg p-1">
            <input type="text" placeholder="Email Address" className="bg-transparent border-none focus:ring-0 w-full p-2 text-white" />
            <button className="bg-brand-primary text-white p-2 rounded-lg"><Mail size={20}/></button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-16 pt-8 text-center text-xs">
        © 2024 FOODIES. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;