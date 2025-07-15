"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pen,
  MousePointer,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  RotateCw,
  Undo,
  Redo,
  Save,
  Share2,
  Users,
  Palette,
  Move,
  Minus,
  Plus,
  Grid,
  Layers,
  Eye,
  EyeOff,
  Settings,
  FileText,
  Brush,
  Highlighter,
  Eraser,
  Ruler,
  Compass,
  Calculator,
  BookOpen,
  Lightbulb,
  Target,
  Brain,
  Clock,
  MessageSquare,
  Star,
  Plus as PlusIcon,
  FileText as TemplateIcon,
  Users as UsersIcon,
  Copy,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { useWhiteboard } from "@/hooks/use-whiteboard";
import WhiteboardToolbar from "@/components/whiteboard/WhiteboardToolbar";
import WhiteboardTemplates from "@/components/whiteboard/WhiteboardTemplates";
import WhiteboardCollaboration from "@/components/whiteboard/WhiteboardCollaboration";
import Link from "next/link";

interface Point {
  x: number;
  y: number;
}

interface DrawingElement {
  id: string;
  type: "drawing" | "shape" | "text" | "image";
  points?: Point[];
  startPoint?: Point;
  endPoint?: Point;
  text?: string;
  imageUrl?: string;
  color: string;
  strokeWidth: number;
  fillColor?: string;
  fontFamily?: string;
  fontSize?: number;
  isSelected?: boolean;
  rotation?: number;
  opacity?: number;
  layer?: number;
}

interface WhiteboardState {
  elements: DrawingElement[];
  selectedTool: string;
  selectedColor: string;
  strokeWidth: number;
  fillColor: string;
  fontFamily: string;
  fontSize: number;
  showGrid: boolean;
  showLayers: boolean;
  zoom: number;
  pan: Point;
  history: DrawingElement[][];
  historyIndex: number;
  collaborators: string[];
  isCollaborating: boolean;
}

export default function WhiteboardPage() {
  const { isLoggedIn, user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(
    null
  );
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(
    null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<Point>({ x: 0, y: 0 });
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);

  // Whiteboard state
  const [state, setState] = useState<WhiteboardState>({
    elements: [],
    selectedTool: "pen",
    selectedColor: "#ff0000",
    strokeWidth: 2,
    fillColor: "#ffffff",
    fontFamily: "Arial",
    fontSize: 16,
    showGrid: true,
    showLayers: true,
    zoom: 1,
    pan: { x: 0, y: 0 },
    history: [],
    historyIndex: -1,
    collaborators: [],
    isCollaborating: false,
  });

  // Tools configuration
  const tools = [
    { id: "select", icon: MousePointer, label: "Select", color: "bg-blue-500" },
    { id: "pen", icon: Pen, label: "Pen", color: "bg-black" },
    { id: "brush", icon: Brush, label: "Brush", color: "bg-purple-500" },
    {
      id: "highlighter",
      icon: Highlighter,
      label: "Highlighter",
      color: "bg-yellow-500",
    },
    { id: "eraser", icon: Eraser, label: "Eraser", color: "bg-gray-500" },
    { id: "text", icon: Type, label: "Text", color: "bg-green-500" },
    { id: "rectangle", icon: Square, label: "Rectangle", color: "bg-red-500" },
    { id: "circle", icon: Circle, label: "Circle", color: "bg-orange-500" },
    { id: "line", icon: Minus, label: "Line", color: "bg-indigo-500" },
    { id: "ruler", icon: Ruler, label: "Ruler", color: "bg-teal-500" },
    { id: "compass", icon: Compass, label: "Compass", color: "bg-pink-500" },
  ];

  const colors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
    "#008000",
    "#000080",
    "#800000",
    "#808000",
    "#008080",
    "#c0c0c0",
    "#808080",
    "#400000",
    "#004000",
    "#000040",
    "#404000",
    "#400040",
    "#004040",
    "#200000",
    "#002000",
    "#000020",
    "#202000",
    "#200020",
    "#002020",
  ];

  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Comic Sans MS",
    "Impact",
    "Tahoma",
    "Trebuchet MS",
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        redrawCanvas();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.translate(state.pan.x, state.pan.y);
    ctx.scale(state.zoom, state.zoom);

    // Draw grid
    if (state.showGrid) {
      drawGrid(ctx, canvas);
    }

    // Draw elements
    state.elements.forEach((element) => {
      drawElement(ctx, element);
    });

    // Draw current element
    if (currentElement) {
      drawElement(ctx, currentElement);
    }

    ctx.restore();
  }, [state, currentElement]);

  // Draw grid
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    const gridSize = 20;
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  // Draw element
  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    ctx.save();

    if (element.opacity !== undefined) {
      ctx.globalAlpha = element.opacity;
    }

    if (element.rotation) {
      const centerX = element.startPoint?.x || 0;
      const centerY = element.startPoint?.y || 0;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    switch (element.type) {
      case "drawing":
        drawPath(ctx, element);
        break;
      case "shape":
        drawShape(ctx, element);
        break;
      case "text":
        drawText(ctx, element);
        break;
      case "image":
        drawImage(ctx, element);
        break;
    }

    ctx.restore();
  };

  // Draw path
  const drawPath = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    if (!element.points || element.points.length < 2) return;

    ctx.strokeStyle = element.color;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(element.points[0].x, element.points[0].y);

    for (let i = 1; i < element.points.length; i++) {
      ctx.lineTo(element.points[i].x, element.points[i].y);
    }

    ctx.stroke();
  };

  // Draw shape
  const drawShape = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    if (!element.startPoint || !element.endPoint) return;

    const { startPoint, endPoint } = element;
    const width = endPoint.x - startPoint.x;
    const height = endPoint.y - startPoint.y;

    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.fillColor || "transparent";
    ctx.lineWidth = element.strokeWidth;

    if (element.id.includes("rectangle")) {
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      if (element.fillColor) {
        ctx.fillRect(startPoint.x, startPoint.y, width, height);
      }
    } else if (element.id.includes("circle")) {
      const radius = Math.sqrt(width * width + height * height);
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      if (element.fillColor) {
        ctx.fill();
      }
    } else if (element.id.includes("line")) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    }
  };

  // Draw text
  const drawText = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    if (!element.text || !element.startPoint) return;

    ctx.fillStyle = element.color;
    ctx.font = `${element.fontSize}px ${element.fontFamily}`;
    ctx.fillText(element.text, element.startPoint.x, element.startPoint.y);
  };

  // Draw image
  const drawImage = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    if (!element.imageUrl || !element.startPoint || !element.endPoint) return;

    const img = new Image();
    img.onload = () => {
      const { startPoint, endPoint } = element;
      if (startPoint && endPoint) {
        const width = endPoint.x - startPoint.x;
        const height = endPoint.y - startPoint.y;
        ctx.drawImage(img, startPoint.x, startPoint.y, width, height);
      }
    };
    img.src = element.imageUrl;
  };

  // Mouse event handlers
  const getMousePos = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - state.pan.x) / state.zoom,
      y: (e.clientY - rect.top - state.pan.y) / state.zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);

    if (state.selectedTool === "text") {
      setTextPosition(pos);
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type:
        state.selectedTool === "pen" ||
        state.selectedTool === "brush" ||
        state.selectedTool === "highlighter" ||
        state.selectedTool === "eraser"
          ? "drawing"
          : "shape",
      points:
        state.selectedTool === "pen" ||
        state.selectedTool === "brush" ||
        state.selectedTool === "highlighter" ||
        state.selectedTool === "eraser"
          ? [pos]
          : undefined,
      startPoint: pos,
      endPoint: pos,
      color: state.selectedTool === "eraser" ? "#000000" : state.selectedColor,
      strokeWidth: state.strokeWidth,
      fillColor: state.fillColor,
      fontFamily: state.fontFamily,
      fontSize: state.fontSize,
    };

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentElement) return;

    const pos = getMousePos(e);

    if (currentElement.type === "drawing" && currentElement.points) {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, pos],
      });
    } else if (currentElement.type === "shape") {
      setCurrentElement({
        ...currentElement,
        endPoint: pos,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;

    setIsDrawing(false);

    // Add to history
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...state.elements, currentElement]);

    setState((prev) => ({
      ...prev,
      elements: [...prev.elements, currentElement],
      history: newHistory,
      historyIndex: newHistory.length - 1,
    }));

    setCurrentElement(null);
  };

  // Tool selection
  const selectTool = (toolId: string) => {
    setState((prev) => ({ ...prev, selectedTool: toolId }));
    setSelectedElement(null);
  };

  // Color selection
  const selectColor = (color: string) => {
    setState((prev) => ({ ...prev, selectedColor: color }));
  };

  // Stroke width change
  const changeStrokeWidth = (value: number[]) => {
    setState((prev) => ({ ...prev, strokeWidth: value[0] }));
  };

  // Font size change
  const changeFontSize = (value: number[]) => {
    setState((prev) => ({ ...prev, fontSize: value[0] }));
  };

  // Undo/Redo
  const undo = () => {
    if (state.historyIndex > 0) {
      setState((prev) => ({
        ...prev,
        historyIndex: prev.historyIndex - 1,
        elements: prev.history[prev.historyIndex - 1],
      }));
    }
  };

  const redo = () => {
    if (state.historyIndex < state.history.length - 1) {
      setState((prev) => ({
        ...prev,
        historyIndex: prev.historyIndex + 1,
        elements: prev.history[prev.historyIndex + 1],
      }));
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    setState((prev) => ({
      ...prev,
      elements: [],
      history: [...prev.history, []],
      historyIndex: prev.historyIndex + 1,
    }));
  };

  // Save canvas
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // Load image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: "image",
        imageUrl,
        startPoint: { x: 100, y: 100 },
        endPoint: { x: 300, y: 200 },
        color: "#000000",
        strokeWidth: 1,
      };

      setState((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
      }));
    };
    reader.readAsDataURL(file);
  };

  // Add text
  const addText = () => {
    if (!textInput.trim()) return;

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: "text",
      text: textInput,
      startPoint: textPosition,
      color: state.selectedColor,
      strokeWidth: 1,
      fontFamily: state.fontFamily,
      fontSize: state.fontSize,
    };

    setState((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement],
    }));

    setTextInput("");
    setShowTextInput(false);
  };

  // Zoom controls
  const zoomIn = () => {
    setState((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 5) }));
  };

  const zoomOut = () => {
    setState((prev) => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
  };

  // Redraw on state change
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  return (
    <div className="min-h-screen bg-black">
      {/* Minimal Header - Just Menu Button */}
      <div className="absolute top-4 left-4 z-30">
        <Button
          variant="ghost"
          size="sm"
          className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
          onClick={() => {
            /* Menu functionality */
          }}
        >
          <div className="flex flex-col space-y-1">
            <div className="w-4 h-0.5 bg-white"></div>
            <div className="w-4 h-0.5 bg-white"></div>
            <div className="w-4 h-0.5 bg-white"></div>
          </div>
        </Button>
      </div>

      {/* Main Canvas Area */}
      <div className="w-full h-screen relative">
        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="w-full h-full bg-black overflow-hidden relative"
          style={{
            cursor: state.selectedTool === "select" ? "default" : "crosshair",
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="absolute inset-0"
          />

          {/* Text Input Overlay */}
          {showTextInput && (
            <div
              className="absolute z-10"
              style={{
                left: textPosition.x,
                top: textPosition.y - 20,
              }}
            >
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addText();
                  } else if (e.key === "Escape") {
                    setShowTextInput(false);
                    setTextInput("");
                  }
                }}
                onBlur={addText}
                autoFocus
                className="w-48 bg-gray-800 text-white border-gray-600"
                placeholder="Enter text..."
              />
            </div>
          )}

          {/* Modals */}
          {showImageUpload && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <Card className="w-96 bg-gray-800 border-gray-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Upload Image
                  </h3>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4 bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setShowImageUpload(false)}
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setShowImageUpload(false)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {showTemplates && (
            <WhiteboardTemplates
              onSelectTemplate={(template) => {
                setState((prev) => ({
                  ...prev,
                  elements: template.elements,
                  currentTemplate: template.id,
                }));
                setShowTemplates(false);
              }}
              onClose={() => setShowTemplates(false)}
            />
          )}

          {showCollaboration && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-end z-20">
              <WhiteboardCollaboration
                whiteboardId="current-whiteboard"
                currentUser={{
                  id: user?._id || "anonymous",
                  name: user?.name || "Anonymous",
                  email: user?.email || "anonymous@example.com",
                  role: "owner",
                  isOnline: true,
                  lastSeen: new Date(),
                  color: "#3b82f6",
                }}
                collaborators={[]}
                onAddCollaborator={(email, role) => {
                  toast({
                    title: "Collaborator Added",
                    description: `${email} has been added as ${role}`,
                  });
                }}
                onRemoveCollaborator={(id) => {
                  toast({
                    title: "Collaborator Removed",
                    description: "Collaborator has been removed",
                  });
                }}
                onUpdateRole={(id, role) => {
                  toast({
                    title: "Role Updated",
                    description: `Role changed to ${role}`,
                  });
                }}
                onTogglePermission={(permission) => {
                  toast({
                    title: "Permission Updated",
                    description: `${permission} permission toggled`,
                  });
                }}
                isSharing={false}
                onToggleSharing={() => {
                  toast({
                    title: "Sharing Toggled",
                    description: "Sharing status changed",
                  });
                }}
                shareUrl="https://group-xam1.vercel.app/whiteboard"
              />
            </div>
          )}
        </div>

        {/* Floating Bottom Toolbar - TLDraw Style */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-600 p-2">
            {/* Top Row - Action Buttons */}
            <div className="flex items-center space-x-2 mb-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={undo}
                disabled={state.historyIndex <= 0}
                className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={redo}
                disabled={state.historyIndex >= state.history.length - 1}
                className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <Redo className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearCanvas}
                className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  /* Copy functionality */
                }}
                className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  /* More options */
                }}
                className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <div className="flex flex-col space-y-0.5">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </Button>
            </div>

            {/* Main Row - Drawing Tools */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("select")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "select"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <MousePointer className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("move")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "move"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Move className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("pen")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "pen"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Pen className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("eraser")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "eraser"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Eraser className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("rectangle")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "rectangle"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Square className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("arrow")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "arrow"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("text")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "text"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Type className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("image")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("circle")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "circle"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Circle className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  /* Expand toolbar */
                }}
                className="w-8 h-8 p-0 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => selectTool("brush")}
                className={`w-10 h-10 p-0 ${
                  state.selectedTool === "brush"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                }`}
              >
                <Brush className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Color Picker - Floating on the right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
          <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-600 p-3">
            <div className="grid grid-cols-1 gap-2">
              {colors.slice(0, 8).map((color) => (
                <button
                  key={color}
                  onClick={() => selectColor(color)}
                  className={`w-8 h-8 rounded border-2 ${
                    state.selectedColor === color
                      ? "border-blue-400"
                      : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stroke Width Slider - Floating on the right */}
        <div className="absolute right-4 top-1/3 z-20">
          <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-600 p-3">
            <div className="w-8 h-32 flex flex-col items-center">
              <Slider
                orientation="vertical"
                value={[state.strokeWidth]}
                onValueChange={changeStrokeWidth}
                max={20}
                min={1}
                step={1}
                className="h-24"
              />
              <span className="text-xs text-white mt-2">
                {state.strokeWidth}
              </span>
            </div>
          </div>
        </div>

        {/* Branding - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="text-white text-xs opacity-50 font-mono">
            groupXam
          </div>
        </div>
      </div>
    </div>
  );
}
