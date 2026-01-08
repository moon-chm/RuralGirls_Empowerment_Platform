"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFirebase } from "@/lib/firebase/firebase-provider"
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"
import {
  Briefcase,
  FileText,
  Search,
  Calendar,
  MapPin,
  Building,
  Sparkles,
  Bell,
  CheckCircle,
  ArrowRight,
  Bookmark,
  ExternalLink,
  Plus,
  Download,
  X,
  Edit,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Job = {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship" | "remote"
  salary: string
  description: string
  requirements: string[]
  postedDate: any
  applicationDeadline: any
  logo: string
  url: string
}

type Scholarship = {
  id: string
  name: string
  organization: string
  amount: string
  deadline: any
  eligibility: string
  description: string
  url: string
}

type Application = {
  id: string
  jobId: string
  jobTitle: string
  company: string
  status: "draft" | "applied" | "interview" | "offer" | "rejected"
  appliedDate: any
  notes: string
}

type Education = {
  id: string
  degree: string
  institution: string
  startYear: string
  endYear: string
  description?: string
}

type Experience = {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

type ResumeData = {
  name: string
  email: string
  phone: string
  address?: string
  summary: string
  skills: string[]
  education: Education[]
  experience: Experience[]
  autoUpdate: boolean
}

export default function CareerPage() {
  const { user, db } = useFirebase()
  const { toast } = useToast()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [careerPaths, setCareerPaths] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [jobAlerts, setJobAlerts] = useState(false)

  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    skills: [],
    education: [],
    experience: [],
    autoUpdate: false,
  })

  const [newSkill, setNewSkill] = useState("")
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [showEducationDialog, setShowEducationDialog] = useState(false)
  const [showExperienceDialog, setShowExperienceDialog] = useState(false)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applicationNotes, setApplicationNotes] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
          setJobAlerts(userDoc.data().jobAlerts || false)
        }

        await fetchJobs()
        await fetchScholarships()
        await fetchApplications()
        await fetchSavedJobs()
        await fetchResumeData()
        generateCareerPaths()
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, db])

  const fetchJobs = async () => {
    const sampleJobs: Job[] = [
      {
        id: "job1",
        title: "Digital Marketing Assistant",
        company: "TechGrow Solutions",
        location: "Remote",
        type: "part-time",
        salary: "₹15,000 - ₹20,000/month",
        description: "Assist in managing social media accounts, create content, and analyze campaign performance.",
        requirements: ["Basic computer skills", "Social media knowledge", "Good communication"],
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        logo: "/digi.png",
        url: "#",
      },
      {
        id: "job2",
        title: "Junior Web Developer",
        company: "CodeCraft India",
        location: "Bangalore",
        type: "full-time",
        salary: "₹25,000 - ₹35,000/month",
        description: "Develop and maintain websites using HTML, CSS, and JavaScript. Work with senior developers to implement new features.",
        requirements: ["HTML/CSS", "Basic JavaScript", "Responsive design knowledge"],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        logo: "/dev.png",
        url: "#",
      },
      {
        id: "job3",
        title: "Data Entry Operator",
        company: "Rural Business Network",
        location: "Hybrid",
        type: "contract",
        salary: "₹12,000 - ₹15,000/month",
        description: "Input and process information into databases. Verify data accuracy and maintain records.",
        requirements: ["Typing skills", "Attention to detail", "Basic Excel knowledge"],
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        logo: "/data.jpeg",
        url: "#",
      },
      {
        id: "job4",
        title: "E-commerce Assistant",
        company: "Village Crafts Collective",
        location: "Remote",
        type: "part-time",
        salary: "₹10,000 - ₹18,000/month",
        description: "Help manage online store, process orders, and coordinate with artisans for product listings.",
        requirements: ["Basic computer skills", "Good communication", "Organization skills"],
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        logo: "/ec.jpeg",
        url: "#",
      },
      {
        id: "job5",
        title: "Content Creator Intern",
        company: "Digital India Foundation",
        location: "Delhi",
        type: "internship",
        salary: "₹8,000 - ₹12,000/month",
        description: "Create engaging content for social media, blog posts, and educational materials.",
        requirements: ["Creative writing", "Basic design skills", "Social media familiarity"],
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        logo: "/cr.png",
        url: "#",
      },
    ]
    setJobs(sampleJobs)
  }

  const fetchScholarships = async () => {
    const sampleScholarships: Scholarship[] = [
      {
        id: "sch1",
        name: "Digital Skills Scholarship for Rural Women",
        organization: "Tech Empowerment Foundation",
        amount: "₹50,000",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibility: "Women from rural areas pursuing digital skills education",
        description: "Scholarship to support women from rural areas in gaining digital skills through certified courses.",
        url: "#",
      },
      {
        id: "sch2",
        name: "Entrepreneurship Grant for Young Women",
        organization: "Women Business Alliance",
        amount: "₹75,000",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eligibility: "Women aged 18-35 with business ideas",
        description: "Financial support for young women entrepreneurs to start or grow their businesses.",
        url: "#",
      },
      {
        id: "sch3",
        name: "Coding Bootcamp Scholarship",
        organization: "CodeHers Initiative",
        amount: "Full Tuition Coverage",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: "Women with basic computer knowledge interested in programming",
        description: "Full scholarship for a 12-week intensive coding bootcamp with job placement assistance.",
        url: "#",
      },
    ]
    setScholarships(sampleScholarships)
  }

  const fetchApplications = async () => {
    if (!user) return
    try {
      const q = query(collection(db, "applications"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const apps: Application[] = []
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as Application)
      })
      setApplications(apps)
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  const fetchSavedJobs = async () => {
    if (!user) return
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        setSavedJobs(userDoc.data().savedJobs || [])
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error)
    }
  }

  const fetchResumeData = async () => {
    if (!user) return
    try {
      const resumeDoc = await getDoc(doc(db, "resumes", user.uid))
      if (resumeDoc.exists()) {
        setResumeData(resumeDoc.data() as ResumeData)
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
    }
  }

  const generateCareerPaths = () => {
    const sampleCareerPaths = [
      {
        id: "path1",
        title: "Digital Marketing Specialist",
        description: "Build skills in social media management, content creation, and digital advertising to help businesses grow their online presence.",
        matchScore: 92,
        skills: ["Social Media Management", "Content Creation", "Analytics", "SEO Basics"],
        courses: ["Digital Marketing Fundamentals", "Social Media Strategy", "Content Creation Workshop"],
        averageSalary: "₹25,000 - ₹45,000/month",
        growthPotential: "High",
        icon: <Sparkles className="h-8 w-8 text-purple-500" />,
      },
      {
        id: "path2",
        title: "E-commerce Entrepreneur",
        description: "Start and grow your own online business selling products or services, leveraging digital platforms to reach customers.",
        matchScore: 85,
        skills: ["Product Management", "Customer Service", "Basic Accounting", "Digital Marketing"],
        courses: ["E-commerce Fundamentals", "Product Photography", "Online Store Management"],
        averageSalary: "Variable based on business success",
        growthPotential: "Very High",
        icon: <Briefcase className="h-8 w-8 text-green-500" />,
      },
      {
        id: "path3",
        title: "Web Developer",
        description: "Learn to build and maintain websites and web applications using coding skills that are in high demand.",
        matchScore: 78,
        skills: ["HTML/CSS", "JavaScript", "Responsive Design", "Basic Backend"],
        courses: ["Web Development Basics", "JavaScript Fundamentals", "Building Responsive Websites"],
        averageSalary: "₹30,000 - ₹60,000/month",
        growthPotential: "High",
        icon: <FileText className="h-8 w-8 text-blue-500" />,
      },
    ]
    setCareerPaths(sampleCareerPaths)
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = jobTypeFilter === "all" || job.type === jobTypeFilter
    const matchesLocation = locationFilter === "all" || job.location.toLowerCase() === locationFilter.toLowerCase()
    return matchesSearch && matchesType && matchesLocation
  })

  const handleSaveJob = async (jobId: string) => {
    if (!user) return
    try {
      const newSavedJobs = savedJobs.includes(jobId)
        ? savedJobs.filter((id) => id !== jobId)
        : [...savedJobs, jobId]
      
      await updateDoc(doc(db, "users", user.uid), {
        savedJobs: newSavedJobs
      })
      
      setSavedJobs(newSavedJobs)
      toast({
        title: savedJobs.includes(jobId) ? "Job Removed" : "Job Saved",
        description: savedJobs.includes(jobId) ? "Job removed from bookmarks" : "Job saved to bookmarks",
      })
    } catch (error) {
      console.error("Error saving job:", error)
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      })
    }
  }

  const handleApplyJob = (job: Job) => {
    setSelectedJob(job)
    setShowApplicationDialog(true)
  }

  const submitApplication = async () => {
    if (!user || !selectedJob) return
    try {
      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        status: "applied",
        appliedDate: new Date(),
        notes: applicationNotes,
      })
      
      await fetchApplications()
      setShowApplicationDialog(false)
      setApplicationNotes("")
      setSelectedJob(null)
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      })
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      })
    }
  }

  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "applications", appId), {
        status: newStatus
      })
      await fetchApplications()
      toast({
        title: "Status Updated",
        description: "Application status has been updated",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const deleteApplication = async (appId: string) => {
    try {
      await deleteDoc(doc(db, "applications", appId))
      await fetchApplications()
      toast({
        title: "Application Deleted",
        description: "Application has been removed",
      })
    } catch (error) {
      console.error("Error deleting application:", error)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()]
      })
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const saveEducation = (education: Education) => {
    if (editingEducation) {
      setResumeData({
        ...resumeData,
        education: resumeData.education.map(edu => 
          edu.id === education.id ? education : edu
        )
      })
    } else {
      setResumeData({
        ...resumeData,
        education: [...resumeData.education, { ...education, id: Date.now().toString() }]
      })
    }
    setShowEducationDialog(false)
    setEditingEducation(null)
  }

  const deleteEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    })
  }

  const saveExperience = (experience: Experience) => {
    if (editingExperience) {
      setResumeData({
        ...resumeData,
        experience: resumeData.experience.map(exp => 
          exp.id === experience.id ? experience : exp
        )
      })
    } else {
      setResumeData({
        ...resumeData,
        experience: [...resumeData.experience, { ...experience, id: Date.now().toString() }]
      })
    }
    setShowExperienceDialog(false)
    setEditingExperience(null)
  }

  const deleteExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    })
  }

  const saveResume = async () => {
    if (!user) return
    try {
      await setDoc(doc(db, "resumes", user.uid), resumeData)
      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully",
      })
    } catch (error) {
      console.error("Error saving resume:", error)
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      })
    }
  }

  const generatePDF = () => {
    const printContent = document.getElementById('resume-preview')
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.name || 'Resume'} - Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            .resume { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
            .header h1 { font-size: 32px; margin-bottom: 10px; color: #1e40af; font-weight: bold; }
            .contact { font-size: 14px; color: #666; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 20px; color: #1e40af; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold; }
            .summary { font-size: 14px; line-height: 1.8; color: #555; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill { background: #dbeafe; padding: 6px 12px; border-radius: 4px; font-size: 13px; color: #1e40af; }
            .item { margin-bottom: 20px; }
            .item-header { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: flex-start; }
            .item-title { font-weight: bold; font-size: 16px; color: #1e40af; }
            .item-subtitle { color: #666; font-size: 14px; }
            .item-date { color: #888; font-size: 13px; white-space: nowrap; margin-left: 16px; }
            .item-description { font-size: 14px; color: #555; margin-top: 5px; line-height: 1.6; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const toggleJobAlerts = async () => {
    if (!user) return
    try {
      await updateDoc(doc(db, "users", user.uid), {
        jobAlerts: !jobAlerts
      })
      setJobAlerts(!jobAlerts)
      toast({
        title: jobAlerts ? "Job Alerts Disabled" : "Job Alerts Enabled",
        description: jobAlerts ? "You will no longer receive job alerts" : "You will receive notifications for new jobs",
      })
    } catch (error) {
      console.error("Error toggling job alerts:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Career & Jobs</h1>
          <p className="text-gray-500">Discover opportunities and build your career path</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="btn-glow" onClick={toggleJobAlerts}>
            <Bell className="mr-2 h-4 w-4" />
            Job Alerts {jobAlerts && "✓"}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 btn-glow" onClick={() => setShowPreview(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Build Resume
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse-slow" />
            <CardTitle>AI Career Path Suggestions</CardTitle>
          </div>
          <CardDescription>Personalized career paths based on your skills, interests, and profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <Card key={path.id} className="card-hover-effect border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <div className="p-2 bg-primary/10 rounded-full">{path.icon}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-primary/90">{path.matchScore}% Match</Badge>
                    <Badge variant="outline">Growth: {path.growthPotential}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 mb-4">{path.description}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Key Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {path.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Recommended Courses</p>
                      <ul className="text-sm space-y-1">
                        {path.courses.map((course, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Average Salary</p>
                      <p className="text-sm font-medium">{path.averageSalary}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90 btn-glow">
                    Explore This Path
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="jobs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="applications">My Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="resume">Resume Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input placeholder="Search jobs by title, company, or keywords" className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger><SelectValue placeholder="Job Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredJobs.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No Jobs Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search filters or check back later for new opportunities.</p>
                <Button onClick={() => { setSearchTerm(""); setJobTypeFilter("all"); setLocationFilter("all"); }} className="bg-primary hover:bg-primary/90">Clear Filters</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="card-hover-effect">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                          <img src={job.logo || "/placeholder.svg?height=50&width=50"} alt={job.company} className="w-12 h-12 object-contain" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Badge className={job.type === "full-time" ? "bg-blue-500" : job.type === "part-time" ? "bg-green-500" : job.type === "contract" ? "bg-amber-500" : job.type === "internship" ? "bg-purple-500" : "bg-teal-500"}>
                              {job.type.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-50">{job.salary}</Badge>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1"><Building className="h-4 w-4" />{job.company}</div>
                          <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</div>
                          <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />Posted {new Date(job.postedDate).toLocaleDateString()}</div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Requirements:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-50">{req}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-3 mt-4">
                          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 btn-glow" onClick={() => handleApplyJob(job)}>Apply Now</Button>
                          <Button variant="outline" className="w-full md:w-auto" onClick={() => handleSaveJob(job.id)}>
                            <Bookmark className={`mr-2 h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            {savedJobs.includes(job.id) ? 'Saved' : 'Save Job'}
                          </Button>
                          <Button variant="link" className="w-full md:w-auto" asChild>
                            <a href={job.url} target="_blank" rel="noopener noreferrer">View Details<ExternalLink className="ml-2 h-4 w-4" /></a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scholarships" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="card-hover-effect">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                    <Badge className="bg-primary/90">{scholarship.amount}</Badge>
                  </div>
                  <CardDescription>{scholarship.organization}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-gray-600 mb-4">{scholarship.description}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Eligibility</p>
                      <p className="text-sm">{scholarship.eligibility}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Application Deadline</p>
                      <p className="text-sm">{new Date(scholarship.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full flex flex-col md:flex-row gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 btn-glow">Apply Now</Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={scholarship.url} target="_blank" rel="noopener noreferrer">Learn More<ExternalLink className="ml-2 h-4 w-4" /></a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          {applications.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4"><FileText className="h-8 w-8 text-primary" /></div>
                <h3 className="text-xl font-medium mb-2">No Applications Yet</h3>
                <p className="text-gray-500 mb-4">Start applying for jobs to track your applications here.</p>
                <Button className="bg-primary hover:bg-primary/90">Browse Jobs</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium">{application.jobTitle}</h3>
                        <p className="text-sm text-gray-500">{application.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={application.status === "draft" ? "bg-gray-500" : application.status === "applied" ? "bg-blue-500" : application.status === "interview" ? "bg-amber-500" : application.status === "offer" ? "bg-green-500" : "bg-red-500"}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-500">Applied on {new Date(application.appliedDate.toDate ? application.appliedDate.toDate() : application.appliedDate).toLocaleDateString()}</span>
                        </div>
                        {application.notes && <p className="text-sm text-gray-600 mt-2">{application.notes}</p>}
                      </div>
                      <div className="flex gap-2 mt-3 md:mt-0">
                        <Select value={application.status} onValueChange={(value) => updateApplicationStatus(application.id, value)}>
                          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="offer">Offer</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => deleteApplication(application.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resume" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>AI-Powered Resume Builder</CardTitle>
              </div>
              <CardDescription>Create a professional resume with AI assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" placeholder="Your full name" value={resumeData.name} onChange={(e) => setResumeData({...resumeData, name: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" value={resumeData.email} onChange={(e) => setResumeData({...resumeData, email: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" placeholder="+91 98765 43210" value={resumeData.phone} onChange={(e) => setResumeData({...resumeData, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="City, State" value={resumeData.address} onChange={(e) => setResumeData({...resumeData, address: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea id="summary" placeholder="Brief overview of your skills and experience" rows={4} value={resumeData.summary} onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2"><Label>Skills</Label></div>
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="Add a skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addSkill()} />
                      <Button onClick={addSkill} size="sm"><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[60px]">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}<button className="ml-1 text-gray-500 hover:text-gray-700" onClick={() => removeSkill(skill)}>×</button></Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Education</Label>
                      <Button variant="outline" size="sm" onClick={() => { setEditingEducation(null); setShowEducationDialog(true); }}><Plus className="h-4 w-4 mr-1" />Add</Button>
                    </div>
                    <div className="space-y-2">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-sm text-gray-500">{edu.institution}</p>
                              <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear}</p>
                              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => { setEditingEducation(edu); setShowEducationDialog(true); }}><Edit className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteEducation(edu.id)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Experience</Label>
                      <Button variant="outline" size="sm" onClick={() => { setEditingExperience(null); setShowExperienceDialog(true); }}><Plus className="h-4 w-4 mr-1" />Add</Button>
                    </div>
                    <div className="space-y-2">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="p-3 border rounded-md">
                          <div className="flex justify-between mb-1">
                            <div className="flex-1">
                              <p className="font-medium">{exp.title}</p>
                              <p className="text-sm text-gray-500">{exp.company}</p>
                              <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                              <p className="text-sm mt-1">{exp.description}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => { setEditingExperience(exp); setShowExperienceDialog(true); }}><Edit className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteExperience(exp.id)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Switch id="auto-update" checked={resumeData.autoUpdate} onCheckedChange={(checked) => setResumeData({...resumeData, autoUpdate: checked})} />
                    <Label htmlFor="auto-update">Automatically update my resume with new skills and experiences</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setShowPreview(true)}>Preview Resume</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generatePDF}><Download className="mr-2 h-4 w-4" />Download PDF</Button>
                <Button className="bg-primary hover:bg-primary/90 btn-glow" onClick={saveResume}>Save Resume</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEducationDialog} onOpenChange={setShowEducationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEducation ? 'Edit' : 'Add'} Education</DialogTitle>
            <DialogDescription>Fill in your educational details</DialogDescription>
          </DialogHeader>
          <EducationForm education={editingEducation} onSave={saveEducation} onCancel={() => { setShowEducationDialog(false); setEditingEducation(null); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExperience ? 'Edit' : 'Add'} Experience</DialogTitle>
            <DialogDescription>Fill in your work experience details</DialogDescription>
          </DialogHeader>
          <ExperienceForm experience={editingExperience} onSave={saveExperience} onCancel={() => { setShowExperienceDialog(false); setEditingExperience(null); }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>at {selectedJob?.company}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Application Notes</Label>
              <Textarea placeholder="Add any notes about this application..." value={applicationNotes} onChange={(e) => setApplicationNotes(e.target.value)} rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>Cancel</Button>
            <Button onClick={submitApplication} className="bg-primary hover:bg-primary/90">Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Resume Preview</DialogTitle></DialogHeader>
          <div id="resume-preview" className="bg-white p-8"><ResumePreview data={resumeData} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Close</Button>
            <Button onClick={generatePDF} className="bg-primary hover:bg-primary/90"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EducationForm({ education, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(education || { id: '', degree: '', institution: '', startYear: '', endYear: '', description: '' })
  return (
    <div className="space-y-4">
      <div><Label>Degree/Certification *</Label><Input placeholder="e.g., High School Diploma" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} /></div>
      <div><Label>Institution *</Label><Input placeholder="e.g., ABC High School" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Start Year *</Label><Input placeholder="2018" value={formData.startYear} onChange={(e) => setFormData({...formData, startYear: e.target.value})} /></div>
        <div><Label>End Year *</Label><Input placeholder="2020" value={formData.endYear} onChange={(e) => setFormData({...formData, endYear: e.target.value})} /></div>
      </div>
      <div><Label>Description (Optional)</Label><Textarea placeholder="Additional details..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)} disabled={!formData.degree || !formData.institution || !formData.startYear || !formData.endYear}>Save</Button>
      </DialogFooter>
    </div>
  )
}

function ExperienceForm({ experience, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(experience || { id: '', title: '', company: '', startDate: '', endDate: '', current: false, description: '' })
  return (
    <div className="space-y-4">
      <div><Label>Job Title *</Label><Input placeholder="e.g., Sales Associate" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
      <div><Label>Company *</Label><Input placeholder="e.g., ABC Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Start Date *</Label><Input placeholder="Jan 2021" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} /></div>
        <div><Label>End Date {!formData.current && '*'}</Label><Input placeholder="Dec 2023" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} disabled={formData.current} /></div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={formData.current} onCheckedChange={(checked) => setFormData({...formData, current: checked, endDate: checked ? '' : formData.endDate})} />
        <Label>I currently work here</Label>
      </div>
      <div><Label>Description *</Label><Textarea placeholder="Describe your responsibilities and achievements..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} /></div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)} disabled={!formData.title || !formData.company || !formData.startDate || (!formData.current && !formData.endDate) || !formData.description}>Save</Button>
      </DialogFooter>
    </div>
  )
}

function ResumePreview({ data }: { data: ResumeData }) {
  return (
    <div className="resume">
      <div className="header">
        <h1>{data.name || 'Your Name'}</h1>
        <div className="contact">
          {data.email && <span>{data.email}</span>}
          {data.email && data.phone && <span> | </span>}
          {data.phone && <span>{data.phone}</span>}
          {(data.email || data.phone) && data.address && <span> | </span>}
          {data.address && <span>{data.address}</span>}
        </div>
      </div>
      {data.summary && (<div className="section"><h2 className="section-title">Professional Summary</h2><p className="summary">{data.summary}</p></div>)}
      {data.skills.length > 0 && (<div className="section"><h2 className="section-title">Skills</h2><div className="skills">{data.skills.map((skill, index) => (<span key={index} className="skill">{skill}</span>))}</div></div>)}
      {data.experience.length > 0 && (<div className="section"><h2 className="section-title">Work Experience</h2>{data.experience.map((exp) => (<div key={exp.id} className="item"><div className="item-header"><div><div className="item-title">{exp.title}</div><div className="item-subtitle">{exp.company}</div></div><div className="item-date">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div></div><p className="item-description">{exp.description}</p></div>))}</div>)}
      {data.education.length > 0 && (<div className="section"><h2 className="section-title">Education</h2>{data.education.map((edu) => (<div key={edu.id} className="item"><div className="item-header"><div><div className="item-title">{edu.degree}</div><div className="item-subtitle">{edu.institution}</div></div><div className="item-date">{edu.startYear} - {edu.endYear}</div></div>{edu.description && <p className="item-description">{edu.description}</p>}</div>))}</div>)}
    </div>
  )
}