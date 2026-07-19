import LandingButton from "./LandingButton";

function Hero() {
  return (
    <section className="grid grid-cols-2 gap-8 items-center lg:pt-8 hero:grid-cols-1">
      <div className="max-w-lg self-center">
        <h1 className="text-6xl text-foreground font-semibold mb-4 xl:text-5xl lg:text-4xl sm:text-3xl sm:mb-2">
          Never Miss a <span className="text-accent">Birthday</span> Again!
        </h1>
        <p className="mb-6 text-lg lg:text-base">
          Memora helps you keep track of birthdays of your loved ones, sending
          you timely reminders to make their day special.
        </p>
        <div className="w-fit">
          <LandingButton />
        </div>
      </div>
      <div className="w-full hero:w-1/2 hero:mx-auto md:w-3/5 sm:w-full">
        <img
          width={200}
          height={200}
          src="/assets/hero-image.svg"
          alt=""
          className="w-full object-cover object-center"
        />
      </div>
    </section>
  );
}

export default Hero;
