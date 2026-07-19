function Features() {
  return (
    <div>
      <section id="why-choose-memora">
        <div className="max-w-lg mx-auto text-center mb-6">
          <h2 className="font-semibold text-3xl mb-2 lg:text-2xl">
            Why choose <span className="text-accent">Memora</span>?
          </h2>
          <p className="text-gray-800">
            Memora ensures you never forget a special day again! For birthdays
            you adore, Memora keeps you on track for sure!
          </p>
        </div>
        <div>
          <ul className="grid grid-cols-3 gap-8 text-left md:grid-cols-1">
            <li className="space-y-1 bg-white/50 px-6 py-6 rounded-lg border border-gray-200 max-w-md mx-auto">
              <div className="w-1/2 mx-auto">
                <img
                  src="/assets/features-birthday-reminder.svg"
                  alt="Reminder Flat illustration"
                  className="w-full h-full object-cover object-center"
                  width={120}
                  height={120}
                />
              </div>
              <h3 className="font-semibold text-lg pt-2">
                Personalized Birthday Reminders
              </h3>
              <p className="text-gray-800">
                Memora sends personalized reminders for each added birthday,
                ensuring you never forget to send wishes.
              </p>
            </li>
            <li className="space-y-1 bg-white/50 px-6 py-6 rounded-lg border border-gray-200 max-w-md mx-auto">
              <div className="w-1/2 mx-auto">
                <img
                  src="/assets/features-dashboard-management.svg"
                  alt="Reminder Flat illustration"
                  className="w-full h-full object-cover object-center"
                  width={120}
                  height={120}
                />
              </div>
              <h3 className="font-semibold text-lg pt-2">
                Easy Dashboard Management
              </h3>
              <p className="text-gray-800">
                Easily add, edit, and delete birthdays from your dashboard,
                keeping your list up-to-date effortlessly.
              </p>
            </li>
            <li className="space-y-1 bg-white/50 px-6 py-6 rounded-lg border border-gray-200 max-w-md mx-auto">
              <div className="w-1/2 mx-auto">
                <img
                  src="/assets/features-crafting-messages.svg"
                  alt="Reminder Flat illustration"
                  className="w-full h-full object-cover object-center"
                  width={120}
                  height={120}
                />
              </div>
              <h3 className="font-semibold text-lg pt-2">
                Craft Special Messages
              </h3>
              <p className="text-gray-800">
                Write heartfelt birthday greetings with Memora&apos;s
                easy-to-use interface.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Features;
