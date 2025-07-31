import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  RotateCw as RotateIcon,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Group,
  Ungroup,
  Copy,
  Scissors,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Unlink,
  Table,
  Columns,
  Rows,
  Merge,
  Split,
  Lock,
  Unlock,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Layers as LayersIcon,
  BringToFront,
  SendToBack,
  ArrowRight,
} from "lucide-react";

interface Tool {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  category: string;
  shortcut?: string;
  color?: string;
}

interface WhiteboardToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  fillColor: string;
  onFillColorSelect: (color: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showLayers: boolean;
  onToggleLayers: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const tools: Tool[] = [
  // Selection Tools
  {
    id: "select",
    icon: MousePointer,
    label: "Select",
    category: "selection",
    shortcut: "V",
  },
  {
    id: "move",
    icon: Move,
    label: "Move",
    category: "selection",
    shortcut: "M",
  },

  // Drawing Tools
  {
    id: "pen",
    icon: Pen,
    label: "Pen",
    category: "drawing",
    shortcut: "P",
    color: "bg-black",
  },
  {
    id: "brush",
    icon: Brush,
    label: "Brush",
    category: "drawing",
    shortcut: "B",
    color: "bg-purple-500",
  },
  {
    id: "highlighter",
    icon: Highlighter,
    label: "Highlighter",
    category: "drawing",
    shortcut: "H",
    color: "bg-yellow-500",
  },
  {
    id: "eraser",
    icon: Eraser,
    label: "Eraser",
    category: "drawing",
    shortcut: "E",
    color: "bg-gray-500",
  },

  // Shape Tools
  {
    id: "rectangle",
    icon: Square,
    label: "Rectangle",
    category: "shapes",
    shortcut: "R",
    color: "bg-red-500",
  },
  {
    id: "circle",
    icon: Circle,
    label: "Circle",
    category: "shapes",
    shortcut: "C",
    color: "bg-orange-500",
  },
  {
    id: "line",
    icon: Minus,
    label: "Line",
    category: "shapes",
    shortcut: "L",
    color: "bg-indigo-500",
  },
  {
    id: "arrow",
    icon: ArrowRight,
    label: "Arrow",
    category: "shapes",
    shortcut: "A",
    color: "bg-blue-500",
  },

  // Text Tools
  {
    id: "text",
    icon: Type,
    label: "Text",
    category: "text",
    shortcut: "T",
    color: "bg-green-500",
  },
  {
    id: "sticky",
    icon: FileText,
    label: "Sticky Note",
    category: "text",
    shortcut: "S",
    color: "bg-yellow-400",
  },

  // Math Tools
  {
    id: "calculator",
    icon: Calculator,
    label: "Calculator",
    category: "math",
    shortcut: "Ctrl+M",
    color: "bg-purple-600",
  },
  {
    id: "ruler",
    icon: Ruler,
    label: "Ruler",
    category: "math",
    shortcut: "Ctrl+R",
    color: "bg-teal-500",
  },
  {
    id: "compass",
    icon: Compass,
    label: "Compass",
    category: "math",
    shortcut: "Ctrl+C",
    color: "bg-pink-500",
  },

  // Media Tools
  {
    id: "image",
    icon: ImageIcon,
    label: "Image",
    category: "media",
    shortcut: "Ctrl+I",
    color: "bg-emerald-500",
  },
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

export default function WhiteboardToolbar({
  selectedTool,
  onToolSelect,
  selectedColor,
  onColorSelect,
  strokeWidth,
  onStrokeWidthChange,
  fillColor,
  onFillColorSelect,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  showGrid,
  onToggleGrid,
  showLayers,
  onToggleLayers,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onExport,
  onImport,
  canUndo,
  canRedo,
}: WhiteboardToolbarProps) {
  const toolCategories = [
    { id: "selection", name: "Selection", icon: MousePointer },
    { id: "drawing", name: "Drawing", icon: Pen },
    { id: "shapes", name: "Shapes", icon: Square },
    { id: "text", name: "Text", icon: Type },
    { id: "math", name: "Math", icon: Calculator },
    { id: "media", name: "Media", icon: ImageIcon },
  ];

  const getToolCategory = (toolId: string) => {
    return tools.find((tool) => tool.id === toolId)?.category || "drawing";
  };

  const currentCategory = getToolCategory(selectedTool);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Tools */}
        <div className="flex items-center space-x-4">
          {/* Tool Categories */}
          <div className="flex space-x-1">
            {toolCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  currentCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  const firstToolInCategory = tools.find(
                    (tool) => tool.category === category.id
                  );
                  if (firstToolInCategory) {
                    onToolSelect(firstToolInCategory.id);
                  }
                }}
                className="flex items-center space-x-1"
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Tools in Current Category */}
          <div className="flex space-x-1 border-l border-gray-200 pl-4">
            {tools
              .filter((tool) => tool.category === currentCategory)
              .map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToolSelect(tool.id)}
                  className="relative"
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <tool.icon className="w-4 h-4" />
                  {tool.shortcut && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 text-xs"
                    >
                      {tool.shortcut.replace("Ctrl+", "⌘")}
                    </Badge>
                  )}
                </Button>
              ))}
          </div>
        </div>

        {/* Center Section - Properties */}
        <div className="flex items-center space-x-4">
          {/* Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-12 h-8">
                <div
                  className="w-6 h-4 rounded border"
                  style={{ backgroundColor: selectedColor }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorSelect(color)}
                    className={`w-8 h-8 rounded border-2 ${
                      selectedColor === color
                        ? "border-emerald-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Stroke Width */}
          <div className="flex items-center space-x-2">
            <Label className="text-xs whitespace-nowrap">Width:</Label>
            <Slider
              value={[strokeWidth]}
              onValueChange={(value) => onStrokeWidthChange(value[0])}
              max={20}
              min={1}
              step={1}
              className="w-20"
            />
            <span className="text-xs w-8">{strokeWidth}px</span>
          </div>

          {/* Font Settings (for text tool) */}
          {selectedTool === "text" && (
            <>
              <Select value={fontFamily} onValueChange={onFontFamilyChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={fontSize.toString()}
                onValueChange={(value) => onFontSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {/* Fill Color (for shapes) */}
          {["rectangle", "circle"].includes(selectedTool) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-12 h-8">
                  <div
                    className="w-6 h-4 rounded border"
                    style={{ backgroundColor: fillColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-6 gap-2">
                  {colors.slice(0, 12).map((color) => (
                    <button
                      key={color}
                      onClick={() => onFillColorSelect(color)}
                      className={`w-8 h-8 rounded border-2 ${
                        fillColor === color
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* View Controls */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
            <Button size="sm" variant="outline" onClick={onZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs font-medium w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button size="sm" variant="outline" onClick={onZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onResetZoom}>
              <Maximize className="w-4 h-4" />
            </Button>
          </div>

          {/* Grid & Layers */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
            <Button
              size="sm"
              variant={showGrid ? "default" : "outline"}
              onClick={onToggleGrid}
              title="Toggle Grid"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={showLayers ? "default" : "outline"}
              onClick={onToggleLayers}
              title="Toggle Layers"
            >
              <Layers className="w-4 h-4" />
            </Button>
          </div>

          {/* History */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          {/* File Operations */}
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="outline" onClick={onSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onExport}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onImport}>
              <Upload className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onClear}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
