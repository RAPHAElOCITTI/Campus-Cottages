import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateSubmit } from "./SubmitButtons";
import { ArrowUp, FacebookIcon, InstagramIcon, LinkedinIcon, Locate, Mail, Phone, TwitterIcon } from "lucide-react";

interface CreateBottomBarProps {
    disableSubmit?: boolean;
    disableMessage?: string;
}

export function CreateBottomBar({ disableSubmit, disableMessage }: CreateBottomBarProps) {
    return (
        <div className="fixed w-full bottom-0 z-10 bg-white border-t h-24">
        <div className="flex items-centre justify-between mx-auto px-5 lg:px-10 h-full">
            <Button size="lg" asChild>
               <Link href="/">Cancel</Link>
            </Button>
            {disableMessage && (
                <div className="text-sm text-amber-600 mr-4">{disableMessage}</div>
            )}
            <CreateSubmit disabled={disableSubmit} />
        </div>
    </div>
    )
}
export default function Footer() {

    return (
      <footer className="bg-[#1a1532] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold">Campus Cottages</h2>
            <p className="mt-2 text-sm">
              Discover a wide range of affordable and convenient hostel accommodations
              at Campus Cottages. We provide a seamless booking experience tailored
              to students and travelers seeking comfort and value.
            </p>
            <div className="flex space-x-4 mt-4">
              <FacebookIcon size={24} className="cursor-pointer" />
              <TwitterIcon size={24} className="cursor-pointer" />
              <LinkedinIcon size={24} className="cursor-pointer" />
              <InstagramIcon size={24} className="cursor-pointer" />
            </div>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="mt-2 space-y-2">
              <li>About Us</li>
              <li>Our Hostels</li>
              <li>Pricing</li>
              <li>FAQ</li>
              <li>Testimonials</li>
            </ul>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold">Useful Links</h3>
            <ul className="mt-2 space-y-2">
              <li>Contact Us</li>
              <li>Book a Room</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center">
                <Locate className="mr-2" /> 123 Campus Road, Mukono, UGANDA
              </li>
              <li className="flex items-center">
                <Phone className="mr-2" /> +256 762 038 491
              </li>
              <li className="flex items-center">
                <Mail className="mr-2" /> info@campuscottages.com
              </li>
            </ul>
          </div>
        </div>
  
        <div className="mt-10 text-center text-sm">
          <p>&copy; 2024 Campus Cottages. All Rights Reserved.</p>
        </div>
        
        <div className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full cursor-pointer">
          <ArrowUp size={24} />
        </div>
      </footer>
    );
  };
  
