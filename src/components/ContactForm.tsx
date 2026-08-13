"use client";

import { useState } from "react";

export default function ContactForm() {
  const [result, setResult] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");

    const formData = new FormData(event.currentTarget);
    
    // Paste your actual Web3Forms Access Key here:
    formData.append("access_key", "f152a35e-5434-4dd1-91d4-0abbc37122c7");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Thank you! Your message has been sent successfully.");
        (event.target as HTMLFormElement).reset();
      } else {
        setResult(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setResult("Unable to send message. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white dark:bg-surface-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-surface-700">
        <h2 className="text-xl font-bold mb-2 text-surface-900 dark:text-surface-100 text-center">
          Contact Us / Feedback
        </h2>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6 text-center">
          Have feedback or can't find a specific HSN/GST code? Drop us a message below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ramesh@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
              Message / Missing HSN Code
            </label>
            <textarea
              name="message"
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us what HSN code or feature you are looking for..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Submit Message"}
          </button>
        </form>

        {result && (
          <p className="mt-4 text-sm text-center font-medium text-surface-800 dark:text-surface-200">
            {result}
          </p>
        )}
      </div>
    </section>
  );
}