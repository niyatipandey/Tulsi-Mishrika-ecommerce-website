import { Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button, Card } from '@/components/common';

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <Section background="cream-light" className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brown-dark mb-6">
              About MADHU वन            </h1>
            <p className="text-xl text-brown-medium leading-relaxed">
              Preserving the ancient art of making pure crystal sugar, one batch at a time. 
              We believe in tradition, purity, and the healing power of nature.
            </p>
          </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section background="white" className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] bg-cream-light rounded-2xl overflow-hidden shadow-xl">
                <div className="w-full h-full flex items-center justify-center text-brown-light">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block mb-4">
                <span className="text-gold font-semibold text-sm tracking-wide uppercase">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-brown-dark mb-6">
                Bringing Back the Goodness of Tradition
              </h2>
              <p className="text-lg text-brown-medium leading-relaxed mb-6">
                At MADHU वन, our mission is simple yet profound: to revive and preserve 
                the centuries-old tradition of making pure, natural crystal sugar while making 
                it accessible to modern households.
              </p>
              <p className="text-lg text-brown-medium leading-relaxed">
                We believe that in our rush towards convenience, we've lost touch with the 
                wisdom of our ancestors. Our Mishri brings back that connection—one sweet 
                crystal at a time.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Section */}
      <Section background="cream-light" className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-brown-dark mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-brown-medium max-w-2xl mx-auto">
              Everything we do is guided by these fundamental principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 - Purity */}
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-brown-dark mb-4">Purity First</h3>
              <p className="text-brown-medium leading-relaxed">
                We use only natural sugarcane juice, with no additives, preservatives, or 
                artificial ingredients. What you get is 100% pure Mishri.
              </p>
            </Card>

            {/* Value 2 - Tradition */}
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-brown-dark mb-4">Time-Honored Methods</h3>
              <p className="text-brown-medium leading-relaxed">
                We follow traditional crystallization methods passed down through generations, 
                ensuring authentic taste and quality.
              </p>
            </Card>

            {/* Value 3 - Sustainability */}
            <Card className="p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-brown-dark mb-4">Sustainable Practices</h3>
              <p className="text-brown-medium leading-relaxed">
                We source our sugarcane from sustainable farms and use eco-friendly packaging 
                to minimize our environmental impact.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Why Choose Us Section */}
      <Section background="white" className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-brown-dark mb-4">
                Why Choose MADHU वन?
              </h2>
              <p className="text-lg text-brown-medium">
                We're more than just a Mishri brand—we're a movement to bring back healthy, 
                traditional sweetness.
              </p>
            </div>

            <div className="space-y-6">
              {/* Reason 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-brown-dark mb-2">
                    Handcrafted with Care
                  </h3>
                  <p className="text-brown-medium leading-relaxed">
                    Every batch is carefully monitored and crafted by skilled artisans who 
                    understand the delicate art of Mishri making. No machines, no shortcuts—just 
                    pure craftsmanship.
                  </p>
                </div>
              </div>

              {/* Reason 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-brown-dark mb-2">
                    Health Benefits You Can Trust
                  </h3>
                  <p className="text-brown-medium leading-relaxed">
                    Unlike refined white sugar, our Mishri retains natural minerals and has a 
                    lower glycemic index. It's known to aid digestion, soothe throats, and boost 
                    energy naturally.
                  </p>
                </div>
              </div>

              {/* Reason 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-brown-dark mb-2">
                    Infused with Tulsi (Holy Basil)
                  </h3>
                  <p className="text-brown-medium leading-relaxed">
                    Our signature Mishri is infused with Tulsi, a sacred herb known for its 
                    medicinal properties. This unique combination amplifies the health benefits 
                    while adding a subtle, pleasant aroma.
                  </p>
                </div>
              </div>

              {/* Reason 4 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gold">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-brown-dark mb-2">
                    Direct from Source to You
                  </h3>
                  <p className="text-brown-medium leading-relaxed">
                    We work directly with sugarcane farmers and deliver straight to your doorstep. 
                    No middlemen means fresher product and fairer prices for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Team Section (Optional - can be customized) */}
      <Section background="cream-light" className="py-16">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-brown-dark mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-brown-medium max-w-2xl mx-auto">
              The passionate people behind MADHU वन            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gold">RK</span>
              </div>
              <h3 className="text-xl font-semibold text-brown-dark mb-1">Raj Kumar</h3>
              <p className="text-sm text-gold mb-3">Founder & Master Artisan</p>
              <p className="text-sm text-brown-medium">
                40+ years of experience in traditional Mishri making
              </p>
            </Card>

            {/* Team Member 2 */}
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gold">PS</span>
              </div>
              <h3 className="text-xl font-semibold text-brown-dark mb-1">Priya Sharma</h3>
              <p className="text-sm text-gold mb-3">Quality Control Head</p>
              <p className="text-sm text-brown-medium">
                Ensures every batch meets our high standards
              </p>
            </Card>

            {/* Team Member 3 */}
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gold">AV</span>
              </div>
              <h3 className="text-xl font-semibold text-brown-dark mb-1">Amit Verma</h3>
              <p className="text-sm text-gold mb-3">Operations Manager</p>
              <p className="text-sm text-brown-medium">
                Manages sourcing and timely delivery nationwide
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="brown-dark" className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-black mb-6">
              Ready to Experience Pure Tradition?
            </h2>
            <p className="text-xl text-black mb-8">
              Join thousands of happy customers who've made MADHU वन part of their 
              daily wellness routine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/story">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-black text-black hover:text-brown-dark"
                >
                  Read Our Story
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
