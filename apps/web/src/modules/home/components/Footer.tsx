import MaxContainer from "@components/Container/MaxContainer";
import { MonoFullNameLogo } from "@components/Logo";

function Footer() {
  return (
    <footer className="mt-24 bg-primary text-white py-12">
      <MaxContainer>
        <div className="landing-padding grid grid-cols-3 gap-8 md:grid-cols-1 md:gap-12">
          <div className="max-w-sm">
            <div className="w-32">
              <MonoFullNameLogo />
            </div>
            <p className="mt-2 font-medium">
              For birthdays you adore, Memora keeps you on track for sure!
            </p>
            <p className="mt-8">Made with ❤ by @Dave</p>
          </div>
          <div>
            <ul className="space-y-6 text-white/80">
              <li className="text-white">EXPLORE</li>
              <li>
                <a
                  href="#why-choose-memora"
                  className="block w-fit outline-none transition-all hover:text-white focus-visible:ring-offset-primary focus-visible:rounded focus-visible:text-white focus-ring-visible"
                >
                  Why Choose Memora
                </a>
              </li>
              <li>
                <a
                  href="#how-memora-works"
                  className="block w-fit outline-none transition-all hover:text-white focus-visible:ring-offset-primary focus-visible:rounded focus-visible:text-white focus-ring-visible"
                >
                  How Memora Work
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-6 text-white/80">
              <li className="text-white">LET&apos;S CONNECT</li>
              <li>
                <a
                  href="https://www.linkedin.com/in/david-aronmwan-5101ab172/"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-fit outline-none transition-all hover:text-white focus-visible:ring-offset-primary focus-visible:rounded focus-visible:text-white focus-ring-visible"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/kvng__dave"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-fit outline-none transition-all hover:text-white focus-visible:ring-offset-primary focus-visible:rounded focus-visible:text-white focus-ring-visible"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/d-a-ve"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-fit outline-none transition-all hover:text-white focus-visible:ring-offset-primary focus-visible:rounded focus-visible:text-white focus-ring-visible"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </MaxContainer>
    </footer>
  );
}

export default Footer;
