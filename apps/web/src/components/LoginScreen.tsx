import { motion } from "motion/react";
import Footer from "./Footer";

interface LoginScreenProps {
  onStart?: () => void;
}

export default function LoginScreen({ onStart }: LoginScreenProps) {
  return (
    <div
      className="h-[100dvh] relative select-none overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">

        {/* ── LOGO ── */}
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[260px] sm:max-w-[340px] md:max-w-[420px]"
        >
          <img
            src="/csf-logo.png"
            alt="Coastal Startup Fest 2026"
            className="w-full h-auto object-contain"
          />
        </motion.div>

        {/* ── TAGLINE ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-4 sm:mt-6 text-center text-[15px] sm:text-[18px] md:text-[20px] text-white/90 leading-snug tracking-wide max-w-[320px] sm:max-w-[400px]"
        >
          Empowering the next generation
          <br />
          of coastal entrepreneurs
        </motion.p>

        {/* ── FOOTER ── */}
        <div className="mt-3 sm:mt-4">
          <Footer variant="transparent" />
        </div>

        {/* ── BUTTON ── */}
        <motion.button
          onClick={onStart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 sm:mt-6 px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base uppercase tracking-[0.18em] text-white"
          style={{
            background:
              "linear-gradient(90deg, #fca311 0%, #ff2d78 45%, #4a7cf6 100%)",
            boxShadow:
              "0 0 32px rgba(74,124,246,0.5), 0 0 16px rgba(252,163,17,0.3)",
          }}
        >
          Get Started
        </motion.button>

      </div>
    </div>
  );
}