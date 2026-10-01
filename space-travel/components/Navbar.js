// Navbar component
function Navbar() {
  const { ArrowUpRight } = window.Icons;
  const navLinks = ["Home", "Voyages", "Worlds", "Innovation", "Plan Launch"];

  return (
    <nav className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: 48x48 liquid-glass circle with italic serif lowercase "a" */}
      <a
        href="#"
        className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center font-heading italic text-2xl text-white select-none pointer-events-auto hover:opacity-90 transition-opacity"
        aria-label="Home"
      >
        a
      </a>

      {/* Center (desktop only): liquid-glass pill */}
      <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1.5 pointer-events-auto">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
            className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors"
          >
            {link}
          </a>
        ))}
        <button
          type="button"
          className="bg-white text-black whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 hover:bg-white/90 transition-colors cursor-pointer"
        >
          <span>Claim a Spot</span>
          <ArrowUpRight className="h-4 w-4 text-black" />
        </button>
      </div>

      {/* Right: 48x48 invisible spacer to balance logo */}
      <div className="w-12 h-12 pointer-events-none invisible" aria-hidden="true" />
    </nav>
  );
}

window.Navbar = Navbar;
