"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pen,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Type,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Grid3X3,
  Ruler,
  Save,
  Upload,
  Download,
  Bold,
  Italic,
  Underline,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react";

interface WhiteboardProps {
  width?: number;
  height?: number;
  initialBackground?: "white" | "black";
  className?: string;
  onSave?: (dataURL: string) => void;
  onLoad?: () => string | null;
  showHeader?: boolean;
  title?: string;
  template?: string; // NEW: template type
}

export default function Whiteboard({
  width = 1200,
  height = 800,
  initialBackground = "white",
  className = "",
  onSave,
  onLoad,
  showHeader = true,
  title = "Whiteboard",
  template = "blank", // NEW: template prop
}: WhiteboardProps) {
  const [whiteboardBg, setWhiteboardBg] = useState<"white" | "black">(
    initialBackground
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStartPos, setDrawStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [currentTool, setCurrentTool] = useState<
    | "pen"
    | "eraser"
    | "text"
    | "rectangle"
    | "circle"
    | "line"
    | "arrow"
    | "select"
    | "pan"
  >("pen");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#transparent");
  const [fontSize, setFontSize] = useState(16);
  const [showGrid, setShowGrid] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [brushType, setBrushType] = useState<
    "solid" | "dashed" | "dotted" | "marker" | "pencil" | "spray"
  >("solid");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [textDecoration, setTextDecoration] = useState<"none" | "underline">(
    "none"
  );
  const [fontFamily, setFontFamily] = useState("Arial");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);
  const [textOverlays, setTextOverlays] = useState<any[]>([]); // {text, x, y, font, color, align, ...}
  const [editingTextIndex, setEditingTextIndex] = useState<number | null>(null);
  const [draggingTextIndex, setDraggingTextIndex] = useState<number | null>(
    null
  );
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [textHistory, setTextHistory] = useState<any[][]>([]);
  const [textRedoStack, setTextRedoStack] = useState<any[][]>([]);

  // Text input state variables
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  // Text objects management for better quality and interactivity
  const [textObjects, setTextObjects] = useState<
    Array<{
      id: string;
      text: string;
      x: number;
      y: number;
      fontWeight: "normal" | "bold";
      fontStyle: "normal" | "italic";
      textDecoration: "none" | "underline";
      fontFamily: string;
      fontSize: number;
      color: string;
      isSelected: boolean;
    }>
  >([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack((prev) => [...prev.slice(-19), imageData]);
      setRedoStack([]);
    }
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const previousState = undoStack[undoStack.length - 1];

      setRedoStack((prev) => [currentState, ...prev.slice(0, 19)]);
      setUndoStack((prev) => prev.slice(0, -1));

      ctx.putImageData(previousState, 0, 0);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const nextState = redoStack[0];

      setUndoStack((prev) => [...prev, currentState]);
      setRedoStack((prev) => prev.slice(1));

      ctx.putImageData(nextState, 0, 0);
    }
  };

  const setupDrawingContext = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;
    
    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (brushType === "dashed") {
      ctx.setLineDash([10, 5]);
    } else if (brushType === "dotted") {
      ctx.setLineDash([2, 3]);
    } else {
      ctx.setLineDash([]);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate coordinates with proper scaling and positioning
    let x: number, y: number;
    
    if ('touches' in e) {
      // Touch event - use simpler calculation for mobile
      x = clientX - rect.left;
      y = clientY - rect.top;
    } else {
      // Mouse event - use device pixel ratio scaling
      x = (clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
      y = (clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));
    }

    if (currentTool === "text") {
      setTextPosition({ x, y });
      setIsTyping(true);
      setIsDrawing(false);
      return;
    }

    if (currentTool === "pan") {
      // For pan tool, track movement
      setIsDrawing(true);
      return;
    }

    // For other tools, save state and start drawing
    saveCanvasState();
    setIsDrawing(true);
    setDrawStartPos({ x, y });

    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (currentTool === "pen") {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === "text") return;

    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate coordinates with proper scaling and positioning
    let x: number, y: number;
    
    if ('touches' in e) {
      // Touch event - use simpler calculation for mobile
      x = clientX - rect.left;
      y = clientY - rect.top;
    } else {
      // Mouse event - use device pixel ratio scaling
      x = (clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
      y = (clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));
    }

    // For shapes, draw preview on preview canvas
    if (
      ["rectangle", "circle", "line", "arrow"].includes(currentTool) &&
      previewCanvas &&
      drawStartPos
    ) {
      const previewCtx = previewCanvas.getContext("2d");
      if (previewCtx) {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        setupDrawingContext(previewCtx);
        drawPreviewShape(previewCtx, drawStartPos.x, drawStartPos.y, x, y);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (currentTool === "pan") {
        // Handle panning
        if ('movementX' in e) {
          setPanOffset((prev) => ({
            x: prev.x + e.movementX,
            y: prev.y + e.movementY,
          }));
        }
        return;
      }

      setupDrawingContext(ctx);

      if (currentTool === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, strokeWidth * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  };

  const drawPreviewShape = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    if (currentTool === "rectangle") {
      const width = endX - startX;
      const height = endY - startY;
      ctx.strokeRect(startX, startY, width, height);
      if (fillColor !== "#transparent") {
        ctx.fillStyle = fillColor;
        ctx.fillRect(startX, startY, width, height);
      }
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
      );
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
      if (fillColor !== "#transparent") {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
    } else if (currentTool === "line") {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (currentTool === "arrow") {
      drawArrowPreview(ctx, startX, startY, endX, endY);
    }
  };

  const drawArrowPreview = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) => {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      const touch = e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate coordinates with proper scaling and positioning
    let x: number, y: number;
    
    if ('touches' in e) {
      // Touch event - use simpler calculation for mobile
      x = clientX - rect.left;
      y = clientY - rect.top;
    } else {
      // Mouse event - use device pixel ratio scaling
      x = (clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
      y = (clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));
    }

    const ctx = canvas.getContext("2d");
    const previewCanvas = previewCanvasRef.current;

    if (ctx && drawStartPos) {
      if (["rectangle", "circle", "line", "arrow"].includes(currentTool)) {
        setupDrawingContext(ctx);
        drawPreviewShape(ctx, drawStartPos.x, drawStartPos.y, x, y);

        if (previewCanvas) {
          const previewCtx = previewCanvas.getContext("2d");
          if (previewCtx) {
            previewCtx.clearRect(
              0,
              0,
              previewCanvas.width,
              previewCanvas.height
            );
          }
        }
      }
    }

    setIsDrawing(false);
    setDrawStartPos(null);
  };

  const addText = () => {
    if (!textInput.trim()) {
      setIsTyping(false);
      setTextInput("");
      return;
    }

    // Create a new text object
    const newTextObject = {
      id: `text-${Date.now()}-${Math.random()}`,
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      fontWeight,
      fontStyle,
      textDecoration,
      fontFamily,
      fontSize,
      color: strokeColor,
      isSelected: false,
    };

    // Add to text objects array
    setTextObjects((prev) => [...prev, newTextObject]);

    console.log("Text object added:", newTextObject);

    setTextInput("");
    setIsTyping(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveCanvasState();
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = whiteboardBg === "white" ? "#ffffff" : "#111111";
      ctx.fillRect(0, 0, width, height);
      drawGrid(ctx);
      drawRuler(ctx);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (!showGrid) return;

    const gridSize = 20;
    ctx.strokeStyle = whiteboardBg === "white" ? "#e0e0e0" : "#404040";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawRuler = (ctx: CanvasRenderingContext2D) => {
    if (!showRuler) return;

    const rulerHeight = 20;
    const rulerWidth = 20;
    const majorTick = 50; // Major tick every 50px
    const minorTick = 10; // Minor tick every 10px

    // Set ruler styles
    ctx.fillStyle = whiteboardBg === "white" ? "#f5f5f5" : "#2a2a2a";
    ctx.strokeStyle = whiteboardBg === "white" ? "#333" : "#ccc";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    // Draw horizontal ruler background
    ctx.fillRect(rulerWidth, 0, ctx.canvas.width - rulerWidth, rulerHeight);

    // Draw vertical ruler background
    ctx.fillRect(0, rulerHeight, rulerWidth, ctx.canvas.height - rulerHeight);

    // Draw corner square
    ctx.fillRect(0, 0, rulerWidth, rulerHeight);

    // Draw horizontal ruler markings
    for (let x = rulerWidth; x <= ctx.canvas.width; x += minorTick) {
      const isMajorTick = (x - rulerWidth) % majorTick === 0;
      const tickHeight = isMajorTick ? 8 : 4;

      ctx.beginPath();
      ctx.moveTo(x, rulerHeight);
      ctx.lineTo(x, rulerHeight - tickHeight);
      ctx.stroke();

      // Add numbers for major ticks
      if (isMajorTick && x > rulerWidth) {
        ctx.fillStyle = whiteboardBg === "white" ? "#333" : "#ccc";
        ctx.fillText((x - rulerWidth).toString(), x, rulerHeight - 12);
      }
    }

    // Draw vertical ruler markings
    for (let y = rulerHeight; y <= ctx.canvas.height; y += minorTick) {
      const isMajorTick = (y - rulerHeight) % majorTick === 0;
      const tickWidth = isMajorTick ? 8 : 4;

      ctx.beginPath();
      ctx.moveTo(rulerWidth, y);
      ctx.lineTo(rulerWidth - tickWidth, y);
      ctx.stroke();

      // Add numbers for major ticks
      if (isMajorTick && y > rulerHeight) {
        ctx.save();
        ctx.translate(rulerWidth - 12, y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = whiteboardBg === "white" ? "#333" : "#ccc";
        ctx.fillText((y - rulerHeight).toString(), 0, 0);
        ctx.restore();
      }
    }

    // Draw ruler borders
    ctx.strokeStyle = whiteboardBg === "white" ? "#ccc" : "#555";
    ctx.beginPath();
    ctx.moveTo(rulerWidth, rulerHeight);
    ctx.lineTo(ctx.canvas.width, rulerHeight);
    ctx.moveTo(rulerWidth, rulerHeight);
    ctx.lineTo(rulerWidth, ctx.canvas.height);
    ctx.stroke();
  };

  // Draw lined paper
  const drawLinedPaper = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#b3c6e0";
    ctx.lineWidth = 1;
    for (let y = 40; y < ctx.canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Draw math template (axes)
  const drawMathTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#b3c6e0";
    ctx.lineWidth = 2;
    // X axis
    ctx.beginPath();
    ctx.moveTo(40, ctx.canvas.height / 2);
    ctx.lineTo(ctx.canvas.width - 20, ctx.canvas.height / 2);
    ctx.stroke();
    // Y axis
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width / 2, 40);
    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - 20);
    ctx.stroke();
    ctx.restore();
  };

  // Draw graph paper (grid + axes)
  const drawGraphPaper = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.lineWidth = 1;
    // Grid
    for (let x = 40; x < ctx.canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    for (let y = 40; y < ctx.canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = "#b3c6e0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, ctx.canvas.height / 2);
    ctx.lineTo(ctx.canvas.width - 20, ctx.canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width / 2, 40);
    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - 20);
    ctx.stroke();
    ctx.restore();
  };

  // Draw flowchart template (stub: faint boxes)
  const drawFlowchartTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    // Draw a few faint rectangles as placeholders
    ctx.strokeRect(100, 60, 160, 60);
    ctx.strokeRect(100, 180, 160, 60);
    ctx.strokeRect(100, 300, 160, 60);
    ctx.restore();
  };

  // Draw mindmap template (stub: faint circles)
  const drawMindmapTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ctx.canvas.width / 2, 120, 40, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ctx.canvas.width / 2 - 100, 240, 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ctx.canvas.width / 2 + 100, 240, 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  };

  // Draw resume template (stub: faint lines/boxes)
  const drawResumeTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    // Header
    ctx.strokeRect(60, 40, ctx.canvas.width - 120, 40);
    // Section titles
    ctx.strokeRect(60, 100, 120, 30);
    ctx.strokeRect(60, 160, 120, 30);
    ctx.strokeRect(60, 220, 120, 30);
    // Content boxes
    ctx.strokeRect(200, 100, ctx.canvas.width - 260, 30);
    ctx.strokeRect(200, 160, ctx.canvas.width - 260, 30);
    ctx.strokeRect(200, 220, ctx.canvas.width - 260, 30);
    ctx.restore();
  };

  // Draw letter template (stub: faint lines)
  const drawLetterTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.lineWidth = 1;
    for (let y = 80; y < ctx.canvas.height - 40; y += 32) {
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(ctx.canvas.width - 60, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Draw report template (stub: title + sections)
  const drawReportTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    // Title
    ctx.strokeRect(60, 40, ctx.canvas.width - 120, 40);
    // Section boxes
    ctx.strokeRect(60, 100, ctx.canvas.width - 120, 60);
    ctx.strokeRect(60, 180, ctx.canvas.width - 120, 60);
    ctx.strokeRect(60, 260, ctx.canvas.width - 120, 60);
    ctx.restore();
  };

  // Draw presentation template (stub: title + content)
  const drawPresentationTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    // Title
    ctx.strokeRect(80, 40, ctx.canvas.width - 160, 60);
    // Content
    ctx.strokeRect(80, 120, ctx.canvas.width - 160, ctx.canvas.height - 180);
    ctx.restore();
  };

  // Draw writing format templates (IEEE, APA, MLA, Creative)
  const drawWritingFormatTemplate = (
    ctx: CanvasRenderingContext2D,
    format: string
  ) => {
    ctx.save();
    ctx.strokeStyle = "#e0e7ef";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 2;
    // Title box
    ctx.strokeRect(60, 40, ctx.canvas.width - 120, 40);
    // Author/Meta
    ctx.strokeRect(60, 100, ctx.canvas.width - 120, 30);
    // Abstract/Intro
    ctx.strokeRect(60, 150, ctx.canvas.width - 120, 40);
    // Section boxes
    ctx.strokeRect(60, 210, ctx.canvas.width - 120, 60);
    ctx.strokeRect(60, 290, ctx.canvas.width - 120, 60);
    ctx.strokeRect(60, 370, ctx.canvas.width - 120, 60);
    // Footer/References
    ctx.strokeRect(60, ctx.canvas.height - 60, ctx.canvas.width - 120, 40);
    ctx.restore();
    // Optionally, add faint text labels for each section
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.font = "16px Arial";
    ctx.fillStyle = "#888";
    ctx.fillText(format + " Format", 80, 70);
    ctx.fillText("Author", 80, 120);
    ctx.fillText("Abstract/Intro", 80, 170);
    ctx.fillText("Section 1", 80, 240);
    ctx.fillText("Section 2", 80, 320);
    ctx.fillText("Section 3", 80, 400);
    ctx.fillText("References", 80, ctx.canvas.height - 35);
    ctx.restore();
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();

    if (onSave) {
      onSave(dataURL);
    } else {
      localStorage.setItem("whiteboard-save", dataURL);
      alert("Whiteboard saved locally!");
    }
  };

  const loadWhiteboard = () => {
    let savedData: string | null = null;

    if (onLoad) {
      savedData = onLoad();
    } else {
      savedData = localStorage.getItem("whiteboard-save");
    }

    if (!savedData) {
      alert("No saved whiteboard found!");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedData;
    }
  };

  // Update redrawBackground to use template
  const redrawBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Clear canvas and redraw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = whiteboardBg === "white" ? "#ffffff" : "#111111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw template backgrounds
      switch (template) {
        case "grid":
          drawGrid(ctx);
          break;
        case "lined":
          drawLinedPaper(ctx);
          break;
        case "math":
          drawMathTemplate(ctx);
          break;
        case "graph":
          drawGraphPaper(ctx);
          break;
        case "flowchart":
          drawFlowchartTemplate(ctx);
          break;
        case "mindmap":
          drawMindmapTemplate(ctx);
          break;
        case "resume":
          drawResumeTemplate(ctx);
          break;
        case "letter":
          drawLetterTemplate(ctx);
          break;
        case "report":
          drawReportTemplate(ctx);
          break;
        case "presentation":
          drawPresentationTemplate(ctx);
          break;
        case "ieee":
        case "apa":
        case "mla":
        case "creative":
          drawWritingFormatTemplate(ctx, template.toUpperCase());
          break;
        default:
          // blank
          break;
      }

      // Draw grid if enabled (regardless of template)
      if (showGrid) {
        drawGrid(ctx);
      }

      // Draw ruler on top as overlay
      if (showRuler) {
        drawRuler(ctx);
      }
    }
  };

  const toggleRuler = () => {
    setShowRuler(!showRuler);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 5)); // Max zoom 5x
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.1)); // Min zoom 0.1x
  };

  const resetZoom = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Get device pixel ratio for crisp drawing
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Set canvas size accounting for device pixel ratio
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        // Scale the drawing context so everything draws at the correct size
        ctx.scale(dpr, dpr);
        
        // Set canvas CSS size
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        // Set initial background
        ctx.fillStyle = whiteboardBg === "white" ? "#ffffff" : "#111111";
        ctx.fillRect(0, 0, width, height);
        // Draw template backgrounds
        switch (template) {
          case "grid":
            drawGrid(ctx);
            break;
          case "lined":
            drawLinedPaper(ctx);
            break;
          case "math":
            drawMathTemplate(ctx);
            break;
          case "graph":
            drawGraphPaper(ctx);
            break;
          case "flowchart":
            drawFlowchartTemplate(ctx);
            break;
          case "mindmap":
            drawMindmapTemplate(ctx);
            break;
          case "resume":
            drawResumeTemplate(ctx);
            break;
          case "letter":
            drawLetterTemplate(ctx);
            break;
          case "report":
            drawReportTemplate(ctx);
            break;
          case "presentation":
            drawPresentationTemplate(ctx);
            break;
          case "ieee":
          case "apa":
          case "mla":
          case "creative":
            drawWritingFormatTemplate(ctx, template.toUpperCase());
            break;
          default:
            // blank
            break;
        }
        drawRuler(ctx);
        saveCanvasState();
      }
    }

    // Setup preview canvas
    if (previewCanvas) {
      const dpr = window.devicePixelRatio || 1;
      previewCanvas.width = width * dpr;
      previewCanvas.height = height * dpr;
      previewCanvas.style.width = width + 'px';
      previewCanvas.style.height = height + 'px';
      
      const previewCtx = previewCanvas.getContext("2d");
      if (previewCtx) {
        previewCtx.scale(dpr, dpr);
      }
    }
  }, [whiteboardBg, width, height, template]);

  // Separate effect for ruler/grid changes to avoid clearing drawings
  useEffect(() => {
    if (canvasRef.current) {
      redrawBackground();
    }
  }, [showGrid, showRuler, whiteboardBg]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "s":
            e.preventDefault();
            saveWhiteboard();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack]);

  // Add mouse move/up listeners for dragging:
  useEffect(() => {
    if (draggingTextIndex !== null) {
      const handleMove = (e: MouseEvent) => {
        setTextOverlays((ov) =>
          ov.map((o, i) =>
            i === draggingTextIndex
              ? {
                  ...o,
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y,
                }
              : o
          )
        );
      };
      const handleUp = () => setDraggingTextIndex(null);
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
    }
  }, [draggingTextIndex, dragOffset]);

  // Text dragging functionality
  useEffect(() => {
    if (draggingTextId) {
      const handleMouseMove = (e: MouseEvent) => {
        setTextObjects((prev) =>
          prev.map((obj) =>
            obj.id === draggingTextId
              ? {
                  ...obj,
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y,
                }
              : obj
          )
        );
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        setTextObjects((prev) =>
          prev.map((obj) =>
            obj.id === draggingTextId
              ? {
                  ...obj,
                  x: touch.clientX - dragOffset.x,
                  y: touch.clientY - dragOffset.y,
                }
              : obj
          )
        );
      };

      const handleMouseUp = () => {
        setDraggingTextId(null);
      };

      const handleTouchEnd = () => {
        setDraggingTextId(null);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [draggingTextId, dragOffset]);

  // Keyboard shortcuts for text objects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedTextId) {
          setTextObjects((prev) =>
            prev.filter((obj) => obj.id !== selectedTextId)
          );
          setSelectedTextId(null);
        }
      }
      // Deselect text when clicking outside
      if (e.key === "Escape") {
        setSelectedTextId(null);
        setTextObjects((prev) =>
          prev.map((obj) => ({ ...obj, isSelected: false }))
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTextId]);

  // Old formatting toolbar removed - using new modal system

  // Old text box click handler removed - using new modal system

  // Render all text boxes as absolutely positioned overlays
  return (
    <Card
      className={`relative overflow-hidden rounded-lg shadow-xl border-0 bg-white/80 backdrop-blur-md ${className}`}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Unified Whiteboard Toolbar */}
        {showHeader && (
          <div className="flex flex-col gap-2 p-2 sm:p-4 border-b bg-white/90 backdrop-blur-sm">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-lg font-bold text-gray-800">
                {title}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  size="sm"
                  variant={whiteboardBg === "white" ? "default" : "outline"}
                  onClick={() => setWhiteboardBg("white")}
                  className="h-8 px-2 text-xs"
                >
                  White
                </Button>
                <Button
                  size="sm"
                  variant={whiteboardBg === "black" ? "default" : "outline"}
                  onClick={() => setWhiteboardBg("black")}
                  className="h-8 px-2 text-xs"
                >
                  Black
                </Button>
              </div>
            </div>

            {/* Main Tools Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2 overflow-x-auto">
              {/* Drawing Tools */}
              <div className="flex items-center gap-2">
                                  <Button
                    size="sm"
                    variant={currentTool === "pen" ? "default" : "outline"}
                    onClick={() => setCurrentTool("pen")}
                    className="p-2 h-10 w-10 sm:h-auto sm:w-auto"
                  >
                    <Pen className="w-4 h-4 sm:w-4 sm:h-4" />
                  </Button>
                <Button
                  size="sm"
                  variant={currentTool === "eraser" ? "default" : "outline"}
                  onClick={() => setCurrentTool("eraser")}
                  className="p-2 h-10 w-10 sm:h-auto sm:w-auto"
                >
                  <Eraser className="w-4 h-4 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={currentTool === "text" ? "default" : "outline"}
                  onClick={() => setCurrentTool("text")}
                  className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                >
                  <Type className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={currentTool === "rectangle" ? "default" : "outline"}
                  onClick={() => setCurrentTool("rectangle")}
                  className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                >
                  <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={currentTool === "circle" ? "default" : "outline"}
                  onClick={() => setCurrentTool("circle")}
                  className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                >
                  <Circle className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={currentTool === "line" ? "default" : "outline"}
                  onClick={() => setCurrentTool("line")}
                  className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={currentTool === "arrow" ? "default" : "outline"}
                  onClick={() => setCurrentTool("arrow")}
                  className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={currentTool === "pan" ? "default" : "outline"}
                  onClick={() => setCurrentTool("pan")}
                  className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                  title="Pan Tool"
                >
                  <Move className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              {/* Utility Tools */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  className="h-8 w-8 p-1"
                >
                  <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="h-8 w-8 p-1"
                >
                  <Redo2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={showGrid ? "default" : "outline"}
                  onClick={toggleGrid}
                  className="h-8 w-8 p-1"
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleRuler}
                  className="h-8 w-8 p-1"
                >
                  <Ruler className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={zoomIn}
                  className="h-8 w-8 p-1"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={zoomOut}
                  className="h-8 w-8 p-1"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetZoom}
                  className="h-8 px-2 text-xs"
                  title="Reset Zoom"
                >
                  {Math.round(scale * 100)}%
                </Button>
              </div>

              {/* File Operations */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadWhiteboard}
                  className="h-8 w-8 p-1"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={saveWhiteboard}
                  className="h-8 w-8 p-1"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadCanvas}
                  className="h-8 w-8 p-1"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearCanvas}
                  className="h-8 w-8 p-1"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {/* Settings Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2 overflow-x-auto">
              {/* Color Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-1 sm:p-2 h-8 w-8"
                  >
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded"
                      style={{ backgroundColor: strokeColor }}
                    ></div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="space-y-3">
                    <Label>Stroke Color</Label>
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-full h-8 rounded border"
                    />
                    <Label>Fill Color</Label>
                    <input
                      type="color"
                      value={
                        fillColor === "#transparent" ? "#ffffff" : fillColor
                      }
                      onChange={(e) => setFillColor(e.target.value)}
                      className="w-full h-8 rounded border"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFillColor("#transparent")}
                      className="w-full"
                    >
                      No Fill
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Stroke Width */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-2 sm:px-3 h-8 text-xs"
                  >
                    {strokeWidth}px
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="space-y-3">
                    <Label>Stroke Width: {strokeWidth}px</Label>
                    <Slider
                      value={[strokeWidth]}
                      onValueChange={(value) => setStrokeWidth(value[0])}
                      min={1}
                      max={50}
                      step={1}
                    />
                    {currentTool === "text" && (
                      <>
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          min={8}
                          max={72}
                          step={1}
                        />
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Brush Type */}
              <Select
                value={brushType}
                onValueChange={(value: string) =>
                  setBrushType(
                    value as
                      | "solid"
                      | "dashed"
                      | "dotted"
                      | "marker"
                      | "pencil"
                      | "spray"
                  )
                }
              >
                <SelectTrigger className="w-16 sm:w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="marker">Marker</SelectItem>
                  <SelectItem value="pencil">Pencil</SelectItem>
                  <SelectItem value="spray">Spray</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div
          className="flex-1 p-2 sm:p-4 relative"
          style={{ 
            background: "#f8f9fa",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none"
          }}
        >
          {/* The text input modal is removed, so this block is no longer needed */}
          <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px]">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={`w-full h-full border border-gray-300 rounded-lg shadow-sm absolute top-0 left-0 ${
                currentTool === "text"
                  ? "cursor-text"
                  : currentTool === "eraser"
                  ? "cursor-crosshair"
                  : currentTool === "pan"
                  ? "cursor-grab"
                  : "cursor-crosshair"
              }`}
              style={{
                background: whiteboardBg === "white" ? "#ffffff" : "#111111",
                touchAction: "none",
                maxWidth: "100%",
                maxHeight: "100%",
                zIndex: 1,
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onWheel={(e) => {
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                  // Zoom with Ctrl/Cmd + wheel
                  const delta = e.deltaY > 0 ? 0.9 : 1.1;
                  setScale((prev) => Math.min(Math.max(prev * delta, 0.1), 5));
                } else {
                  // Pan with wheel
                  setPanOffset((prev) => ({
                    x: prev.x - e.deltaX,
                    y: prev.y - e.deltaY,
                  }));
                }
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startDrawing(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                e.stopPropagation();
                draw(e);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopDrawing(e);
              }}
              // onClick removed - text functionality now handled by startDrawing
            />
            <canvas
              ref={previewCanvasRef}
              width={width}
              height={height}
              className="w-full h-full rounded-lg cursor-crosshair absolute top-0 left-0 pointer-events-none"
              style={{
                touchAction: "none",
                maxWidth: "100%",
                maxHeight: "100%",
                zIndex: 2,
              }}
            />

            {/* Text Input UI - appears when isTyping is true */}
            {isTyping && (
              <div
                className="fixed bg-white border-2 border-blue-500 rounded-lg shadow-lg p-2 sm:p-4"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                  minWidth: "280px",
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      size="sm"
                      variant={fontWeight === "bold" ? "default" : "outline"}
                      onClick={() =>
                        setFontWeight(fontWeight === "bold" ? "normal" : "bold")
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Bold className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={fontStyle === "italic" ? "default" : "outline"}
                      onClick={() =>
                        setFontStyle(
                          fontStyle === "italic" ? "normal" : "italic"
                        )
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Italic className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        textDecoration === "underline" ? "default" : "outline"
                      }
                      onClick={() =>
                        setTextDecoration(
                          textDecoration === "underline" ? "none" : "underline"
                        )
                      }
                      className="h-6 w-6 p-0"
                    >
                      <Underline className="w-3 h-3" />
                    </Button>
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-6 h-6 border rounded"
                    />
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="w-24 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times</SelectItem>
                        <SelectItem value="Courier New">Courier</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={fontSize.toString()}
                      onValueChange={(value) => setFontSize(parseInt(value))}
                    >
                      <SelectTrigger className="w-16 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="14">14</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="18">18</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="32">32</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full min-h-[80px] p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      fontFamily: fontFamily,
                      fontSize: `${fontSize}px`,
                      fontWeight: fontWeight,
                      fontStyle: fontStyle,
                      textDecoration: textDecoration,
                      color: strokeColor,
                    }}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsTyping(false);
                        setTextInput("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={addText}
                      disabled={!textInput.trim()}
                    >
                      Add Text
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Text Objects Overlay - renders text as HTML for better quality and interactivity */}
            {textObjects.map((textObj) => (
              <div
                key={textObj.id}
                className={`absolute cursor-move select-none touch-none ${
                  textObj.isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-gray-300"
                }`}
                style={{
                  left: textObj.x,
                  top: textObj.y,
                  fontFamily: textObj.fontFamily,
                  fontSize: `${textObj.fontSize}px`,
                  fontWeight: textObj.fontWeight,
                  fontStyle: textObj.fontStyle,
                  textDecoration: textObj.textDecoration,
                  color: textObj.color,
                  zIndex: textObj.isSelected ? 1000 : 100,
                  userSelect: "none",
                  touchAction: "none",
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setSelectedTextId(textObj.id);
                  setTextObjects((prev) =>
                    prev.map((obj) =>
                      obj.id === textObj.id
                        ? { ...obj, isSelected: true }
                        : { ...obj, isSelected: false }
                    )
                  );
                  setDraggingTextId(textObj.id);
                  setDragOffset({
                    x: e.clientX - textObj.x,
                    y: e.clientY - textObj.y,
                  });
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  const touch = e.touches[0];
                  setSelectedTextId(textObj.id);
                  setTextObjects((prev) =>
                    prev.map((obj) =>
                      obj.id === textObj.id
                        ? { ...obj, isSelected: true }
                        : { ...obj, isSelected: false }
                    )
                  );
                  setDraggingTextId(textObj.id);
                  setDragOffset({
                    x: touch.clientX - textObj.x,
                    y: touch.clientY - textObj.y,
                  });
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  // Enable editing mode
                  setTextInput(textObj.text);
                  setTextPosition({ x: textObj.x, y: textObj.y });
                  setFontWeight(textObj.fontWeight);
                  setFontStyle(textObj.fontStyle);
                  setTextDecoration(textObj.textDecoration);
                  setFontFamily(textObj.fontFamily);
                  setFontSize(textObj.fontSize);
                  setStrokeColor(textObj.color);
                  setIsTyping(true);
                  // Remove the old text object
                  setTextObjects((prev) =>
                    prev.filter((obj) => obj.id !== textObj.id)
                  );
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  // On mobile, long press to edit
                  setTimeout(() => {
                    if (draggingTextId === textObj.id) {
                      setDraggingTextId(null);
                    }
                  }, 200);
                }}
              >
                {textObj.text}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
