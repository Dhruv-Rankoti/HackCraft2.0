import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">AI-Powered Customer Feedback Analyzer</h1>
          <p className="mt-4 text-lg text-gray-300">
            Gain real-time insights from customer feedback to enhance your brand reputation.
          </p>
          <Link href="/feedback">
            <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our AI Tool?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard title="Sentiment Analysis" description="Classifies feedback as positive, neutral, or negative in real-time." />
            <FeatureCard title="Trend Detection" description="Identifies emerging trends and customer concerns." />
            <FeatureCard title="Actionable Insights" description="Provides data-driven recommendations to improve customer experience." />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-200 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard step="1" title="Collect Feedback" description="Gather customer reviews, surveys, and social media comments." />
            <StepCard step="2" title="AI Analysis" description="NLP models analyze sentiment and detect trends." />
            <StepCard step="3" title="Get Insights" description="View real-time insights on an interactive dashboard." />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Testimonial
              name="Sarah Johnson"
              feedback="This tool helped us understand our customers better. Our satisfaction rate increased by 20%!"
            />
            <Testimonial
              name="Michael Lee"
              feedback="Real-time insights have transformed our business strategy. Highly recommended!"
            />
          </div>
        </div>
      </section>

      {/* Call-To-Action */}
      <section className="bg-blue-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold">Start Improving Customer Experience Today</h2>
        <p className="mt-2 text-lg">Analyze feedback, detect trends, and gain valuable insights.</p>
        <Link href="/feedback">
          <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-bold">
            Try It Now
          </button>
        </Link>
      </section>
    </div>
  );
}

/* FeatureCard Component */
const FeatureCard = ({ title, description }) => (
  <div className="p-6 bg-white shadow-lg rounded-lg">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

/* StepCard Component */
const StepCard = ({ step, title, description }) => (
  <div className="p-6 bg-white shadow-lg rounded-lg">
    <span className="text-4xl font-bold text-blue-500">{step}</span>
    <h3 className="text-xl font-bold mt-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

/* Testimonial Component */
const Testimonial = ({ name, feedback }) => (
  <div className="p-6 bg-white shadow-lg rounded-lg">
    <p className="italic">"{feedback}"</p>
    <p className="mt-4 font-bold text-blue-500">- {name}</p>
  </div>
);
