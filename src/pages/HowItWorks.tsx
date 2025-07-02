import React from 'react';
import { Search, Users, CheckCircle, Star, Shield, Clock, Phone, CreditCard, Calendar, MessageCircle, Award, Headphones } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How ServiceWala Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting you with trusted local service providers across India. 
            From booking to completion, we make it simple and secure.
          </p>
        </div>
      </section>

      {/* Main Process Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple 3-Step Process</h2>
            <p className="text-xl text-gray-600">Get quality services in just a few clicks</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-orange-600" />
              </div>
              <div className="absolute top-10 left-1/2 transform translate-x-8 hidden md:block">
                <div className="w-24 h-0.5 bg-orange-200"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Search & Browse</h3>
              <p className="text-gray-600 mb-6">
                Search for the service you need or browse through our categories. 
                Filter by location, price, and ratings to find the perfect match.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">What you can do:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Search by service type or keyword</li>
                  <li>• Filter by location and price range</li>
                  <li>• View detailed service profiles</li>
                  <li>• Read customer reviews and ratings</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <div className="absolute top-10 left-1/2 transform translate-x-8 hidden md:block">
                <div className="w-24 h-0.5 bg-green-200"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Connect & Book</h3>
              <p className="text-gray-600 mb-6">
                Review service provider profiles, check their experience and specialties. 
                Book your preferred time slot and communicate your requirements.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">What you get:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Verified professional profiles</li>
                  <li>• Transparent pricing information</li>
                  <li>• Flexible scheduling options</li>
                  <li>• Direct communication with providers</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Get Service & Pay</h3>
              <p className="text-gray-600 mb-6">
                The service provider arrives at your scheduled time. 
                Pay securely after the work is completed to your satisfaction.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Your benefits:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Quality assurance guarantee</li>
                  <li>• Secure payment options</li>
                  <li>• Post-service support</li>
                  <li>• Rate and review system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Customers</h2>
            <p className="text-xl text-gray-600">Everything you need to know about booking services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Calendar className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-gray-600 text-sm">
                Book services online with flexible scheduling. Choose your preferred date and time slot.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Verified Providers</h3>
              <p className="text-gray-600 text-sm">
                All service providers are background-verified and have valid certifications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <CreditCard className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Payment</h3>
              <p className="text-gray-600 text-sm">
                Pay securely online or cash after service completion. Multiple payment options available.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Headphones className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Our customer support team is available round the clock to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Service Providers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Service Providers</h2>
            <p className="text-xl text-gray-600">Join our platform and grow your business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Join ServiceWala?</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Access to Customers</h4>
                    <p className="text-gray-600">Connect with thousands of customers looking for your services across India.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Easy Communication</h4>
                    <p className="text-gray-600">Direct communication with customers through our platform messaging system.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Secure Payments</h4>
                    <p className="text-gray-600">Get paid securely and on time through our trusted payment system.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Build Your Reputation</h4>
                    <p className="text-gray-600">Earn reviews and ratings to build trust and attract more customers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-green-50 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Getting Started as a Provider</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <span className="text-gray-700">Create your professional profile</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <span className="text-gray-700">Complete verification process</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <span className="text-gray-700">List your services and pricing</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                  <span className="text-gray-700">Start receiving booking requests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety & Trust</h2>
            <p className="text-xl text-gray-600">Your safety and satisfaction are our top priorities</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <Shield className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Background Verification</h3>
              <p className="text-gray-600">
                All service providers undergo thorough background checks including identity verification, 
                address verification, and criminal background screening.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <Star className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                We maintain high service standards through customer feedback, regular quality checks, 
                and continuous provider training programs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available 24/7 to help resolve any issues 
                and ensure your complete satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Got questions? We've got answers</p>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I book a service?</h3>
              <p className="text-gray-600">
                Simply search for the service you need, browse through available providers, 
                select your preferred professional, choose a time slot, and confirm your booking. 
                You'll receive a confirmation with all the details.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Are the service providers verified?</h3>
              <p className="text-gray-600">
                Yes, all service providers on our platform undergo a comprehensive verification process 
                including background checks, identity verification, and skill assessment.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What if I'm not satisfied with the service?</h3>
              <p className="text-gray-600">
                We have a satisfaction guarantee policy. If you're not happy with the service, 
                contact our support team within 24 hours, and we'll work to resolve the issue 
                or provide a refund as per our policy.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I make payments?</h3>
              <p className="text-gray-600">
                You can pay through multiple secure payment options including UPI, credit/debit cards, 
                net banking, or cash after service completion. All online payments are processed securely.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I reschedule or cancel my booking?</h3>
              <p className="text-gray-600">
                Yes, you can reschedule or cancel your booking up to 2 hours before the scheduled time 
                without any charges. For last-minute cancellations, minimal charges may apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of satisfied customers and trusted service providers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/services"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Find Services
            </a>
            <a
              href="/signup"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-medium"
            >
              Become a Provider
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;