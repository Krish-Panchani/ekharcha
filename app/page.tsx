"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  DollarSign,
  Calendar,
  PieChart,
  ArrowRight,
  Menu,
  X,
  Send,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TestimonialCardProps {
  quote: string;
  content: string;
  author: string;
  role: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}

type NewTransaction = Omit<Transaction, "id" | "date">;

export default function EnhancedLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "features",
        "demo",
        "benefits",
        "testimonials",
        "cta",
        "faq",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="fixed w-full bg-white z-50 transition-all duration-300 ease-in-out border-b">
        <nav className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            FinTrack
          </Link>
          <div className="hidden md:flex space-x-4">
            {["features", "demo", "testimonials", "faq"].map((item) => (
              <Link
                key={item}
                href={`#${item}`}
                className={`text-sm lg:text-base hover:underline transition-colors duration-300 ${
                  activeSection === item ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </div>
          <Button className="hidden md:inline-flex text-sm lg:text-base">
            Get Started
          </Button>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b">
            <div className="container mx-auto py-4 space-y-4">
              {["features", "demo", "testimonials", "faq"].map((item) => (
                <Link
                  key={item}
                  href={`#${item}`}
                  className="block hover:underline text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
              <Button className="w-full text-sm">Get Started</Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section
          id="hero"
          className="py-12 sm:py-20 md:py-32 bg-gradient-to-b from-gray-100 to-white"
        >
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Track Your Money,{" "}
                <span className="text-blue-600">Take Control</span> of Your
                Future
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-lg">
                Effortlessly manage your expenses and income, and see where your
                money is really going.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Get Started for Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  See the App in Action
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <Image
                src="/placeholder.svg"
                alt="Financial App Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-12 sm:py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <FeatureCard
                icon={
                  <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                }
                title="Stay On Top of Your Expenses"
                description="Effortlessly track every purchase and categorize them to see exactly where your money goes."
              />
              <FeatureCard
                icon={
                  <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                }
                title="Know Your Earnings"
                description="Log your income from salary, side gigs, or passive income. Track all your finances in one place."
              />
              <FeatureCard
                icon={
                  <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                }
                title="Simplify Recurring Payments"
                description="Automatically track monthly subscriptions, bills, and other recurring payments."
              />
              <FeatureCard
                icon={
                  <PieChart className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
                }
                title="Visual Reports"
                description="See your financial trends at a glance with colorful charts and insightful graphs."
              />
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section
          id="demo"
          className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-100"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Experience the Power of Financial Clarity
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Try our interactive demo to see how easy it is to track your
              spending and income.
            </p>
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
              <InteractiveDemo />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 sm:py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Why Choose FinTrack?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <BenefitCard
                icon={
                  <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                }
                title="Save More Money"
                description="Understand your spending habits and make smarter financial decisions."
              />
              <BenefitCard
                icon={
                  <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                }
                title="Be in Control"
                description="Set budgets, track spending in real-time, and get timely reminders."
              />
              <BenefitCard
                icon={
                  <PieChart className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                }
                title="Stress-Free Management"
                description="Simplify your financial management with our easy-to-use design."
              />
            </div>
            <div className="text-center mt-8 sm:mt-12">
              <p className="text-base sm:text-lg font-semibold mb-4">
                Join over 100,000 users who have taken control of their
                finances!
              </p>
              <Button size="lg" className="text-sm sm:text-base">
                Start Your Financial Journey
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section id="testimonials" className="py-12 sm:py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <TestimonialCard
                quote="A Game-Changer for My Budget!"
                content="I used to struggle to track all my expenses. Now, I can see exactly where I'm spending and have more control over my savings. This app made budgeting so much easier!"
                author="Sarah M."
                role="Freelance Designer"
              />
              <TestimonialCard
                quote="An Essential Tool for Every Freelancer!"
                content="As a freelancer, keeping track of multiple income streams and expenses was a nightmare. This app has simplified everything. I now have a clear overview of my finances."
                author="John D."
                role="Software Developer"
              />
              <TestimonialCard
                quote="Fantastic Visual Reports"
                content="I love the visual reports! The pie charts and graphs make it so easy to see my financial trends. It's perfect for anyone who wants to stay on top of their spending."
                author="Emily R."
                role="Small Business Owner"
              />
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          id="cta"
          className="py-12 sm:py-20 bg-gradient-to-b from-gray-100 to-white"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Don't wait for the next month to get started. Take charge of your
              expenses and income today, and start building a smarter financial
              future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Sign Up for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Download the App Now
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 sm:py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
              <FAQItem
                question="How secure is my data?"
                answer="Your data is fully encrypted and protected. We follow strict security protocols to ensure your financial information stays safe."
              />
              <FAQItem
                question="Can I track my income from multiple sources?"
                answer="Yes! You can easily log multiple income sources and see how each contributes to your overall financial picture."
              />
              <FAQItem
                question="Is the app free to use?"
                answer="Yes, the app is free to download and use with basic features. We also offer premium features for advanced reporting and additional tools."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="font-bold mb-4 text-sm sm:text-base">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-400 transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-blue-400 transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-blue-400 transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-blue-400 transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-blue-400 transition-colors text-sm"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-sm sm:text-base">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" aria-label="Instagram">
                  <Image
                    src="/instagram.svg"
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="#" aria-label="Twitter">
                  <Image
                    src="/twitter.svg"
                    alt="Twitter"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="#" aria-label="Facebook">
                  <Image
                    src="/facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href="#" aria-label="LinkedIn">
                  <Image
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="font-bold mb-4 text-sm sm:text-base">
                Download Our App
              </h3>
              <div className="flex space-x-4">
                <Link href="#">
                  <Image
                    src="/app-store.svg"
                    alt="Download on the App Store"
                    width={120}
                    height={40}
                  />
                </Link>
                <Link href="#">
                  <Image
                    src="/google-play.svg"
                    alt="Get it on Google Play"
                    width={135}
                    height={40}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-xs sm:text-sm">
            © 2025 FinTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm sm:text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm sm:text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({
  quote,
  content,
  author,
  role,
}: TestimonialCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl italic">"{quote}"</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 text-sm sm:text-base">
          {content}
        </CardDescription>
        <div className="flex items-center">
          <Image
            src="/placeholder.svg"
            alt={author}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <p className="font-semibold text-sm">{author}</p>
            <p className="text-xs sm:text-sm text-gray-600">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg sm:text-xl font-semibold">{question}</h3>
        <span className="ml-6">
          {isOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </span>
      </button>
      {isOpen && (
        <p className="mt-2 text-sm sm:text-base text-gray-600">{answer}</p>
      )}
    </div>
  );
}

function InteractiveDemo() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "income",
      category: "Salary",
      amount: 3000,
      date: "2023-05-01",
    },
    {
      id: 2,
      type: "expense",
      category: "Rent",
      amount: 1000,
      date: "2023-05-02",
    },
    {
      id: 3,
      type: "expense",
      category: "Food",
      amount: 300,
      date: "2023-05-03",
    },
    {
      id: 4,
      type: "income",
      category: "Freelance",
      amount: 500,
      date: "2023-05-04",
    },
  ]);
  const [newTransaction, setNewTransaction] = useState<NewTransaction>({
    type: "expense",
    category: "",
    amount: 0,
  });
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef]); // Removed unnecessary dependency

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTransaction.category && newTransaction.amount) {
      const currentDate = new Date().toISOString().split("T")[0];
      setTransactions([
        ...transactions,
        {
          id: Date.now(),
          ...newTransaction,
          amount: Number(newTransaction.amount),
          date: currentDate,
        },
      ]);
      setNewTransaction({ type: "expense", category: "", amount: 0 });
    }
  };

  const totalIncome = transactions.reduce(
    (sum, transaction) =>
      transaction.type === "income" ? sum + transaction.amount : sum,
    0
  );
  const totalExpenses = transactions.reduce(
    (sum, transaction) =>
      transaction.type === "expense" ? sum + transaction.amount : sum,
    0
  );
  const netBalance = totalIncome - totalExpenses;

  const getRecentTrend = () => {
    const recentTransactions = transactions.slice(-5);
    const incomeTrend = recentTransactions.filter(
      (t) => t.type === "income"
    ).length;
    const expenseTrend = recentTransactions.filter(
      (t) => t.type === "expense"
    ).length;
    return incomeTrend > expenseTrend
      ? "positive"
      : incomeTrend < expenseTrend
      ? "negative"
      : "neutral";
  };

  const trend = getRecentTrend();

  return (
    <div className="text-left">
      <h3 className="text-xl sm:text-2xl font-bold mb-4">
        Try Adding a Transaction
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <form onSubmit={addTransaction} className="mb-6 flex flex-col gap-2">
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  type: e.target.value as "income" | "expense",
                })
              }
              className="p-2 border rounded text-sm sm:text-base"
              aria-label="Transaction type"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <Input
              type="text"
              placeholder="Category"
              value={newTransaction.category}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                })
              }
              aria-label="Transaction category"
              className="text-sm sm:text-base"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount || ""}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: Number.parseFloat(e.target.value),
                })
              }
              aria-label="Transaction amount"
              className="text-sm sm:text-base"
            />
            <Button type="submit" className="mt-2 text-sm sm:text-base">
              <Send className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </form>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <Card className="p-4 bg-green-100">
              <CardHeader className="p-0">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-lg sm:text-xl text-green-600">
                  ${totalIncome}
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 bg-red-100">
              <CardHeader className="p-0">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-lg sm:text-xl text-red-600">
                  ${totalExpenses}
                </p>
              </CardContent>
            </Card>
            <Card className="p-4 bg-blue-100">
              <CardHeader className="p-0">
                <CardTitle className="text-base sm:text-lg font-semibold">
                  Net Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p
                  className={`text-lg sm:text-xl ${
                    netBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${netBalance}
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Recent Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {trend === "positive" && (
                  <TrendingUp className="text-green-500 mr-2" />
                )}
                {trend === "negative" && (
                  <TrendingDown className="text-red-500 mr-2" />
                )}
                {trend === "neutral" && (
                  <ArrowRight className="text-gray-500 mr-2" />
                )}
                <span className="text-sm sm:text-base">
                  {trend === "positive" &&
                    "Your recent transactions show more income than expenses."}
                  {trend === "negative" &&
                    "Your recent transactions show more expenses than income."}
                  {trend === "neutral" &&
                    "Your recent income and expenses are balanced."}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h4 className="text-lg sm:text-xl font-semibold mb-2">
            Transaction History
          </h4>
          <div
            ref={chatRef}
            className="h-[300px] sm:h-[400px] overflow-y-auto border rounded p-4 space-y-4"
          >
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-start ${
                  transaction.type === "income"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    transaction.type === "income"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-semibold text-sm sm:text-base">
                    {transaction.category}
                  </p>
                  <p className="text-sm sm:text-base">${transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
