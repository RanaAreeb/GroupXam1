"use client";
import { useState } from "react";
import AppHeader from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Whiteboard from "@/components/Whiteboard";
import { Plus, FileText, Users, Settings, Folder } from "lucide-react";

export default function WhiteboardPage() {
  const [currentBoard, setCurrentBoard] = useState(0);
  const [boards, setBoards] = useState([
    { id: 0, name: "Main Whiteboard", background: "white" as const },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  const addNewBoard = () => {
    const newBoard = {
      id: boards.length,
      name: `Whiteboard ${boards.length + 1}`,
      background: "white" as const,
    };
    setBoards([...boards, newBoard]);
    setCurrentBoard(newBoard.id);
  };

  const templates = [
    { value: "blank", label: "Blank Canvas" },
    { value: "grid", label: "Grid Paper" },
    { value: "lined", label: "Lined Paper" },
    { value: "math", label: "Math Template" },
    { value: "flowchart", label: "Flowchart" },
    { value: "mindmap", label: "Mind Map" },
  ];

  // Custom save/load functions for multiple boards
  const handleSave = (dataURL: string) => {
    localStorage.setItem(`whiteboard-${currentBoard}`, dataURL);
    localStorage.setItem(
      `whiteboard-${currentBoard}-meta`,
      JSON.stringify(boards[currentBoard])
    );
    alert("Whiteboard saved successfully!");
  };

  const handleLoad = () => {
    return localStorage.getItem(`whiteboard-${currentBoard}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader active="Whiteboard" />

      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
              Interactive Whiteboard
            </h1>
            <p className="text-sm sm:text-lg text-gray-600">
              Professional drawing and collaboration tool for studying and
              brainstorming
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-start sm:justify-end">
            <Badge className="bg-emerald-100 text-emerald-700 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Free to Use
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Auto-Save
            </Badge>
          </div>
        </div>

        {/* Whiteboard Management */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-3 sm:p-4 bg-white/70 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-gray-700 text-sm sm:text-base">
                Boards:
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={currentBoard.toString()}
                onValueChange={(value) => setCurrentBoard(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-48 h-8 sm:h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id.toString()}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={addNewBoard}
                className="h-8 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">New Board</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <span className="font-medium text-gray-700 text-sm sm:text-base">
              Template:
            </span>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-full sm:w-40 h-8 sm:h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Whiteboard */}
        <div className="h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-280px)] min-h-[400px] sm:min-h-[600px]">
          <Whiteboard
            key={currentBoard} // Force re-render when switching boards
            width={
              typeof window !== "undefined"
                ? Math.min(1200, window.innerWidth - 32)
                : 800
            }
            height={
              typeof window !== "undefined"
                ? Math.min(800, window.innerHeight * 0.6)
                : 500
            }
            initialBackground={boards[currentBoard]?.background || "white"}
            className="h-full w-full"
            onSave={handleSave}
            onLoad={handleLoad}
            title={boards[currentBoard]?.name || "Whiteboard"}
            showHeader={true}
          />
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/70 p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
              Professional Tools
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Full set of drawing tools including pen, shapes, text, and
              advanced features like undo/redo and layers.
            </p>
          </div>

          <div className="bg-white/70 p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
              Multi-Board Support
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Create multiple whiteboards for different subjects or projects.
              Switch between them seamlessly.
            </p>
          </div>

          <div className="bg-white/70 p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
              Save & Export
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Save your work locally and export as PNG. Perfect for sharing your
              diagrams and notes.
            </p>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-emerald-100 to-blue-100 p-4 sm:p-6 rounded-xl">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">
            💡 Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">
            <div>
              <strong>Keyboard Shortcuts:</strong>
              <ul className="ml-4 mt-1 list-disc">
                <li>Ctrl+Z: Undo</li>
                <li>Ctrl+Y: Redo</li>
                <li>Ctrl+S: Save</li>
              </ul>
            </div>
            <div>
              <strong>Drawing Tips:</strong>
              <ul className="ml-4 mt-1 list-disc">
                <li>Use grid for precise drawings</li>
                <li>Text tool: Click to add text anywhere</li>
                <li>Shapes: Click and drag to create</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
