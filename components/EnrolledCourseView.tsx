"use client";
import { FC, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Award, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import ModuleAccordion from "@/components/ModuleAccordion";
import { CourseModule } from "@/lib/types";

interface EnrolledCourseViewProps {
  progress: number;
  courseId: string;
  nextLesson?: {
    title: string;
    duration: string;
    moduleTitle?: string;
  };
  modules: CourseModule[];
  onComplete?: (moduleId: string, itemId: string) => void;
  completedLessons?: number;
  totalLessons?: number;
  estimatedTimeRemaining?: string;
  lastAccessedDate?: string;
}

const EnrolledCourseView: FC<EnrolledCourseViewProps> = ({
  progress,
  courseId,
  nextLesson,
  modules,
  onComplete,
  completedLessons = 0,
  totalLessons = 0,
  estimatedTimeRemaining,
  lastAccessedDate,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    // Simulate navigation or lesson loading
    setTimeout(() => setIsLoading(false), 500);
  };

  const getProgressColor = () => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getProgressMessage = () => {
    if (progress === 100) return "Congratulations! Course completed!";
    if (progress >= 75) return "You're almost there! Keep going!";
    if (progress >= 50) return "Great progress! You're halfway through!";
    if (progress >= 25) return "Nice start! Keep up the momentum!";
    return "Let's get started on your learning journey!";
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Progress Overview Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{getProgressMessage()}</p>
            </div>
            {progress === 100 && (
              <Award className="w-12 h-12 text-yellow-500" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">{progress}% completed</span>
              {totalLessons > 0 && (
                <span className="text-gray-600">
                  {completedLessons} of {totalLessons} lessons
                </span>
              )}
            </div>
            <Progress 
              value={progress} 
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-blue-200">
            {estimatedTimeRemaining && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Time Remaining</p>
                  <p className="text-sm font-semibold text-gray-900">{estimatedTimeRemaining}</p>
                </div>
              </div>
            )}
            {lastAccessedDate && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Last Accessed</p>
                  <p className="text-sm font-semibold text-gray-900">{lastAccessedDate}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Lesson Card */}
      {nextLesson && progress < 100 && (
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900">Continue Learning</h4>
                </div>
                {nextLesson.moduleTitle && (
                  <p className="text-xs text-gray-500 mb-1">{nextLesson.moduleTitle}</p>
                )}
                <p className="text-base font-medium text-gray-800 mb-1">{nextLesson.title}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{nextLesson.duration}</span>
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleContinue}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Continue
                    <Play className="w-4 h-4 fill-current" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Completion Card */}
      {progress === 100 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
          <CardContent className="p-6 text-center">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Course Completed!</h3>
            <p className="text-gray-600 mb-4">
              Congratulations on completing this course. You've earned your certificate!
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Download Certificate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Course Modules Section */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
            {totalLessons > 0 && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                {modules.length} {modules.length === 1 ? 'Module' : 'Modules'}
              </span>
            )}
          </div>
        </div>
        <ModuleAccordion modules={modules} onComplete={onComplete} />
      </div>
    </div>
  );
};

export default EnrolledCourseView;