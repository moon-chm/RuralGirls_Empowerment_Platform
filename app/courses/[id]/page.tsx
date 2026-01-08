"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Circle, Award, Play, FileText, Lock, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

// COMPLETE COURSE DATABASE
const COURSES_DATABASE = {
  "basic-tailoring": {
    id: "basic-tailoring",
    title: "Basic Tailoring",
    description: "Learn to stitch clothes, make alterations, and basic design principles.",
    image: "/tailoring.jpg",
    duration: "8 weeks",
    category: "Tailoring",
    instructor: "Priya Sharma",
    level: "Beginner",
    rating: 4.8,
    reviews: 245,
    modules: [
      {
        id: 1,
        title: "Introduction to Tailoring",
        lessons: [
          { id: 1, title: "Welcome & Course Overview", duration: "10 min", type: "video" },
          { id: 2, title: "Understanding Fabrics", duration: "15 min", type: "video" },
          { id: 3, title: "Module 1 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What is the most commonly used natural fabric?", options: ["Polyester", "Cotton", "Nylon", "Acrylic"], correct: 1 },
              { id: 2, question: "Which tool is essential for measuring in tailoring?", options: ["Scissors", "Tape measure", "Needle", "Thread"], correct: 1 },
              { id: 3, question: "What does GSM stand for in fabric terminology?", options: ["General Sewing Method", "Grams per Square Meter", "Garment Style Manual", "Good Stitching Material"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Basic Stitching Techniques",
        lessons: [
          { id: 4, title: "Hand Stitching Basics", duration: "20 min", type: "video" },
          { id: 5, title: "Machine Stitching Introduction", duration: "25 min", type: "video" },
          { id: 6, title: "Module 2 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What is a running stitch used for?", options: ["Decorative purposes only", "Temporary basting", "Button holes", "Hemming thick fabrics"], correct: 1 },
              { id: 2, question: "Which stitch is strongest for seams?", options: ["Running stitch", "Back stitch", "Basting stitch", "Slip stitch"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "Pattern Making & Cutting",
        lessons: [
          { id: 7, title: "Reading Patterns", duration: "18 min", type: "video" },
          { id: 8, title: "Cutting Techniques", duration: "22 min", type: "video" },
          { id: 9, title: "Module 3 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What should you do before cutting fabric?", options: ["Wash it", "Iron it", "Pre-wash and iron", "Nothing"], correct: 2 },
              { id: 2, question: "What does 'grain line' indicate on a pattern?", options: ["Cutting direction", "Fabric direction", "Sewing order", "Pattern size"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: 4,
        title: "Final Project & Assessment",
        lessons: [
          { id: 10, title: "Project Guidelines", duration: "15 min", type: "video" },
          { id: 11, title: "Common Mistakes to Avoid", duration: "12 min", type: "video" },
          { id: 12, title: "Final Assessment", duration: "15 min", type: "quiz",
            questions: [
              { id: 1, question: "What is the first step in making a garment?", options: ["Cutting fabric", "Taking measurements", "Choosing thread", "Stitching"], correct: 1 },
              { id: 2, question: "How much seam allowance is standard?", options: ["0.5 cm", "1.5 cm", "3 cm", "5 cm"], correct: 1 },
              { id: 3, question: "What should you do if fabric frays easily?", options: ["Use more pins", "Finish the edges", "Cut larger pieces", "Use thicker thread"], correct: 1 },
              { id: 4, question: "Which fabric is best for beginners?", options: ["Silk", "Cotton", "Velvet", "Chiffon"], correct: 1 },
              { id: 5, question: "What is the purpose of basting?", options: ["Permanent stitching", "Temporary holding", "Decoration", "Reinforcement"], correct: 1 }
            ]
          }
        ]
      }
    ],
    learningOutcomes: [
      "Fundamental stitching techniques for hand and machine sewing",
      "Understanding different fabric types and their properties",
      "Pattern reading and accurate cutting techniques",
      "Basic garment construction and alterations"
    ],
    requirements: [
      "No prior experience needed",
      "Access to basic sewing supplies (needle, thread, scissors)",
      "Willingness to practice and learn"
    ]
  },
  "advanced-embroidery": {
    id: "advanced-embroidery",
    title: "Advanced Embroidery",
    description: "Master traditional and modern embroidery techniques for clothing and home decor.",
    image: "/advanced embroydery.jpg",
    duration: "6 weeks",
    category: "Handicrafts",
    instructor: "Meena Sharma",
    level: "Intermediate",
    rating: 4.7,
    reviews: 189,
    modules: [
      {
        id: 1,
        title: "Advanced Stitches",
        lessons: [
          { id: 1, title: "French Knots & Bullion Stitches", duration: "20 min", type: "video" },
          { id: 2, title: "Chain Stitch Variations", duration: "18 min", type: "video" },
          { id: 3, title: "Module 1 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What is the key to perfect French knots?", options: ["Tight tension", "Loose tension", "Number of wraps", "Needle size"], correct: 2 },
              { id: 2, question: "Chain stitch is best used for?", options: ["Filling areas", "Creating lines", "Adding texture", "All of the above"], correct: 3 }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Traditional Indian Embroidery",
        lessons: [
          { id: 4, title: "Chikankari Basics", duration: "25 min", type: "video" },
          { id: 5, title: "Phulkari Techniques", duration: "22 min", type: "video" },
          { id: 6, title: "Module 2 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "Chikankari originated from which state?", options: ["Punjab", "Uttar Pradesh", "Rajasthan", "Gujarat"], correct: 1 },
              { id: 2, question: "Phulkari means?", options: ["Flower work", "Gold work", "Mirror work", "Thread work"], correct: 0 }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "Modern Design Applications",
        lessons: [
          { id: 7, title: "Contemporary Patterns", duration: "20 min", type: "video" },
          { id: 8, title: "Embroidery for Fashion", duration: "25 min", type: "video" },
          { id: 9, title: "Final Assessment", duration: "10 min", type: "quiz",
            questions: [
              { id: 1, question: "What fabric is best for intricate embroidery?", options: ["Cotton", "Silk", "Linen", "All of these"], correct: 3 },
              { id: 2, question: "How do you transfer designs to fabric?", options: ["Tracing paper", "Water-soluble markers", "Iron-on transfers", "All methods work"], correct: 3 },
              { id: 3, question: "What is the most important tool for clean embroidery?", options: ["Sharp scissors", "Good lighting", "Embroidery hoop", "Quality thread"], correct: 2 }
            ]
          }
        ]
      }
    ],
    learningOutcomes: [
      "Master advanced embroidery stitches and techniques",
      "Understand traditional Indian embroidery styles",
      "Create contemporary designs for modern applications",
      "Develop skills for professional embroidery work"
    ],
    requirements: [
      "Basic embroidery knowledge required",
      "Embroidery hoop, needles, and quality threads",
      "Patience and attention to detail"
    ]
  },
  "web-development-basics": {
    id: "web-development-basics",
    title: "Web Development Basics",
    description: "Learn HTML, CSS, and basic JavaScript to build simple websites.",
    image: "/web development.jpg",
    duration: "10 weeks",
    category: "Digital Skills",
    instructor: "Rahul Verma",
    level: "Beginner",
    rating: 4.6,
    reviews: 156,
    modules: [
      {
        id: 1,
        title: "HTML Fundamentals",
        lessons: [
          { id: 1, title: "Introduction to HTML", duration: "15 min", type: "video" },
          { id: 2, title: "HTML Tags and Elements", duration: "20 min", type: "video" },
          { id: 3, title: "HTML Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Management Language"], correct: 0 },
              { id: 2, question: "Which tag is used for headings?", options: ["<head>", "<h1>", "<heading>", "<title>"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "CSS Styling",
        lessons: [
          { id: 4, title: "CSS Basics", duration: "18 min", type: "video" },
          { id: 5, title: "Colors and Layouts", duration: "22 min", type: "video" },
          { id: 6, title: "CSS Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correct: 1 },
              { id: 2, question: "Which property changes text color?", options: ["font-color", "text-color", "color", "text-style"], correct: 2 }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "JavaScript Introduction",
        lessons: [
          { id: 7, title: "JavaScript Basics", duration: "25 min", type: "video" },
          { id: 8, title: "Interactive Elements", duration: "20 min", type: "video" },
          { id: 9, title: "Final Project", duration: "30 min", type: "video" },
          { id: 10, title: "Final Assessment", duration: "10 min", type: "quiz",
            questions: [
              { id: 1, question: "JavaScript is used for?", options: ["Styling", "Interactivity", "Structure", "Images"], correct: 1 },
              { id: 2, question: "How do you declare a variable in JavaScript?", options: ["variable x", "var x", "x =", "let x"], correct: 3 },
              { id: 3, question: "What symbol is used for comments in JavaScript?", options: ["#", "//", "/*", "Both // and /*"], correct: 3 }
            ]
          }
        ]
      }
    ],
    learningOutcomes: [
      "Build complete web pages using HTML",
      "Style websites with CSS for professional appearance",
      "Add interactivity with JavaScript",
      "Create your first portfolio website"
    ],
    requirements: [
      "Basic computer skills",
      "Computer with internet access",
      "No coding experience needed"
    ]
  },
  "digital-marketing-fundamentals": {
    id: "digital-marketing-fundamentals",
    title: "Digital Marketing Fundamentals",
    description: "Learn to promote products and services online using social media and other digital channels.",
    image: "/digital marketing.jpg",
    duration: "6 weeks",
    category: "Digital Skills",
    instructor: "Priya Patel",
    level: "Beginner",
    rating: 4.7,
    reviews: 178,
    modules: [
      {
        id: 1,
        title: "Digital Marketing Overview",
        lessons: [
          { id: 1, title: "What is Digital Marketing?", duration: "12 min", type: "video" },
          { id: 2, title: "Digital Marketing Channels", duration: "18 min", type: "video" },
          { id: 3, title: "Module 1 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "Which is NOT a digital marketing channel?", options: ["Social Media", "Email", "Newspaper Ads", "SEO"], correct: 2 },
              { id: 2, question: "What does SEO stand for?", options: ["Social Engine Optimization", "Search Engine Optimization", "Site Engine Optimization", "Simple Engine Optimization"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Social Media Marketing",
        lessons: [
          { id: 4, title: "Facebook Marketing", duration: "20 min", type: "video" },
          { id: 5, title: "Instagram for Business", duration: "22 min", type: "video" },
          { id: 6, title: "Module 2 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "Best time to post on social media?", options: ["When your audience is active", "Early morning", "Late night", "Anytime"], correct: 0 },
              { id: 2, question: "What makes content go viral?", options: ["Luck", "Quality + Timing + Relevance", "Paid promotion only", "Random chance"], correct: 1 }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "Content & Campaign Creation",
        lessons: [
          { id: 7, title: "Creating Engaging Content", duration: "25 min", type: "video" },
          { id: 8, title: "Running Ad Campaigns", duration: "20 min", type: "video" },
          { id: 9, title: "Final Assessment", duration: "10 min", type: "quiz",
            questions: [
              { id: 1, question: "What is a call-to-action (CTA)?", options: ["A phone call", "An instruction to take action", "A type of ad", "A marketing term"], correct: 1 },
              { id: 2, question: "Which metric measures engagement?", options: ["Impressions", "Clicks", "Likes and Comments", "Reach"], correct: 2 },
              { id: 3, question: "Email marketing is?", options: ["Outdated", "Still effective", "Only for large businesses", "Too expensive"], correct: 1 }
            ]
          }
        ]
      }
    ],
    learningOutcomes: [
      "Understand digital marketing fundamentals",
      "Create effective social media campaigns",
      "Develop engaging content for online audiences",
      "Measure and optimize marketing performance"
    ],
    requirements: [
      "Smartphone or computer with internet",
      "Social media accounts (Facebook, Instagram)",
      "Willingness to learn and experiment"
    ]
  },
  "organic-farming": {
    id: "organic-farming",
    title: "Organic Farming",
    description: "Learn sustainable farming techniques for vegetables and herbs.",
    image: "/organic farming.jpg",
    duration: "8 weeks",
    category: "Agriculture",
    instructor: "Harpreet Kaur",
    level: "All Levels",
    rating: 4.9,
    reviews: 210,
    modules: [
      {
        id: 1,
        title: "Organic Farming Principles",
        lessons: [
          { id: 1, title: "Introduction to Organic Farming", duration: "15 min", type: "video" },
          { id: 2, title: "Soil Health Management", duration: "20 min", type: "video" },
          { id: 3, title: "Module 1 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "What is organic farming?", options: ["Farming without chemicals", "Natural farming methods", "Sustainable agriculture", "All of the above"], correct: 3 },
              { id: 2, question: "Healthy soil contains?", options: ["Organic matter", "Microorganisms", "Nutrients", "All of these"], correct: 3 }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Organic Pest Management",
        lessons: [
          { id: 4, title: "Natural Pest Control", duration: "22 min", type: "video" },
          { id: 5, title: "Companion Planting", duration: "18 min", type: "video" },
          { id: 6, title: "Module 2 Quiz", duration: "5 min", type: "quiz",
            questions: [
              { id: 1, question: "Neem is used as?", options: ["Fertilizer", "Natural pesticide", "Soil amendment", "Water retention"], correct: 1 },
              { id: 2, question: "Companion planting helps with?", options: ["Pest control", "Soil health", "Space utilization", "All of these"], correct: 3 }
            ]
          }
        ]
      },
      {
        id: 3,
        title: "Composting & Water Management",
        lessons: [
          { id: 7, title: "Making Quality Compost", duration: "20 min", type: "video" },
          { id: 8, title: "Water Conservation Techniques", duration: "18 min", type: "video" },
          { id: 9, title: "Final Assessment", duration: "10 min", type: "quiz",
            questions: [
              { id: 1, question: "Compost improves?", options: ["Soil structure", "Nutrient content", "Water retention", "All of these"], correct: 3 },
              { id: 2, question: "Drip irrigation is?", options: ["Water efficient", "Expensive", "Complex", "Not suitable for small farms"], correct: 0 },
              { id: 3, question: "Mulching helps with?", options: ["Weed control", "Moisture retention", "Temperature regulation", "All of these"], correct: 3 }
            ]
          }
        ]
      }
    ],
    learningOutcomes: [
      "Implement sustainable organic farming practices",
      "Manage pests and diseases naturally",
      "Create nutrient-rich compost",
      "Conserve water effectively"
    ],
    requirements: [
      "Access to small plot of land (optional)",
      "Interest in sustainable agriculture",
      "No prior farming experience needed"
    ]
  }
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id || "basic-tailoring";
  
  const [activeTab, setActiveTab] = useState("overview");
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [quizResults, setQuizResults] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const course = COURSES_DATABASE[courseId];

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Course not found 😕</h1>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/dashboard/learn" className="text-blue-600 hover:underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  const progress = (completedLessons.size / totalLessons) * 100;
  const quizCount = course.modules.reduce((sum, mod) => sum + mod.lessons.filter(l => l.type === "quiz").length, 0);
  const allQuizzesPassed = Object.keys(quizResults).length >= quizCount && 
    Object.values(quizResults).every(result => result.passed);

  const handleLessonComplete = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const handleQuizSubmit = () => {
    const quiz = currentQuiz;
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correct++;
      }
    });
    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= 70;
    
    setQuizResults(prev => ({
      ...prev,
      [quiz.id]: { score, passed, correct, total: quiz.questions.length }
    }));
    setShowResults(true);
    
    if (passed) {
      handleLessonComplete(quiz.id);
    }
  };

  const startQuiz = (lesson) => {
    setCurrentQuiz(lesson);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const closeQuiz = () => {
    setCurrentQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const generateCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 800, 600);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', 400, 100);
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.fillText('This is to certify that', 400, 180);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('Student Name', 400, 240);
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.fillText('has successfully completed', 400, 300);
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(course.title, 400, 360);
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.fillText(`Duration: ${course.duration} | Instructor: ${course.instructor}`, 400, 420);
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, 460);
    
    const link = document.createElement('a');
    link.download = `certificate-${course.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/dashboard/learn" className="inline-flex items-center text-blue-200 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          <div className="flex items-center gap-2 text-blue-200 mb-4">
            <span>{course.category}</span>
            <span>•</span>
            <span>{course.level}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              <span>{totalLessons} Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️ {course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👨‍🏫 {course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{course.rating} ({course.reviews} reviews)</span>
            </div>
          </div>
          {!enrolled ? (
            <button 
              onClick={() => setEnrolled(true)}
              className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Enroll Now - Free
            </button>
          ) : (
            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span>Course Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {!enrolled ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Enroll to Access Course Content</h2>
            <p className="text-gray-600 mb-6">Click the "Enroll Now" button above to start learning</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-4 font-semibold ${activeTab === "overview" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("curriculum")}
                    className={`px-6 py-4 font-semibold ${activeTab === "curriculum" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  >
                    Curriculum
                  </button>
                  <button
                    onClick={() => setActiveTab("certificate")}
                    className={`px-6 py-4 font-semibold ${activeTab === "certificate" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  >
                    Certificate
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
                      <p className="text-gray-700 mb-6">{course.description}</p>
                      
                      <h3 className="text-xl font-bold mb-3">What you'll learn</h3>
                      <ul className="space-y-2 mb-6">
                        {course.learningOutcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-xl font-bold mb-3">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {course.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "curriculum" && (
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                      <div className="space-y-4">
                        {course.modules.map((module) => (
                          <div key={module.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 font-semibold border-b">
                              Module {module.id}: {module.title}
                            </div>
                            <div className="divide-y">
                              {module.lessons.map((lesson) => {
                                const isCompleted = completedLessons.has(lesson.id);
                                const isQuiz = lesson.type === "quiz";
                                const quizResult = quizResults[lesson.id];

                                return (
                                  <div key={lesson.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        {isCompleted ? (
                                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        ) : (
                                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                          <div className="font-medium">{lesson.title}</div>
                                          <div className="text-sm text-gray-500">{lesson.duration}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {isQuiz ? (
                                          <>
                                            {quizResult && (
                                              <span className={`text-sm font-semibold ${quizResult.passed ? "text-green-600" : "text-red-600"}`}>
                                                {quizResult.score}%
                                              </span>
                                            )}
                                            <button
                                              onClick={() => startQuiz(lesson)}
                                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                            >
                                              {quizResult ? "Retake" : "Start"} Quiz
                                            </button>
                                          </>
                                        ) : (
                                          <button
                                            onClick={() => handleLessonComplete(lesson.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isCompleted}
                                          >
                                            {isCompleted ? "Completed" : "Mark Complete"}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "certificate" && (
                    <div className="text-center py-8">
                      {allQuizzesPassed && progress === 100 ? (
                        <div>
                          <Award className="w-24 h-24 mx-auto text-yellow-500 mb-4" />
                          <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                          <p className="text-gray-600 mb-6">
                            You've completed the course and passed all assessments
                          </p>
                          <button
                            onClick={generateCertificate}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                          >
                            Download Certificate
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Lock className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                          <h2 className="text-2xl font-bold mb-2">Certificate Locked</h2>
                          <p className="text-gray-600 mb-4">
                            Complete all lessons and pass all quizzes (70%+) to unlock your certificate
                          </p>
                          <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between mb-2 text-sm">
                              <span>Progress: {Math.round(progress)}%</span>
                              <span>Quizzes Passed: {Object.values(quizResults).filter(r => r.passed).length}/{quizCount}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h3 className="font-bold mb-4">Course Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold">{completedLessons.size}/{totalLessons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quizzes Passed</span>
                    <span className="font-semibold">
                      {Object.values(quizResults).filter(r => r.passed).length}/{quizCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Score</span>
                    <span className="font-semibold">
                      {Object.keys(quizResults).length > 0
                        ? Math.round(Object.values(quizResults).reduce((sum, r) => sum + r.score, 0) / Object.keys(quizResults).length)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      {currentQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{currentQuiz.title}</h2>
                <button onClick={closeQuiz} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
              </div>
              <p className="text-gray-600 mt-1">Pass mark: 70%</p>
            </div>
            
            <div className="p-6">
              {!showResults ? (
                <div className="space-y-6">
                  {currentQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-lg p-4">
                      <div className="font-semibold mb-3">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => (
                          <label key={optIdx} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              checked={selectedAnswers[idx] === optIdx}
                              onChange={() => setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                              className="w-4 h-4"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length !== currentQuiz.questions.length}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Quiz
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  {quizResults[currentQuiz.id].passed ? (
                    <div>
                      <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-4" />
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Passed! 🎉</h3>
                      <p className="text-xl mb-4">
                        Score: {quizResults[currentQuiz.id].score}%
                      </p>
                      <p className="text-gray-600 mb-6">
                        You got {quizResults[currentQuiz.id].correct} out of {quizResults[currentQuiz.id].total} questions correct
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">😔</span>
                      </div>
                      <h3 className="text-2xl font-bold text-red-600 mb-2">Not Quite There</h3>
                      <p className="text-xl mb-4">
                        Score: {quizResults[currentQuiz.id].score}%
                      </p>
                      <p className="text-gray-600 mb-6">
                        You need 70% to pass. Review the lessons and try again!
                      </p>
                    </div>
                  )}
                  <button
                    onClick={closeQuiz}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}