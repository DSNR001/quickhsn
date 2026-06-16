export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: June 2026</p>
      
      <p className="mb-6 leading-relaxed">
        At <span className="font-semibold text-blue-600">quickhsn.in</span>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by our platform and how we use it.
      </p>

      <hr className="my-6 border-gray-200" />

      <h2 className="text-2xl font-semibold mb-3 text-gray-900">Data Collection</h2>
      <p className="mb-6 leading-relaxed">
        We do not collect personal identification information unless you voluntarily provide it. We may collect non-personal data (such as your browser type, device operating system, and anonymous HSN search patterns) solely to improve our user interface and application responsiveness.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-900">Google AdSense & Third-Party Cookies</h2>
      <p className="mb-4 leading-relaxed">
        We use third-party advertising companies, including Google, to serve ads when you visit our website. Google uses cookies (like the DART cookie) to serve relevant advertisements based on your prior visits to this website or other sites across the internet.
      </p>
      <p className="mb-6 leading-relaxed">
        You can choose to opt-out of personalized advertising at any time by visiting the official{" "}
        <a 
          href="https://policies.google.com/technologies/ads" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          Google Ad Settings
        </a>.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-900">Log Files</h2>
      <p className="mb-6 leading-relaxed">
        Like most standard website servers, <span className="font-semibold text-blue-600">quickhsn.in</span> utilizes server log files. This includes internet protocol (IP) addresses, browser types, Internet Service Provider (ISP) networks, date/time stamps, and page navigation pathways. This data is entirely anonymous, is not linked to any personally identifiable information, and is used strictly to analyze operational trends and administer the system architecture securely.
      </p>

      <h2 className="text-2xl font-semibold mb-3 text-gray-900">Contact Us</h2>
      <p className="leading-relaxed">
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through our primary support channels.
      </p>
    </div>
  );
}