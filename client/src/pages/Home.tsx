import heroVideo from '@assets/vecteezy_restaurant-design-tableware-waiting-for-the-guests-an_1768668278535.mp4';

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
        <source src={heroVideo} type="video/mp4" />
      </video>
    </div>
  );
}
