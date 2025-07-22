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

      <div className="container mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Interactive Whiteboard
            </h1>
            <p className="text-lg text-gray-600">
              Professional drawing and collaboration tool for studying and
              brainstorming
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Free to Use
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
              Auto-Save
            </Badge>
          </div>
        </div>

        {/* Whiteboard Management */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-white/70 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Boards:</span>
            <Select
              value={currentBoard.toString()}
              onValueChange={(value) => setCurrentBoard(parseInt(value))}
            >
              <SelectTrigger className="w-48">
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
            <Button size="sm" onClick={addNewBoard} className="ml-2">
              <Plus className="w-4 h-4 mr-1" />
              New Board
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-medium text-gray-700">Template:</span>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger className="w-40">
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
        <div className="h-[calc(100vh-280px)] min-h-[600px]">
          <Whiteboard
            key={currentBoard} // Force re-render when switching boards
            width={1200}
            height={800}
            initialBackground={boards[currentBoard]?.background || "white"}
            className="h-full"
            onSave={handleSave}
            onLoad={handleLoad}
            title={boards[currentBoard]?.name || "Whiteboard"}
          />
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Professional Tools
            </h3>
            <p className="text-gray-600">
              Full set of drawing tools including pen, shapes, text, and
              advanced features like undo/redo and layers.
            </p>
          </div>

          <div className="bg-white/70 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Multi-Board Support
            </h3>
            <p className="text-gray-600">
              Create multiple whiteboards for different subjects or projects.
              Switch between them seamlessly.
            </p>
          </div>

          <div className="bg-white/70 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Save & Export
            </h3>
            <p className="text-gray-600">
              Save your work locally and export as PNG. Perfect for sharing your
              diagrams and notes.
            </p>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="mt-8 bg-gradient-to-r from-emerald-100 to-blue-100 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
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
