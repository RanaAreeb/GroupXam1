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
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textScreenPosition, setTextScreenPosition] = useState({ x: 0, y: 0 });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

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

    setStartPoint({ x, y });

    if (currentTool === "text") {
      console.log("Text tool detected - activating text input");
      // For text tool, don't save canvas state until text is actually added
      setTextPosition({ x, y });
      setTextScreenPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
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
        drawPreviewShape(previewCtx, startPoint.x, startPoint.y, x, y);
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
      } else if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, strokeWidth * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawPreviewShape = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    currentX: number,
    currentY: number
  ) => {
    if (currentTool === "rectangle") {
      ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
      if (fillColor !== "#transparent") {
        ctx.fillStyle = fillColor;
        ctx.fillRect(startX, startY, currentX - startX, currentY - startY);
      }
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(
        Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
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
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else if (currentTool === "arrow") {
      drawArrowPreview(ctx, startX, startY, currentX, currentY);
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
        drawPreviewShape(ctx, startPoint.x, startPoint.y, x, y);

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

  const redrawBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Save all drawing content
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Clear canvas and redraw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = whiteboardBg === "white" ? "#ffffff" : "#111111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background elements first
      drawGrid(ctx);
      drawRuler(ctx);

      // Restore the drawing content on top
      ctx.globalCompositeOperation = "source-over";
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const toggleRuler = () => {
    setShowRuler(!showRuler);
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
        drawGrid(ctx);
        drawRuler(ctx);
        saveCanvasState();
      }
    }

    // Setup preview canvas
    if (previewCanvas) {
      previewCanvas.width = width;
      previewCanvas.height = height;
    }
  }, [whiteboardBg, width, height]);

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

      if (isTyping && e.key === "Enter") {
        addText();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTyping, textInput, undoStack, redoStack]);

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
          {isTyping && (
            <div
              className="absolute z-50 bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-3 sm:p-4 w-[90vw] sm:w-[300px] max-w-[350px]"
              style={{
                left: Math.max(
                  10,
                  Math.min(
                    textScreenPosition.x + 16,
                    (typeof window !== "undefined" ? window.innerWidth : 1000) -
                      320
                  )
                ),
                top: Math.max(10, textScreenPosition.y + 16),
              }}
            >
              {/* Text Formatting Controls */}
              <div className="mb-3 border-b pb-3">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Text Formatting
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 items-center">
                  {/* Font Family */}
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="w-20 sm:w-24 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times">Times</SelectItem>
                      <SelectItem value="Courier">Courier</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Font Size */}
                  <div className="flex items-center gap-1">
                    <Label className="text-xs hidden sm:inline">Size:</Label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) =>
                        setFontSize(
                          Math.max(
                            8,
                            Math.min(72, parseInt(e.target.value) || 16)
                          )
                        )
                      }
                      className="w-10 sm:w-12 h-8 text-xs border rounded px-1"
                      min="8"
                      max="72"
                    />
                  </div>

                  {/* Bold */}
                  <Button
                    size="sm"
                    variant={fontWeight === "bold" ? "default" : "outline"}
                    onClick={() =>
                      setFontWeight(fontWeight === "bold" ? "normal" : "bold")
                    }
                    className="h-8 w-8 px-1 text-xs font-bold"
                  >
                    B
                  </Button>

                  {/* Italic */}
                  <Button
                    size="sm"
                    variant={fontStyle === "italic" ? "default" : "outline"}
                    onClick={() =>
                      setFontStyle(fontStyle === "italic" ? "normal" : "italic")
                    }
                    className="h-8 w-8 px-1 text-xs italic"
                  >
                    I
                  </Button>

                  {/* Underline */}
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
                    className="h-8 w-8 px-1 text-xs underline"
                  >
                    U
                  </Button>

                  {/* Color Picker */}
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title="Text Color"
                  />
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-3">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addText();
                    } else if (e.key === "Escape") {
                      setIsTyping(false);
                      setTextInput("");
                    }
                  }}
                  className="w-full h-16 sm:h-20 p-2 border rounded resize-none text-sm"
                  style={{
                    fontSize: `${Math.min(fontSize, 16)}px`,
                    fontFamily: fontFamily,
                    fontWeight: fontWeight,
                    fontStyle: fontStyle,
                    textDecoration: textDecoration,
                    color: strokeColor,
                  }}
                  placeholder="Type your text here..."
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsTyping(false);
                    setTextInput("");
                  }}
                  className="h-8 px-3 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={addText}
                  className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                  disabled={!textInput.trim()}
                >
                  Add Text
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                💡 Enter to add • Shift+Enter for new line • Escape to cancel
              </div>
            </div>
          )}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
