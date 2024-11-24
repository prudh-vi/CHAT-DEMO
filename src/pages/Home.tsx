import { FloatingNav } from "../components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser, IconShield } from "@tabler/icons-react";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { Review } from "./Review";
import { Card } from "./Card";
import { Link } from "react-router-dom";

export function Home() {
  const words = [
    {
      text: "Your",
    },
    {
      text: "secure",
    },
    {
      text: "chat",
    },
    {
      text: "companion",
       className: "text-blue-500 dark:text-blue-500"
    },
    
  ];
  
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Chat Now",
      link: "/chat",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];

  return (
    <div>
      <div className="relative w-full">
        <FloatingNav navItems={navItems} />
      </div>
      <div>
        <div className="bg-black flex flex-col items-center justify-center min-h-[40rem]">
          {/* Logo and Title Section */}
          <div className="flex items-center justify-center mb-8">
            <IconShield 
              className="h-12 w-12 text-blue-500 mr-2"
              stroke={2.5}
            />
            <h1 className="text-5xl font-bold text-white tracking-tight">
              SAFSOC
            </h1>
          </div>
          
          <TypewriterEffectSmooth words={words} />
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-8">
            <Link to='/login'>
              <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                Login
              </button>
            </Link>
            <Link to='/chat'>
              <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
                Chat Now
              </button>
            </Link>
          </div>
        </div>
        <Card/>
        <h1 className="text-center bg-black text-white text-3xl">Testimonials</h1>
        <Review/>
      </div>
    </div>
  );
}