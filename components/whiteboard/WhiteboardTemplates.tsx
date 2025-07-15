import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Grid,
  FileText,
  Calculator,
  Brain,
  Target,
  BookOpen,
  Lightbulb,
  Ruler,
  Compass,
  Square,
  Circle,
  Triangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  elements: any[];
  thumbnail: string;
}

interface WhiteboardTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

const templates: Template[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start with a clean slate",
    icon: FileText,
    category: "basic",
    elements: [],
    thumbnail: "/templates/blank.png",
  },
  {
    id: "math-grid",
    name: "Math Grid",
    description: "Perfect for equations and calculations",
    icon: Calculator,
    category: "academic",
    elements: [
      {
        id: "grid-1",
        type: "shape",
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 750, y: 550 },
        color: "#e0e0e0",
        strokeWidth: 1,
        fillColor: "transparent",
      },
    ],
    thumbnail: "/templates/math-grid.png",
  },
  {
    id: "flowchart",
    name: "Flowchart",
    description: "Create process diagrams and flowcharts",
    icon: ArrowRight,
    category: "diagrams",
    elements: [
      {
        id: "start",
        type: "shape",
        startPoint: { x: 100, y: 100 },
        endPoint: { x: 200, y: 150 },
        color: "#3b82f6",
        strokeWidth: 2,
        fillColor: "#dbeafe",
      },
      {
        id: "process",
        type: "shape",
        startPoint: { x: 100, y: 200 },
        endPoint: { x: 200, y: 250 },
        color: "#10b981",
        strokeWidth: 2,
        fillColor: "#d1fae5",
      },
    ],
    thumbnail: "/templates/flowchart.png",
  },
  {
    id: "mind-map",
    name: "Mind Map",
    description: "Organize ideas and concepts",
    icon: Brain,
    category: "planning",
    elements: [
      {
        id: "center",
        type: "shape",
        startPoint: { x: 400, y: 300 },
        endPoint: { x: 500, y: 350 },
        color: "#8b5cf6",
        strokeWidth: 2,
        fillColor: "#ede9fe",
      },
    ],
    thumbnail: "/templates/mind-map.png",
  },
  {
    id: "geometry",
    name: "Geometry",
    description: "Mathematical shapes and diagrams",
    icon: Compass,
    category: "academic",
    elements: [
      {
        id: "circle-1",
        type: "shape",
        startPoint: { x: 200, y: 200 },
        endPoint: { x: 300, y: 300 },
        color: "#ef4444",
        strokeWidth: 2,
        fillColor: "transparent",
      },
      {
        id: "square-1",
        type: "shape",
        startPoint: { x: 350, y: 200 },
        endPoint: { x: 450, y: 300 },
        color: "#3b82f6",
        strokeWidth: 2,
        fillColor: "transparent",
      },
    ],
    thumbnail: "/templates/geometry.png",
  },
  {
    id: "study-notes",
    name: "Study Notes",
    description: "Structured note-taking template",
    icon: BookOpen,
    category: "academic",
    elements: [
      {
        id: "title-line",
        type: "shape",
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 750, y: 50 },
        color: "#6b7280",
        strokeWidth: 3,
        fillColor: "transparent",
      },
      {
        id: "section-1",
        type: "text",
        text: "Topic:",
        startPoint: { x: 50, y: 80 },
        color: "#374151",
        fontSize: 18,
        fontFamily: "Arial",
      },
    ],
    thumbnail: "/templates/study-notes.png",
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    description: "Step-by-step problem analysis",
    icon: Target,
    category: "academic",
    elements: [
      {
        id: "problem-box",
        type: "shape",
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 750, y: 150 },
        color: "#f59e0b",
        strokeWidth: 2,
        fillColor: "#fef3c7",
      },
      {
        id: "problem-text",
        type: "text",
        text: "Problem:",
        startPoint: { x: 70, y: 80 },
        color: "#92400e",
        fontSize: 16,
        fontFamily: "Arial",
      },
    ],
    thumbnail: "/templates/problem-solving.png",
  },
  {
    id: "brainstorming",
    name: "Brainstorming",
    description: "Free-form idea generation",
    icon: Lightbulb,
    category: "planning",
    elements: [
      {
        id: "center-idea",
        type: "shape",
        startPoint: { x: 400, y: 300 },
        endPoint: { x: 500, y: 350 },
        color: "#f59e0b",
        strokeWidth: 2,
        fillColor: "#fef3c7",
      },
    ],
    thumbnail: "/templates/brainstorming.png",
  },
];

const categories = [
  { id: "all", name: "All Templates", icon: Grid },
  { id: "basic", name: "Basic", icon: FileText },
  { id: "academic", name: "Academic", icon: BookOpen },
  { id: "diagrams", name: "Diagrams", icon: ArrowRight },
  { id: "planning", name: "Planning", icon: Brain },
];

export default function WhiteboardTemplates({
  onSelectTemplate,
  onClose,
}: WhiteboardTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((template) => template.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Choose a Template
            </h2>
            <Button variant="outline" onClick={onClose}>
              <Plus className="w-4 h-4 rotate-45" />
            </Button>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-emerald-500"
                onClick={() => onSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <template.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {template.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>

                  <div className="h-24 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <template.icon className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {filteredTemplates.length} template
              {filteredTemplates.length !== 1 ? "s" : ""} available
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSelectTemplate(templates[0])}>
                Use Blank Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
