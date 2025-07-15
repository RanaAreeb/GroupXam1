import { useState, useCallback, useRef } from "react";

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: "drawing" | "shape" | "text" | "image" | "sticky" | "arrow" | "math";
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
  mathExpression?: string;
  stickyColor?: string;
  arrowType?: "straight" | "curved" | "double";
}

export interface WhiteboardState {
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
  currentTemplate: string;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  backgroundColor: string;
  pageSize: "A4" | "A3" | "Letter" | "Custom";
  customPageSize: { width: number; height: number };
}

export const useWhiteboard = () => {
  const [state, setState] = useState<WhiteboardState>({
    elements: [],
    selectedTool: "pen",
    selectedColor: "#000000",
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
    currentTemplate: "blank",
    snapToGrid: false,
    gridSize: 20,
    showRulers: true,
    backgroundColor: "#ffffff",
    pageSize: "A4",
    customPageSize: { width: 210, height: 297 },
  });

  const historyRef = useRef<DrawingElement[][]>([]);
  const historyIndexRef = useRef<number>(-1);

  // Add element to canvas
  const addElement = useCallback((element: DrawingElement) => {
    setState((prev) => {
      const newElements = [...prev.elements, element];
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...newElements]);

      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;

      return {
        ...prev,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Update element
  const updateElement = useCallback(
    (id: string, updates: Partial<DrawingElement>) => {
      setState((prev) => {
        const newElements = prev.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        );

        const newHistory = prev.history.slice(0, prev.historyIndex + 1);
        newHistory.push([...newElements]);

        historyRef.current = newHistory;
        historyIndexRef.current = newHistory.length - 1;

        return {
          ...prev,
          elements: newElements,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    []
  );

  // Delete element
  const deleteElement = useCallback((id: string) => {
    setState((prev) => {
      const newElements = prev.elements.filter((el) => el.id !== id);
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...newElements]);

      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;

      return {
        ...prev,
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([]);

      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;

      return {
        ...prev,
        elements: [],
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // Undo
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        historyIndexRef.current = newIndex;
        return {
          ...prev,
          historyIndex: newIndex,
          elements: prev.history[newIndex],
        };
      }
      return prev;
    });
  }, []);

  // Redo
  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        historyIndexRef.current = newIndex;
        return {
          ...prev,
          historyIndex: newIndex,
          elements: prev.history[newIndex],
        };
      }
      return prev;
    });
  }, []);

  // Select tool
  const selectTool = useCallback((toolId: string) => {
    setState((prev) => ({ ...prev, selectedTool: toolId }));
  }, []);

  // Select color
  const selectColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, selectedColor: color }));
  }, []);

  // Change stroke width
  const changeStrokeWidth = useCallback((width: number) => {
    setState((prev) => ({ ...prev, strokeWidth: width }));
  }, []);

  // Change font size
  const changeFontSize = useCallback((size: number) => {
    setState((prev) => ({ ...prev, fontSize: size }));
  }, []);

  // Toggle grid
  const toggleGrid = useCallback(() => {
    setState((prev) => ({ ...prev, showGrid: !prev.showGrid }));
  }, []);

  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setState((prev) => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  // Zoom in
  const zoomIn = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 5) }));
  }, []);

  // Zoom out
  const zoomOut = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.1) }));
  }, []);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: 1 }));
  }, []);

  // Pan canvas
  const panCanvas = useCallback((deltaX: number, deltaY: number) => {
    setState((prev) => ({
      ...prev,
      pan: {
        x: prev.pan.x + deltaX,
        y: prev.pan.y + deltaY,
      },
    }));
  }, []);

  // Set page size
  const setPageSize = useCallback(
    (
      size: "A4" | "A3" | "Letter" | "Custom",
      customSize?: { width: number; height: number }
    ) => {
      setState((prev) => ({
        ...prev,
        pageSize: size,
        customPageSize: customSize || prev.customPageSize,
      }));
    },
    []
  );

  // Set background color
  const setBackgroundColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, backgroundColor: color }));
  }, []);

  // Add collaborator
  const addCollaborator = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      collaborators: [...prev.collaborators, userId],
      isCollaborating: true,
    }));
  }, []);

  // Remove collaborator
  const removeCollaborator = useCallback((userId: string) => {
    setState((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((id) => id !== userId),
      isCollaborating: prev.collaborators.length > 1,
    }));
  }, []);

  // Export canvas as image
  const exportAsImage = useCallback((format: "png" | "jpg" | "svg" = "png") => {
    // This would be implemented in the component
    return { format, dataUrl: "" };
  }, []);

  // Save whiteboard
  const saveWhiteboard = useCallback(
    (name: string) => {
      const whiteboardData = {
        name,
        state,
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(whiteboardData);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `${name}.json`;
      link.click();
    },
    [state]
  );

  // Load whiteboard
  const loadWhiteboard = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const whiteboardData = JSON.parse(event.target?.result as string);
        setState(whiteboardData.state);
      } catch (error) {
        console.error("Error loading whiteboard:", error);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    state,
    addElement,
    updateElement,
    deleteElement,
    clearCanvas,
    undo,
    redo,
    selectTool,
    selectColor,
    changeStrokeWidth,
    changeFontSize,
    toggleGrid,
    toggleSnapToGrid,
    zoomIn,
    zoomOut,
    resetZoom,
    panCanvas,
    setPageSize,
    setBackgroundColor,
    addCollaborator,
    removeCollaborator,
    exportAsImage,
    saveWhiteboard,
    loadWhiteboard,
  };
};
