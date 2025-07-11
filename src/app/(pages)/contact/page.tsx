export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pt-8">
      <h1 className="text-3xl font-bold">Contact</h1>

      <p className="text-lg text-gray-700 mt-4">
        We'd love to hear from you! Whether you have a question, feedback, or a collaboration opportunity, feel free to reach out using the form below.
      </p>
      <p className="text-lg text-gray-700">
        We typically respond within 1–2 business days.
      </p>

      <form className="mt-8 space-y-4 max-w-xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-white-600 text-black border px-6 py-2 rounded-md hover:bg-pink-700 hover:text-white transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
