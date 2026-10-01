// Section 1 — Hero (full viewport, black bg)
function Hero() {
  const { FadingVideo, BlurText } = window;
  const { ArrowUpRight, Play, Clock, Globe } = window.Icons;
  const motion = window.Motion ? window.Motion.motion : window.FramerMotion.motion;

  return (
    <section className="min-h-screen relative overflow-hidden bg-black flex flex-col justify-between">
      {/* Background video (120% width/height, top-aligned, centered horizontally) */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0 pointer-events-none"
        style={{ width: "120%", height: "120%" }}
      />

      {/* z-10 layer */}
      <div className="relative z-10 flex-1 flex flex-col justify-between pt-24 px-4 w-full max-w-7xl mx-auto">
        {/* Centered Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          {/* Badge (delay 0.4s) */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="liquid-glass rounded-full p-1 pl-1 pr-3 flex items-center gap-3 mb-6"
          >
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full">
              New
            </span>
            <span className="text-sm text-white/90 pr-3 font-body">
              Maiden Crewed Voyage to Mars Arrives 2026
            </span>
          </motion.div>

          {/* Headline — BlurText */}
          <BlurText
            text="Venture Past Our Sky Across the Universe"
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl justify-center tracking-[-4px]"
          />

          {/* Subheading (delay 0.8s) */}
          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight text-center"
          >
            Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach—secure and extraordinary.
          </motion.p>

          {/* CTAs (delay 1.1s) */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
            className="flex items-center gap-6 mt-6"
          >
            <button
              type="button"
              className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Start Your Voyage</span>
              <ArrowUpRight className="h-5 w-5" />
            </button>
            <a
              href="#liftoff"
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              <span>View Liftoff</span>
              <Play className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Stats row (delay 1.3s) */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
            className="flex flex-wrap justify-center items-stretch gap-4 mt-8"
          >
            {/* Stat Card 1 */}
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left">
              <Clock className="w-7 h-7 text-white" />
              <div className="mt-8">
                <div className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
                  34.5 Min
                </div>
                <div className="text-xs text-white font-body font-light mt-2">
                  Average Videos Watch Time
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] flex flex-col justify-between text-left">
              <Globe className="w-7 h-7 text-white" />
              <div className="mt-8">
                <div className="font-heading italic text-white text-4xl tracking-[-1px] leading-none">
                  2.8B+
                </div>
                <div className="text-xs text-white font-body font-light mt-2">
                  Users Across the Globe
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partners (bottom of hero, delay 1.4s) */}
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
          className="flex flex-col items-center gap-4 pb-8 pt-6"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white">
            Collaborating with top aerospace pioneers globally
          </div>
          <div className="flex items-center justify-center gap-12 md:gap-16 font-heading italic text-white text-2xl md:text-3xl tracking-tight flex-wrap">
            <span>Aeon</span>
            <span>Vela</span>
            <span>Apex</span>
            <span>Orbit</span>
            <span>Zeno</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

window.Hero = Hero;
