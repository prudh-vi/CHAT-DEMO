import { StickyScroll } from "../components/ui/sticky-scroll-reveal";


const content = [
    {
        title: "Direct Chat",
        description:
          "Real-time AI protection against sensitive data exposure and offensive content. Chat freely in a secure, respectful environment.",
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
        description:
          "Our browser extension brings AI safety to all your chats. From social media to work platforms, automatically guard against sensitive information and inappropriate content wherever you communicate online.",
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
      

];
export function Card() {
  return (
    <div className="p-10 bg-black text-white">
      <StickyScroll content={content} />
    </div>
  );
}
