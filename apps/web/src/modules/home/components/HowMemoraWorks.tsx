function HowMemoraWorks() {
  return (
    <div>
      <section className="pt-8" id="how-memora-works">
        <div className="text-center mb-12">
          <h2 className="font-semibold text-3xl mb-2 lg:text-2xl">
            How does <span className="text-accent">Memora</span> Work?
          </h2>
        </div>
        <div className="px-2">
          <ul className="grid grid-cols-3 gap-x-24 xl:gap-x-16 lg:gap-8 md:gap-16 md:grid-cols-1">
            <li>
              <div className="flex flex-col items-center text-center gap-6 before:content-['1'] before:text-7xl before:font-bold before:text-accent md:text-left md:items-start md:max-w-sm">
                <div>
                  <h3 className="text-lg font-semibold">Sign Up for Memora</h3>
                  <p className="text-gray-800 mt-1">
                    Create your Memora account in a few simple steps.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col items-center text-center gap-6 before:content-['2'] before:text-7xl before:font-bold before:text-accent md:text-left md:items-start md:max-w-sm">
                <div>
                  <h3 className="text-lg font-semibold">
                    Add Birthdays to Your Dashboard
                  </h3>
                  <p className="text-gray-800 mt-1">
                    Easily add birthdays of your loved ones to your Memora
                    dashboard.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col items-center text-center gap-6 before:content-['3'] before:text-7xl before:font-bold before:text-accent md:text-left md:items-start md:max-w-sm">
                <div>
                  <h3 className="text-lg font-semibold">
                    Receive Timely Reminders
                  </h3>
                  <p className="text-gray-800 mt-1">
                    Memora sends you personalized reminders on each birthday,
                    ensuring you never miss a celebration.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default HowMemoraWorks;
