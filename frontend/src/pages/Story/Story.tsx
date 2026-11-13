import { Link } from 'react-router-dom';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/common';

export default function Story() {
  return (
    <>
      {/* Hero Section */}
      <Section background="cream-light" className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="text-gold font-semibold text-sm tracking-wide uppercase">
                Our Journey
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brown-dark mb-6">
              The Story of Tulsi Mishrika
            </h1>
            <p className="text-xl text-brown-medium leading-relaxed">
              A tale of tradition, passion, and the unwavering belief that the old ways 
              still hold the sweetest secrets.
            </p>
          </div>
        </Container>
      </Section>

      {/* Timeline Section */}
      <Section background="white" className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Story 1 - Origins */}
            <div className="mb-16">
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                    1980s
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-brown-dark mt-2 mb-4">
                    The Beginning
                  </h2>
                </div>
              </div>
              <div className="pl-20">
                <p className="text-lg text-brown-medium leading-relaxed mb-4">
                  Our story begins in a small village in Uttar Pradesh, where Raj Kumar learned 
                  the art of Mishri making from his grandfather. What started as helping out in 
                  the family's small workshop became a lifelong passion.
                </p>
                <p className="text-lg text-brown-medium leading-relaxed">
                  Back then, every household knew the value of pure Mishri—used in prayers, 
                  given to children for sore throats, dissolved in milk for a healthy treat. 
                  But as packaged sweets flooded the market, this ancient craft began to fade.
                </p>
              </div>
            </div>

            {/* Story 2 - The Challenge */}
            <div className="mb-16">
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                    2000s
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-brown-dark mt-2 mb-4">
                    A Turning Point
                  </h2>
                </div>
              </div>
              <div className="pl-20">
                <p className="text-lg text-brown-medium leading-relaxed mb-4">
                  By the early 2000s, Raj Kumar noticed that authentic Mishri had become hard 
                  to find. What was sold as "rock sugar" was often just refined sugar molded 
                  into crystals—missing the soul and benefits of true traditional Mishri.
                </p>
                <p className="text-lg text-brown-medium leading-relaxed">
                  He made a decision: instead of letting this craft die, he would dedicate 
                  himself to preserving it. He began experimenting with his grandfather's 
                  recipes, determined to create Mishri that honored tradition while meeting 
                  modern quality standards.
                </p>
              </div>
            </div>

            {/* Story 3 - The Innovation */}
            <div className="mb-16">
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                    2015
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-brown-dark mt-2 mb-4">
                    The Tulsi Touch
                  </h2>
                </div>
              </div>
              <div className="pl-20">
                <p className="text-lg text-brown-medium leading-relaxed mb-4">
                  After years of perfecting the traditional process, Raj Kumar had an idea: 
                  What if he could enhance Mishri's natural benefits by infusing it with Tulsi, 
                  the sacred herb known for its healing properties?
                </p>
                <p className="text-lg text-brown-medium leading-relaxed">
                  The result was magical. The Tulsi added a subtle aroma and amplified the 
                  health benefits, creating something truly unique. Friends and family who 
                  tried it were amazed—this wasn't just sugar, it was medicine disguised as a 
                  treat.
                </p>
              </div>
            </div>

            {/* Story 4 - Going Public */}
            <div className="mb-16">
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                    2018
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-brown-dark mt-2 mb-4">
                    Birth of a Brand
                  </h2>
                </div>
              </div>
              <div className="pl-20">
                <p className="text-lg text-brown-medium leading-relaxed mb-4">
                  Word spread quickly. What started as gifts to friends became requests from 
                  their friends, then orders from local stores. Encouraged by the response, 
                  Raj Kumar decided to take Tulsi Mishrika to a wider audience.
                </p>
                <p className="text-lg text-brown-medium leading-relaxed">
                  With a small team of dedicated artisans and a commitment to never compromise 
                  on quality, Tulsi Mishrika was officially launched. The mission was clear: 
                  bring authentic, healthy sweetness back to Indian kitchens.
                </p>
              </div>
            </div>

            {/* Story 5 - Today */}
            <div>
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-gold font-semibold text-sm uppercase tracking-wide">
                    Today
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-brown-dark mt-2 mb-4">
                    Growing Together
                  </h2>
                </div>
              </div>
              <div className="pl-20">
                <p className="text-lg text-brown-medium leading-relaxed mb-4">
                  Today, Tulsi Mishrika serves thousands of families across India. Each batch 
                  is still made using the same traditional methods, with the same attention to 
                  purity and quality that Raj Kumar learned from his grandfather.
                </p>
                <p className="text-lg text-brown-medium leading-relaxed mb-4">
                  We've grown, but our core values haven't changed. Every crystal of Mishri that 
                  leaves our workshop carries decades of knowledge, a commitment to health, and 
                  the belief that some traditions are too precious to lose.
                </p>
                <p className="text-lg font-semibold text-brown-dark">
                  This is more than a business—it's our way of keeping a beautiful tradition 
                  alive for the next generation.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Quote Section */}
      <Section background="cream-light" className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-16 h-16 text-gold mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl md:text-3xl font-serif text-brown-dark mb-6 leading-relaxed">
              "In every crystal of Mishri, there's a story of patience, purity, and the 
              wisdom of generations. We don't just make sugar—we preserve a legacy."
            </blockquote>
            <p className="text-lg text-brown-medium">
              — Raj Kumar, Founder
            </p>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="white" className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-brown-dark mb-6">
              Be Part of Our Story
            </h2>
            <p className="text-xl text-brown-medium mb-8">
              Every purchase supports traditional artisans and helps keep this beautiful 
              craft alive. Join our community today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Shop Tulsi Mishrika
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
