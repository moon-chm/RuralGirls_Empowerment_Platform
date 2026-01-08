"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import html2canvas from "html2canvas";
import { Download, ArrowLeft } from "lucide-react";
import { useFirebase } from "@/lib/firebase/firebase-provider";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function CertificatePage() {
  const { id } = useParams(); // courseId
  const { user, db, loading } = useFirebase();
  const [userName, setUserName] = useState("Student Name");
  const [course, setCourse] = useState<any>(null);
  const [completionDate, setCompletionDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load course + check enrollment
  useEffect(() => {
    const loadData = async () => {
      if (!db || !user || !id) return;

      // 1. Load course info
      const courseSnap = await getDoc(doc(db, "courses", id as string));
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() });
      }

      // 2. Load user enrollment to check completion
      const enrollSnap = await getDoc(doc(db, "users", user.uid, "enrollments", id as string));
      if (enrollSnap.exists()) {
        const data = enrollSnap.data();
        if (data.progress === 100) {
          const completed = data.updatedAt?.toDate?.() || new Date();
          setCompletionDate(
            completed.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        } else {
          alert("You need to complete the course before downloading your certificate.");
          router.push(`/courses/${id}`);
        }
      } else {
        alert("You are not enrolled in this course.");
        router.push(`/courses/${id}`);
      }

      // 3. Load stored name
      const storedName = localStorage.getItem("userName");
      if (storedName) setUserName(storedName);
    };

    loadData();
  }, [db, user, id, router]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsLoading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${course?.title.replace(/\s+/g, "_")}_Certificate.png`;
      link.click();
    } catch (err) {
      console.error("Error generating certificate:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link
          href={`/courses/${id}`}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Course
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Certificate of Completion</h1>
        <p className="text-gray-600">
          Congratulations {userName}! You’ve successfully completed <strong>{course.title}</strong>.
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <input
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            localStorage.setItem("userName", e.target.value);
          }}
          className="w-full max-w-sm mb-4 px-3 py-2 border rounded-md text-center"
          placeholder="Enter your name"
        />
        <Button onClick={handleDownload} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Download Certificate"}
        </Button>
      </div>

      <div className="flex justify-center">
        <div ref={certificateRef} className="bg-white border p-10 rounded-lg shadow-md w-full max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-2">SkillBoost Academy</h2>
          <h1 className="text-3xl font-extrabold mb-6">Certificate of Completion</h1>

          <p className="text-lg">This certifies that</p>
          <h2 className="text-3xl font-serif my-4 text-purple-700">{userName}</h2>

          <p className="text-lg">has successfully completed the course</p>
          <h3 className="text-2xl font-bold my-4">{course.title}</h3>

          <p className="text-gray-600">
            Duration: {course.duration || "N/A"} • Category: {course.category || "General"}
          </p>

          {completionDate && (
            <p className="text-sm mt-4 text-gray-500">Completed on {completionDate}</p>
          )}

          <div className="flex justify-between items-center mt-10 px-10">
            <div className="text-center">
              <div className="h-px bg-gray-800 w-40 mb-2"></div>
              <p className="font-medium text-sm">Student Signature</p>
            </div>
            <div className="text-center">
              <div className="h-px bg-gray-800 w-40 mb-2"></div>
              <p className="font-medium text-sm">Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
