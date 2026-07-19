import { Link } from "react-router-dom";

export function FullNameLogo() {
  return (
    <Link
      to="/"
      className="w-full h full focus-ring-visible outline-none focus-visible:ring-offset-0 block focus-visible:rounded"
    >
      <img
        width={128}
        height={36}
        src="/assets/logo/full-name.png"
        alt="Memora"
        className="w-full z-full"
      />
    </Link>
  );
}

export function MonoFullNameLogo() {
  return (
    <Link
      to="/"
      className="w-full h full focus-ring-visible outline-none focus-visible:ring-offset-0 block focus-visible:rounded"
    >
      <img
        width={128}
        height={36}
        src="/assets/logo/mono-full-name.png"
        alt="Memora"
        className="w-full z-full"
      />
    </Link>
  );
}

export function IconOnlyLogo() {
  return (
    <Link
      to="/"
      className="w-full h-full block focus-ring-visible outline-none focus-visible:ring-offset-0 focus-visible:rounded"
    >
      <img
        width={36}
        height={36}
        src="/assets/logo/icon.png"
        alt="Memora"
        className="w-full z-full"
      />
    </Link>
  );
}
