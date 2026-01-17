export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-making-a-burger-3741/1080p.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
