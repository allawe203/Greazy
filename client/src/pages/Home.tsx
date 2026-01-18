const heroVideoUrl = 'https://umyrutkzbunvqeumrqwi.supabase.co/storage/v1/object/public/images/videos/hero-video.mp4';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>
    </div>
  );
}
