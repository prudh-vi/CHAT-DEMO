import { useNavigate, NavigateFunction } from 'react-router-dom';
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";

type ContentItem = {
  title: string;
  description: string;
  content?: React.ReactNode;
  buttonText?: string;
  buttonAction: (navigate: NavigateFunction) => void;
}

const content = [
    {
        title: "Direct Chat",
        description: "Real-time AI protection against sensitive data exposure and offensive content. Chat freely in a secure, respectful environment.",
        buttonText: "Try Chat",
        buttonAction: (navigate: NavigateFunction) => navigate('/chat'),
        content: (
          <div className="h-full w-full flex items-center justify-center text-white">
            <img
              src="https://www.shutterstock.com/image-vector/dashboard-design-chat-social-media-600nw-1982343539.jpg"
              width={300}
              height={300}
              className="h-full w-full object-cover"
              alt="direct chat demo"
            />
          </div>
        ),
    },
    {
        title: "Extension Integration",
        description: "Our browser extension brings AI safety to all your chats and it works across all websites.",
        buttonText: "Install Extension",
        buttonAction: () => window.open('https://github.com/prudh-vi/Safsoc/tree/main/extension', '_blank'),
        content: (
          <div className="h-full w-full flex items-center justify-center text-white">
            <img
              src="https://cdn.prod.website-files.com/5b7f24cc900973de13d7beb4/6490eb7ac1eb2dea697d7668_Chrome%20extensions%20for%20gmail.svg"
              width={300}
              height={300}
              className="h-full w-full object-cover"
              alt="extension demo"
            />
          </div>
        ),
    }
] as ContentItem[];

export function Card() {
  const navigate = useNavigate();
  
  return (
    <div className="p-10 bg-black text-white">
      <StickyScroll 
        content={content.map(item => ({
          ...item,
          buttonAction: () => item.buttonAction(navigate)
        }))} 
      />
    </div>
  );
}