"use client";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#004aad]">About Us</h1>
      <p className="text-lg text-gray-700 leading-7 mb-6 text-center">
        Welcome to our event booking platform – your one-stop destination for discovering, booking, and enjoying amazing events!
      </p>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-[#004aad] mb-2">Who We Are</h2>
          <p className="text-gray-700 leading-6">
            We're a passionate team of developers and event enthusiasts dedicated to making event planning and booking seamless.
            Whether you're hosting an event or attending one, we've got the tools you need to succeed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#004aad] mb-2">Our Mission</h2>
          <p className="text-gray-700 leading-6">
            To simplify the event experience — from discovery and ticketing to management and engagement — with a focus on
            user-friendly design, security, and performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[#004aad] mb-2">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Simple and secure ticket booking</li>
            <li>Real-time event updates</li>
            <li>Dedicated support for organizers and attendees</li>
            <li>Built with modern tech to ensure speed and reliability</li>
          </ul>
        </section>
      </div>

    </div>
  );
};

export default AboutPage;
