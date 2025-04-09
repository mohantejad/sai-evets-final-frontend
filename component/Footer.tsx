import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
  } from "react-icons/fa";
  
  const Footer = () => {
    return (
      <footer className="bg-[#81a7e3] text-black py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold uppercase">About</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
            </ul>
          </div>
  
          {/* Help Section */}
          <div>
            <h3 className="text-lg font-bold uppercase">Help</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
  
          {/* Social & Legal Section */}
          <div>
            <h3 className="text-lg font-bold uppercase">Connect</h3>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:scale-110 transition-transform">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <FaLinkedinIn size={20} />
              </a>
            </div>
            <p className="mt-4 text-sm">
              &copy; {new Date().getFullYear()} Sai Events. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  