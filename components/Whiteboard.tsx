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
  width = 800,
  height = 600,
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
  const [currentTool, setCurrentTool] = useState<
    | "pen"
    | "eraser"
    | "text"
    | "rectangle"
    | "circle"
    | "line"
    | "arrow"
    | "select"
  >("pen");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#transparent");
  const [fontSize, setFontSize] = useState(16);
  const [showGrid, setShowGrid] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
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

  // Add to state:
  const [textBoxes, setTextBoxes] = useState<any[]>([]); // {text, x, y, w, h, font, color, bold, italic, underline, align, selected}
  const [addingText, setAddingText] = useState(false);
  const [selectedTextBox, setSelectedTextBox] = useState<number | null>(null);
  const [draggingBox, setDraggingBox] = useState<number | null>(null);
  const [resizingBox, setResizingBox] = useState<{
    index: number;
    dir: string;
  } | null>(null);

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

    if (brushType === "dashed") {
      ctx.setLineDash([10, 5]);
    } else if (brushType === "dotted") {
      ctx.setLineDash([2, 3]);
    } else {
      ctx.setLineDash([]);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas not found in startDrawing");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    console.log("Mouse clicked at:", e.clientX, e.clientY);
    console.log("Canvas rect:", rect);
    console.log("Calculated canvas coordinates:", x, y);
    console.log("Current tool:", currentTool);

    if (currentTool === "text") {
      console.log("Text tool detected - activating text input");
      // For text tool, don't save canvas state until text is actually added
      setIsTyping(true);
      setIsDrawing(false); // Don't set drawing mode for text
      console.log("Text input should now be visible");
      return;
    }

    // For other tools, save state and start drawing
    saveCanvasState();
    setIsDrawing(true);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === "text") return;

    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // For shapes, draw preview on preview canvas
    if (
      ["rectangle", "circle", "line", "arrow"].includes(currentTool) &&
      previewCanvas
    ) {
      const previewCtx = previewCanvas.getContext("2d");
      if (previewCtx) {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        setupDrawingContext(previewCtx);
        drawPreviewShape(previewCtx, x, y);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (ctx) {
      setupDrawingContext(ctx);

      if (currentTool === "pen") {
        ctx.globalCompositeOperation = "source-over";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        // Redraw ruler periodically during pen drawing (every 5th stroke to avoid performance issues)
        if (showRuler && Math.random() < 0.2) {
          drawRuler(ctx);
        }
      } else if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, strokeWidth * 2, 0, Math.PI * 2);
        ctx.fill();

        // Always redraw ruler after erasing
        if (showRuler) {
          drawRuler(ctx);
        }
      }
    }
  };

  const drawPreviewShape = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number
  ) => {
    if (currentTool === "rectangle") {
      ctx.strokeRect(startX, startY, x - startX, y - startY);
      if (fillColor !== "#transparent") {
        ctx.fillStyle = fillColor;
        ctx.fillRect(startX, startY, x - startX, y - startY);
      }
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(x - startX, 2) + Math.pow(y - startY, 2)
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
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === "arrow") {
      drawArrowPreview(ctx, startX, startY, x, y);
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

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext("2d");
    const previewCanvas = previewCanvasRef.current;

    if (ctx) {
      if (["rectangle", "circle", "line", "arrow"].includes(currentTool)) {
        setupDrawingContext(ctx);
        drawPreviewShape(ctx, x, y);

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

      // Redraw ruler on top after drawing
      drawRuler(ctx);
    }

    setIsDrawing(false);
  };

  const addText = () => {
    if (!textInput.trim()) {
      setIsTyping(false);
      setTextInput("");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas not found");
      return;
    }

    // Save canvas state before adding text
    saveCanvasState();

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Set font with all formatting options
      const fontWeightStr = fontWeight === "bold" ? "bold" : "normal";
      const fontStyleStr = fontStyle === "italic" ? "italic" : "normal";
      ctx.font = `${fontStyleStr} ${fontWeightStr} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = strokeColor;
      ctx.textBaseline = "top";

      // Draw the text
      ctx.fillText(textInput, textPosition.x, textPosition.y);

      // Add underline if needed
      if (textDecoration === "underline") {
        const textMetrics = ctx.measureText(textInput);
        const textWidth = textMetrics.width;
        ctx.beginPath();
        ctx.moveTo(textPosition.x, textPosition.y + fontSize + 2);
        ctx.lineTo(textPosition.x + textWidth, textPosition.y + fontSize + 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Redraw ruler on top after adding text
      drawRuler(ctx);

      console.log("Text added successfully:", textInput, "at", textPosition);
    } else {
      console.log("Could not get canvas context");
    }

    setTextInput("");
    setIsTyping(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    saveCanvasState();
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = whiteboardBg === "white" ? "#ffffff" : "#111111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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

    for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const drawRuler = (ctx: CanvasRenderingContext2D) => {
    if (!showRuler) return;

    const rulerHeight = 20;
    const rulerWidth = 20;
    const majorTick = 50; // Major tick every 50px
    const minorTick = 10; // Minor tick every 10px

    // Save current context state
    ctx.save();

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

    // Restore context state
    ctx.restore();
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
      // Save all drawing content (but not rulers/grid)
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        // Copy only the actual drawings (skip background elements)
        tempCtx.drawImage(canvas, 0, 0);
      }

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

      // Restore the drawing content
      if (tempCtx) {
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(tempCanvas, 0, 0);
      }

      // Draw ruler on top as overlay
      drawRuler(ctx);

      // Draw all text overlays
      textOverlays.forEach((t) => {
        ctx.save();
        ctx.font = t.font;
        ctx.fillStyle = t.color;
        ctx.textAlign = t.align;
        ctx.textBaseline = "top";
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });
    }
  };

  const toggleRuler = () => {
    setShowRuler(!showRuler);
    // Force immediate redraw
    setTimeout(() => {
      redrawBackground();
    }, 50);
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set proper canvas size
        canvas.width = width;
        canvas.height = height;

        // Set initial background
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
        drawRuler(ctx);
        saveCanvasState();
      }
    }

    // Setup preview canvas
    if (previewCanvas) {
      previewCanvas.width = width;
      previewCanvas.height = height;
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

  // Drag and resize logic
  useEffect(() => {
    if (draggingBox !== null) {
      const handleMove = (e: MouseEvent) => {
        setTextBoxes((tb) =>
          tb.map((b, i) =>
            i === draggingBox
              ? {
                  ...b,
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y,
                }
              : b
          )
        );
      };
      const handleUp = () => setDraggingBox(null);
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
    }
  }, [draggingBox, dragOffset]);
  useEffect(() => {
    if (resizingBox) {
      const handleMove = (e: MouseEvent) => {
        setTextBoxes((tb) =>
          tb.map((b, i) =>
            i === resizingBox.index
              ? {
                  ...b,
                  w: Math.max(60, e.clientX - b.x),
                  h: Math.max(24, e.clientY - b.y),
                }
              : b
          )
        );
      };
      const handleUp = () => setResizingBox(null);
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
    }
  }, [resizingBox]);

  // Formatting toolbar for selected text box
  {
    selectedTextBox !== null && textBoxes[selectedTextBox] && (
      <div
        style={{
          position: "absolute",
          left: textBoxes[selectedTextBox].x,
          top: textBoxes[selectedTextBox].y - 48,
          zIndex: 2000,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #0002",
          padding: 8,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={() =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, bold: !b.bold } : b
              )
            )
          }
        >
          <b>B</b>
        </button>
        <button
          onClick={() =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, italic: !b.italic } : b
              )
            )
          }
        >
          <i>I</i>
        </button>
        <button
          onClick={() =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, underline: !b.underline } : b
              )
            )
          }
        >
          <u>U</u>
        </button>
        <button
          onClick={() =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, align: "left" } : b
              )
            )
          }
        >
          L
        </button>
        <button
          onClick={() =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, align: "center" } : b
              )
            )
          }
        >
          C
        </button>
        <button
          onClick={() =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, align: "right" } : b
              )
            )
          }
        >
          R
        </button>
        <input
          type="color"
          value={textBoxes[selectedTextBox].color}
          onChange={(e) =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, color: e.target.value } : b
              )
            )
          }
        />
        <select
          value={textBoxes[selectedTextBox].font}
          onChange={(e) =>
            setTextBoxes((tb) =>
              tb.map((b, i) =>
                i === selectedTextBox ? { ...b, font: e.target.value } : b
              )
            )
          }
        >
          <option value="16px Arial">Arial</option>
          <option value="16px Times New Roman">Times</option>
          <option value="16px Courier New">Courier</option>
          <option value="20px Arial">Large Arial</option>
          <option value="24px Arial">Extra Large Arial</option>
        </select>
        <button
          onClick={() =>
            setTextBoxes((tb) => tb.filter((_, i) => i !== selectedTextBox))
          }
        >
          🗑️
        </button>
        <button
          onClick={() =>
            setTextBoxes((tb) => [
              ...tb,
              {
                ...textBoxes[selectedTextBox],
                x: textBoxes[selectedTextBox].x + 40,
                y: textBoxes[selectedTextBox].y + 40,
                selected: false,
              },
            ])
          }
        >
          ⧉
        </button>
      </div>
    );
  }

  // When addingText is true, click/tap on canvas to place a new text box
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === "text") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (e.currentTarget.width / rect.width);
      const y = (e.clientY - rect.top) * (e.currentTarget.height / rect.height);
      setTextBoxes([
        ...textBoxes,
        {
          text: "",
          x,
          y,
          w: 180,
          h: 40,
          font: "16px Arial",
          color: "#222",
          bold: false,
          italic: false,
          underline: false,
          align: "left",
          selected: true,
        },
      ]);
      setSelectedTextBox(textBoxes.length);
      setAddingText(false);
    }
  };

  // Render all text boxes as absolutely positioned overlays
  return (
    <Card
      className={`relative overflow-hidden rounded-lg shadow-xl border-0 bg-white/80 backdrop-blur-md ${className}`}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Whiteboard Toolbar */}
        {showHeader && (
          <>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-2 sm:p-4 border-b bg-white/90 backdrop-blur-sm overflow-x-auto">
              <div className="flex flex-wrap items-center gap-1 min-w-0">
                <h3 className="text-sm sm:text-lg font-bold text-gray-800 mr-2 sm:mr-4 whitespace-nowrap">
                  {title}
                </h3>

                {/* Tools */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant={currentTool === "pen" ? "default" : "outline"}
                    onClick={() => setCurrentTool("pen")}
                    className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                  >
                    <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={currentTool === "eraser" ? "default" : "outline"}
                    onClick={() => setCurrentTool("eraser")}
                    className="p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
                  >
                    <Eraser className="w-3 h-3 sm:w-4 sm:h-4" />
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
                    variant={
                      currentTool === "rectangle" ? "default" : "outline"
                    }
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
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 sm:gap-2 ml-0 sm:ml-4">
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

            {/* Secondary Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b bg-gray-50 overflow-x-auto">
              <div className="flex items-center gap-1 sm:gap-2">
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
                  variant="outline"
                  onClick={() => setShowGrid(!showGrid)}
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
              </div>

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

              <div className="flex items-center gap-1 sm:gap-2">
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
          </>
        )}

        {/* Canvas Area */}
        <div
          className="flex-1 p-2 sm:p-4 relative"
          style={{ background: "#f8f9fa" }}
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
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousedown", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                startDrawing(mouseEvent as any);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousemove", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                draw(mouseEvent as any);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                const touch = e.changedTouches[0];
                const mouseEvent = new MouseEvent("mouseup", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                stopDrawing(mouseEvent as any);
              }}
              onClick={handleCanvasClick}
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
            {/* Render all text boxes as absolutely positioned overlays */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              {textBoxes.map((box, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: box.x,
                    top: box.y,
                    width: box.w,
                    height: box.h,
                    border: box.selected
                      ? "2px solid #007aff"
                      : "1px solid #ccc",
                    borderRadius: 6,
                    background: box.selected ? "#fff" : "transparent",
                    boxShadow: box.selected ? "0 2px 8px #007aff22" : "none",
                    zIndex: box.selected ? 100 : 10,
                    pointerEvents: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: box.align,
                    overflow: "hidden",
                    userSelect: box.selected ? "text" : "none",
                  }}
                  onMouseDown={(e) => {
                    setSelectedTextBox(i);
                    setDraggingBox(i);
                    setDragOffset({
                      x: e.clientX - box.x,
                      y: e.clientY - box.y,
                    });
                  }}
                  onDoubleClick={() => setSelectedTextBox(i)}
                >
                  {box.selected ? (
                    <textarea
                      value={box.text}
                      onChange={(e) =>
                        setTextBoxes((tb) =>
                          tb.map((b, j) =>
                            j === i ? { ...b, text: e.target.value } : b
                          )
                        )
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        font: box.font,
                        color: box.color,
                        fontWeight: box.bold ? "bold" : "normal",
                        fontStyle: box.italic ? "italic" : "normal",
                        textDecoration: box.underline ? "underline" : "none",
                        textAlign: box.align,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        padding: 4,
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      style={{
                        width: "100%",
                        height: "100%",
                        font: box.font,
                        color: box.color,
                        fontWeight: box.bold ? "bold" : "normal",
                        fontStyle: box.italic ? "italic" : "normal",
                        textDecoration: box.underline ? "underline" : "none",
                        textAlign: box.align,
                        padding: 4,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        cursor: "pointer",
                      }}
                    >
                      {box.text}
                    </span>
                  )}
                  {/* Resize handle (bottom right) */}
                  {box.selected && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: 16,
                        height: 16,
                        background: "#007aff",
                        borderRadius: 8,
                        cursor: "nwse-resize",
                        zIndex: 200,
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setResizingBox({ index: i, dir: "se" });
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Formatting toolbar for selected text box */}
            {selectedTextBox !== null && textBoxes[selectedTextBox] && (
              <div
                style={{
                  position: "absolute",
                  left: textBoxes[selectedTextBox].x,
                  top: textBoxes[selectedTextBox].y - 48,
                  zIndex: 2000,
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #0002",
                  padding: 8,
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox ? { ...b, bold: !b.bold } : b
                      )
                    )
                  }
                >
                  <b>B</b>
                </button>
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox ? { ...b, italic: !b.italic } : b
                      )
                    )
                  }
                >
                  <i>I</i>
                </button>
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox
                          ? { ...b, underline: !b.underline }
                          : b
                      )
                    )
                  }
                >
                  <u>U</u>
                </button>
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox ? { ...b, align: "left" } : b
                      )
                    )
                  }
                >
                  L
                </button>
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox ? { ...b, align: "center" } : b
                      )
                    )
                  }
                >
                  C
                </button>
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox ? { ...b, align: "right" } : b
                      )
                    )
                  }
                >
                  R
                </button>
                <input
                  type="color"
                  value={textBoxes[selectedTextBox].color}
                  onChange={(e) =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox
                          ? { ...b, color: e.target.value }
                          : b
                      )
                    )
                  }
                />
                <select
                  value={textBoxes[selectedTextBox].font}
                  onChange={(e) =>
                    setTextBoxes((tb) =>
                      tb.map((b, i) =>
                        i === selectedTextBox
                          ? { ...b, font: e.target.value }
                          : b
                      )
                    )
                  }
                >
                  <option value="16px Arial">Arial</option>
                  <option value="16px Times New Roman">Times</option>
                  <option value="16px Courier New">Courier</option>
                  <option value="20px Arial">Large Arial</option>
                  <option value="24px Arial">Extra Large Arial</option>
                </select>
                <button
                  onClick={() =>
                    setTextBoxes((tb) =>
                      tb.filter((_, i) => i !== selectedTextBox)
                    )
                  }
                >
                  🗑️
                </button>
                <button
                  onClick={() =>
                    setTextBoxes((tb) => [
                      ...tb,
                      {
                        ...textBoxes[selectedTextBox],
                        x: textBoxes[selectedTextBox].x + 40,
                        y: textBoxes[selectedTextBox].y + 40,
                        selected: false,
                      },
                    ])
                  }
                >
                  ⧉
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
