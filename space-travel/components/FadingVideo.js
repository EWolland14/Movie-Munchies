// FadingVideo component (custom JS crossfade, no CSS transitions)
function FadingVideo({ src, className = "", style = {} }) {
  const videoRef = React.useRef(null);
  const rafIdRef = React.useRef(null);
  const fadingOutRef = React.useRef(false);
  const timeoutIdRef = React.useRef(null);

  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  const fadeTo = React.useCallback((target, duration = FADE_MS) => {
    const video = videoRef.current;
    if (!video) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const currentStyleOpacity = video.style.opacity;
    const startOpacity = currentStyleOpacity === "" ? 0 : parseFloat(currentStyleOpacity);
    const diff = target - startOpacity;

    if (Math.abs(diff) < 0.001) {
      video.style.opacity = target.toString();
      return;
    }

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startOpacity + diff * progress;
      video.style.opacity = current.toString();

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        rafIdRef.current = null;
        video.style.opacity = target.toString();
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = "0";

    const handleLoadedData = () => {
      video.style.opacity = "0";
      fadingOutRef.current = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      if (
        !fadingOutRef.current &&
        video.duration &&
        video.duration - video.currentTime <= FADE_OUT_LEAD &&
        video.duration - video.currentTime > 0
      ) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      timeoutIdRef.current = setTimeout(() => {
        if (!videoRef.current) return;
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // If video was already cached / ready before listener attached
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [fadeTo, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{
        ...style,
        opacity: 0,
        transition: "none",
        WebkitTransition: "none",
      }}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
}

window.FadingVideo = FadingVideo;
