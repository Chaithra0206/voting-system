interface FooterProps {
  className?: string;
  variant?: "default" | "transparent";
}

export default function Footer({
  className = "",
  variant = "default",
}: FooterProps) {
  const bgClasses =
    variant === "transparent"
      ? "!bg-none !bg-transparent"
      : "bg-gradient-to-r from-[#FF2D55] to-[#FF6321] border-t border-white/10";

  return (
    <footer
      className={`w-full flex flex-col items-center px-4 pt-4 pb-1 shrink-0 mt-auto z-20 relative text-white pointer-events-auto ${bgClasses} ${className}`}
    >
      <div className="flex flex-row items-stretch justify-center gap-4 sm:gap-8 w-full max-w-lg">

        {/* POWERED BY */}
        <div className="flex flex-col items-center justify-between">
          <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 text-center mb-2">
            Powered By
          </span>

          <a
            href="https://dk24.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 overflow-hidden">
              <img
                src="/dk24.png"
                alt="DK24"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-widest">
              DK24
            </span>
          </a>
        </div>

        {/* DIVIDER */}
        <div className="w-px bg-white/20"></div>

        {/* COLLAB */}
        <div className="flex flex-col items-center justify-between">
          <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-bold opacity-60 text-center mb-2">
            In Collaboration
          </span>

          <div className="flex items-center gap-2 sm:gap-3">
            {[
              {
                id: 1,
                src: "/cosc.png",
                url: "https://www.linkedin.com/company/canara-students-open-source-community/",
              },
              {
                id: 2,
                src: "/sosc.png",
                url: "https://sosc.org.in/",
              },
              {
                id: 3,
                src: "/sceptix.png",
                url: "https://www.sceptix.in/",
              },
            ].map((logo) => (
              <a
                key={logo.id}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-all rounded-md">
                  <img
                    src={logo.src}
                    alt=""
                    className="w-full h-full object-contain p-0.5 sm:p-1"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}