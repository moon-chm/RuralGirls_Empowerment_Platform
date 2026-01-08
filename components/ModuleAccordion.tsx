"use client";
import { FC, useState, useEffect } from "react";
import { CourseModule } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Lock,
  Play,
  FileText,
  Video,
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";

interface ModuleAccordionProps {
  modules: CourseModule[];
  onComplete?: (moduleId: string, itemId: string) => void;
  onItemClick?: (moduleId: string, itemId: string) => void;
  autoExpandFirst?: boolean;
}

const ModuleAccordion: FC<ModuleAccordionProps> = ({ 
  modules, 
  onComplete,
  onItemClick,
  autoExpandFirst = true 
}) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [completingItem, setCompletingItem] = useState<string | null>(null);

  useEffect(() => {
    if (autoExpandFirst && modules.length > 0 && !expandedModule) {
      // Auto-expand first incomplete module or first module
      const firstIncomplete = modules.find(m => 
        m.items.some(item => !item.completed)
      );
      setExpandedModule(firstIncomplete?.id || modules[0].id);
    }
  }, [modules, autoExpandFirst, expandedModule]);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleComplete = async (moduleId: string, itemId: string) => {
    setCompletingItem(itemId);
    if (onComplete) {
      await onComplete(moduleId, itemId);
    }
    setTimeout(() => setCompletingItem(null), 500);
  };

  const handleItemClick = (moduleId: string, itemId: string, isLocked: boolean) => {
    if (!isLocked && onItemClick) {
      onItemClick(moduleId, itemId);
    }
  };

  const calculateModuleProgress = (module: CourseModule) => {
    if (!module.items.length) return 0;
    const completed = module.items.filter(item => item.completed).length;
    return Math.round((completed / module.items.length) * 100);
  };

  const getItemIcon = (type?: string, completed?: boolean) => {
    if (completed) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    
    switch (type) {
      case "video":
        return <Video className="w-5 h-5 text-blue-500" />;
      case "quiz":
        return <FileText className="w-5 h-5 text-purple-500" />;
      case "assignment":
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  const isItemLocked = (module: CourseModule, itemIndex: number) => {
    // Lock items if previous items in the module are not completed
    if (itemIndex === 0) return false;
    return !module.items[itemIndex - 1].completed;
  };

  return (
    <div className="space-y-3">
      {modules.map((module, moduleIndex) => {
        const progress = calculateModuleProgress(module);
        const isExpanded = expandedModule === module.id;
        const completedCount = module.items.filter(i => i.completed).length;
        const totalCount = module.items.length;
        const isModuleComplete = completedCount === totalCount;

        return (
          <Card 
            key={module.id} 
            className={`transition-all duration-200 ${
              isExpanded 
                ? "shadow-md border-blue-300" 
                : "shadow-sm hover:shadow-md"
            } ${isModuleComplete ? "border-green-300 bg-green-50/30" : ""}`}
          >
            <CardContent className="p-0">
              {/* Module Header */}
              <div
                className={`flex justify-between items-center cursor-pointer p-5 transition-colors ${
                  isExpanded ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {moduleIndex + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">
                      {module.title}
                    </h3>
                    {isModuleComplete && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="ml-11">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {completedCount} of {totalCount} completed
                      </span>
                      <span className="font-semibold text-gray-700">
                        {progress}%
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                    />
                  </div>

                  {/* Module Description */}
                  {module.description && (
                    <p className="ml-11 mt-2 text-sm text-gray-600">
                      {module.description}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModule(module.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Module Items */}
              {isExpanded && (
                <div className="px-5 pb-4">
                  <div className="space-y-2 mt-4">
                    {module.items.map((item, itemIndex) => {
                      const locked = isItemLocked(module, itemIndex);
                      const isCompleting = completingItem === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`flex justify-between items-center p-4 rounded-lg border transition-all ${
                            item.completed
                              ? "bg-green-50 border-green-200"
                              : locked
                              ? "bg-gray-50 border-gray-200 opacity-60"
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          } ${!locked && onItemClick ? "cursor-pointer" : ""}`}
                          onClick={() => handleItemClick(module.id, item.id, locked)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {/* Item Icon */}
                            <div className="flex-shrink-0">
                              {locked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                getItemIcon(item.type, item.completed)
                              )}
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${
                                item.completed 
                                  ? "text-green-700" 
                                  : locked 
                                  ? "text-gray-400" 
                                  : "text-gray-900"
                              }`}>
                                {item.title}
                              </p>
                              
                              <div className="flex items-center gap-3 mt-1">
                                {item.duration && (
                                  <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {item.duration}
                                  </span>
                                )}
                                {item.type && (
                                  <span className="text-xs text-gray-500 capitalize">
                                    {item.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex-shrink-0 ml-4">
                            {locked ? (
                              <span className="text-xs text-gray-400">Locked</span>
                            ) : item.completed ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <Check className="w-5 h-5" />
                                <span className="text-sm font-medium hidden sm:inline">
                                  Completed
                                </span>
                              </div>
                            ) : onComplete ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isCompleting}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplete(module.id, item.id);
                                }}
                                className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                              >
                                {isCompleting ? (
                                  "Completing..."
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">Mark Complete</span>
                                    <span className="sm:hidden">Done</span>
                                  </>
                                )}
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModuleAccordion;