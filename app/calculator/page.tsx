"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  History,
  Settings,
  Copy,
  Delete,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Brain,
  Zap,
  Target,
  Download,
  Upload,
  Code,
  Sigma,
  TrendingUp,
  Grid3X3,
  Palette,
  Volume2,
  VolumeX,
  Save,
  FileText,
  Calculator as CalcIcon,
  Infinity,
  Pi,
  X,
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import PageTransition from "@/components/PageTransition";

interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface Variable {
  name: string;
  value: number;
}

interface GraphPoint {
  x: number;
  y: number;
}

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operator: string | null;
  waitingForOperand: boolean;
  history: CalculationHistory[];
  memory: number[];
  angleMode: 'DEG' | 'RAD' | 'GRAD';
  theme: 'light' | 'dark' | 'auto';
  precision: number;
  soundEnabled: boolean;
  variables: Variable[];
  expression: string;
  graphData: GraphPoint[];
  baseMode: 'DEC' | 'HEX' | 'OCT' | 'BIN';
  complexMode: boolean;
}

const SCIENTIFIC_FUNCTIONS = {
  // Basic functions
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,

  // Logarithmic functions
  log: Math.log10,
  ln: Math.log,
  log2: (x: number) => Math.log(x) / Math.LN2,

  // Power and root functions
  sqrt: Math.sqrt,
  cbrt: (x: number) => Math.pow(x, 1 / 3),
  pow: Math.pow,

  // Other functions
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  exp: Math.exp,
  factorial: (n: number) => {
    if (n < 0) throw new Error('Factorial of negative number');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  },
  rand: () => Math.random(),
  pi: Math.PI,
  e: Math.E,

  // Advanced mathematical functions
  gamma: (x: number): number => {
    // Stirling's approximation for gamma function
    if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * SCIENTIFIC_FUNCTIONS.gamma(1 - x));
    x -= 1;
    let a = 0.99999999999980993;
    const coeff = [676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012,
      9.9843695780195716e-6, 1.5056327351493116e-7];
    for (let i = 0; i < coeff.length; i++) {
      a += coeff[i] / (x + i + 1);
    }
    const t = x + coeff.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  },

  // Statistical functions
  mean: (arr: number[]) => {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  },
  median: (arr: number[]) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  mode: (arr: number[]) => {
    if (arr.length === 0) return 0;
    const freq: { [key: number]: number } = {};
    arr.forEach(n => freq[n] = (freq[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(freq));
    const result = Object.keys(freq).find(key => freq[Number(key)] === maxFreq);
    return result ? Number(result) : 0;
  },
  stddev: (arr: number[]) => {
    if (arr.length === 0) return 0;
    const mean = SCIENTIFIC_FUNCTIONS.mean(arr);
    const variance = arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  },
  variance: (arr: number[]) => {
    if (arr.length === 0) return 0;
    const mean = SCIENTIFIC_FUNCTIONS.mean(arr);
    return arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length;
  },
  min: (arr: number[]) => {
    if (arr.length === 0) return 0;
    return Math.min(...arr);
  },
  max: (arr: number[]) => {
    if (arr.length === 0) return 0;
    return Math.max(...arr);
  },
  range: (arr: number[]) => {
    if (arr.length === 0) return 0;
    return Math.max(...arr) - Math.min(...arr);
  },

  // Number theory functions
  gcd: (a: number, b: number): number => b === 0 ? Math.abs(a) : SCIENTIFIC_FUNCTIONS.gcd(b, a % b),
  lcm: (a: number, b: number) => Math.abs(a * b) / SCIENTIFIC_FUNCTIONS.gcd(a, b),
  isPrime: (n: number) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  },

  // Combinatorics
  permutation: (n: number, r: number) => SCIENTIFIC_FUNCTIONS.factorial(n) / SCIENTIFIC_FUNCTIONS.factorial(n - r),
  combination: (n: number, r: number) => SCIENTIFIC_FUNCTIONS.factorial(n) / (SCIENTIFIC_FUNCTIONS.factorial(r) * SCIENTIFIC_FUNCTIONS.factorial(n - r)),

  // Base conversions
  toBinary: (n: number) => n.toString(2),
  toHex: (n: number) => n.toString(16).toUpperCase(),
  toOctal: (n: number) => n.toString(8),
  fromBinary: (s: string) => parseInt(s, 2),
  fromHex: (s: string) => parseInt(s, 16),
  fromOctal: (s: string) => parseInt(s, 8),
};

const KEYBOARD_MAPPING: { [key: string]: string } = {
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
  '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
  '+': '+', '-': '-', '*': '×', '/': '÷', '=': '=',
  'Enter': '=', 'Escape': 'C', 'Backspace': '⌫',
  '.': '.', ',': '.',
  '(': '(', ')': ')',
  '^': '^', '**': '^',
  '!': '!',
  'p': 'π', 'e': 'e',
};

export default function CalculatorPage() {
  const { user, isLoggedIn } = useAuth();
  const [mode, setMode] = useState<'simple' | 'scientific'>('simple');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    history: [],
    memory: [0, 0, 0, 0, 0], // Multiple memory slots
    angleMode: 'DEG',
    theme: 'auto',
    precision: 10,
    soundEnabled: true,
    variables: [],
    expression: '',
    graphData: [],
    baseMode: 'DEC',
    complexMode: false,
  });

  const [dataInput, setDataInput] = useState('');
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<'calculator' | 'programmer' | 'graphing' | 'converter'>('calculator');
  const audioContextRef = useRef<AudioContext | null>(null);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't interfere with input fields
      const target = event.target as HTMLElement;
      if (target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('input') ||
        target.closest('textarea')
      )) {
        return; // Let the input handle the event
      }

      event.preventDefault();
      const key = event.key;

      if (KEYBOARD_MAPPING[key]) {
        handleInput(KEYBOARD_MAPPING[key]);
      } else if (key === 'c' || key === 'C') {
        handleInput('C');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Play sound feedback
  const playSound = useCallback((frequency: number = 800, duration: number = 100) => {
    if (!state.soundEnabled || !audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  }, [state.soundEnabled]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('advanced-calculator-state');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setState(prev => ({
          ...prev,
          ...parsed,
          history: parsed.history?.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          })) || [],
        }));
      } catch (error) {
        console.error('Error loading calculator state:', error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('advanced-calculator-state', JSON.stringify({
      ...state,
      // Don't save display and current calculation state
      display: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false,
    }));
  }, [state]);

  const addToHistory = useCallback((expression: string, result: string) => {
    const newHistory: CalculationHistory = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      expression,
      result,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      history: [newHistory, ...prev.history].slice(0, 100), // Keep only last 100 calculations
    }));
  }, []);

  const formatResult = useCallback((value: number, precision: number): string => {
    if (isNaN(value) || !isFinite(value)) return 'Error';

    // Handle very large or very small numbers with scientific notation
    if (Math.abs(value) > Math.pow(10, precision) || (Math.abs(value) < Math.pow(10, -precision) && value !== 0)) {
      return value.toExponential(precision - 1);
    }

    // Round to specified precision
    const rounded = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    return rounded.toString();
  }, []);

  const handleInput = useCallback((input: string) => {
    playSound();

    setState(prev => {
      let newState = { ...prev };

      switch (input) {
        case 'C':
          newState = {
            ...newState,
            display: '0',
            previousValue: null,
            operator: null,
            waitingForOperand: false,
            expression: '',
          };
          setCalculationSteps([]);
          break;

        case 'CE':
          newState.display = '0';
          break;

        case '⌫':
          newState.display = newState.display.length > 1
            ? newState.display.slice(0, -1)
            : '0';
          break;

        case '±':
          newState.display = newState.display === '0'
            ? '0'
            : (parseFloat(newState.display) * -1).toString();
          break;

        case '.':
          if (newState.waitingForOperand) {
            newState.display = '0.';
            newState.waitingForOperand = false;
          } else if (newState.display.indexOf('.') === -1) {
            newState.display += '.';
          }
          break;

        case '+':
        case '-':
        case '×':
        case '÷':
        case '^':
        case 'mod':
          if (newState.previousValue === null) {
            newState.previousValue = parseFloat(newState.display);
          } else if (newState.operator && !newState.waitingForOperand) {
            try {
              const result = calculate(
                newState.previousValue,
                parseFloat(newState.display),
                newState.operator
              );
              newState.display = formatResult(result, newState.precision);
              newState.previousValue = result;
            } catch (error) {
              newState.display = 'Error';
              newState.previousValue = null;
              newState.operator = null;
              newState.waitingForOperand = true;
            }
          }
          newState.waitingForOperand = true;
          newState.operator = input;
          newState.expression = `${newState.previousValue} ${input}`;
          break;

        case '=':
          if (newState.previousValue !== null && newState.operator) {
            try {
              const result = calculate(
                newState.previousValue,
                parseFloat(newState.display),
                newState.operator
              );

              const expression = `${newState.previousValue} ${newState.operator} ${newState.display}`;
              addToHistory(expression, formatResult(result, newState.precision));

              // Add calculation step
              setCalculationSteps(prev => [...prev, `${expression} = ${formatResult(result, newState.precision)}`]);

              newState.display = formatResult(result, newState.precision);
              newState.previousValue = null;
              newState.operator = null;
              newState.waitingForOperand = true;
              newState.expression = '';
            } catch (error) {
              newState.display = 'Error';
              newState.previousValue = null;
              newState.operator = null;
              newState.waitingForOperand = true;
            }
          }
          break;

        case 'π':
          newState.display = formatResult(Math.PI, newState.precision);
          newState.waitingForOperand = true;
          break;

        case 'e':
          newState.display = formatResult(Math.E, newState.precision);
          newState.waitingForOperand = true;
          break;

        case 'not':
          try {
            const currentValue = parseFloat(newState.display);
            const result = ~Math.floor(currentValue);
            newState.display = formatResult(result, newState.precision);
            newState.waitingForOperand = true;
          } catch (error) {
            newState.display = 'Error';
          }
          break;

        case 'lsh':
          try {
            const currentValue = parseFloat(newState.display);
            const result = Math.floor(currentValue) << 1;
            newState.display = formatResult(result, newState.precision);
            newState.waitingForOperand = true;
          } catch (error) {
            newState.display = 'Error';
          }
          break;

        case 'rsh':
          try {
            const currentValue = parseFloat(newState.display);
            const result = Math.floor(currentValue) >> 1;
            newState.display = formatResult(result, newState.precision);
            newState.waitingForOperand = true;
          } catch (error) {
            newState.display = 'Error';
          }
          break;

        default:
          if (input.match(/[0-9A-F]/)) {
            if (newState.baseMode === 'HEX' || input.match(/[0-9]/)) {
              if (newState.waitingForOperand) {
                newState.display = input;
                newState.waitingForOperand = false;
              } else {
                newState.display = newState.display === '0' ? input : newState.display + input;
              }
            }
          }
          break;
      }

      return newState;
    });
  }, [addToHistory, playSound, formatResult]);

  const evaluateExpression = useCallback(() => {
    if (!state.expression.trim()) return;

    try {
      let expression = state.expression.trim();

      // Replace common mathematical symbols and functions
      expression = expression
        .replace(/\^/g, '**') // Replace ^ with ** for JavaScript
        .replace(/π/g, 'Math.PI') // Replace π with Math.PI
        .replace(/\be\b/g, 'Math.E') // Replace e with Math.E (but not in words like "sin")
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/asin\(/g, 'Math.asin(')
        .replace(/acos\(/g, 'Math.acos(')
        .replace(/atan\(/g, 'Math.atan(')
        .replace(/sinh\(/g, 'Math.sinh(')
        .replace(/cosh\(/g, 'Math.cosh(')
        .replace(/tanh\(/g, 'Math.tanh(')
        .replace(/asinh\(/g, 'Math.asinh(')
        .replace(/acosh\(/g, 'Math.acosh(')
        .replace(/atanh\(/g, 'Math.atanh(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log2\(/g, '(Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/cbrt\(/g, 'Math.cbrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/floor\(/g, 'Math.floor(')
        .replace(/ceil\(/g, 'Math.ceil(')
        .replace(/round\(/g, 'Math.round(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/factorial\(/g, 'factorial(');

      // Handle angle mode conversion for trigonometric functions
      if (state.angleMode === 'DEG') {
        expression = expression
          .replace(/Math\.sin\(/g, 'Math.sin(')
          .replace(/Math\.cos\(/g, 'Math.cos(')
          .replace(/Math\.tan\(/g, 'Math.tan(')
          .replace(/Math\.asin\(/g, 'Math.asin(')
          .replace(/Math\.acos\(/g, 'Math.acos(')
          .replace(/Math\.atan\(/g, 'Math.atan(');

        // Convert degrees to radians for input
        expression = expression.replace(/(Math\.(sin|cos|tan|asin|acos|atan)\()([^)]+)\)/g, (match, func, trigFunc, angle) => {
          return `${func}(${angle} * Math.PI / 180)`;
        });
      } else if (state.angleMode === 'GRAD') {
        expression = expression.replace(/(Math\.(sin|cos|tan|asin|acos|atan)\()([^)]+)\)/g, (match, func, trigFunc, angle) => {
          return `${func}(${angle} * Math.PI / 200)`;
        });
      }

      // Add factorial function
      const factorial = (n: number) => {
        if (n < 0) throw new Error('Factorial of negative number');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
          result *= i;
        }
        return result;
      };

      // Evaluate the expression
      const result = eval(expression);

      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      const formattedResult = formatResult(result, state.precision);
      addToHistory(state.expression, formattedResult);

      setState(prev => ({
        ...prev,
        display: formattedResult,
        waitingForOperand: true,
        expression: ''
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        display: 'Error',
        expression: ''
      }));
    }
  }, [state.expression, state.angleMode, state.precision, addToHistory, formatResult]);

  const handleScientificFunction = useCallback((func: string) => {
    setState(prev => {
      const currentValue = parseFloat(prev.display);
      let result: number;

      try {
        // Handle special cases first
        if (func === 'rand') {
          result = SCIENTIFIC_FUNCTIONS.rand();
        } else if (func === 'pi') {
          result = SCIENTIFIC_FUNCTIONS.pi;
        } else if (func === 'e') {
          result = SCIENTIFIC_FUNCTIONS.e;
        } else {
          // Check for invalid input
          if (isNaN(currentValue)) {
            throw new Error('Invalid input');
          }

          switch (func) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'asin':
            case 'acos':
            case 'atan':
              const angle = prev.angleMode === 'DEG' ? currentValue * Math.PI / 180 :
                prev.angleMode === 'GRAD' ? currentValue * Math.PI / 200 : currentValue;
              result = (SCIENTIFIC_FUNCTIONS[func] as (x: number) => number)(angle);
              break;
            case 'sinh':
            case 'cosh':
            case 'tanh':
            case 'asinh':
            case 'acosh':
            case 'atanh':
            case 'log':
            case 'ln':
            case 'log2':
            case 'sqrt':
            case 'cbrt':
            case 'abs':
            case 'floor':
            case 'ceil':
            case 'round':
            case 'exp':
            case 'gamma':
              result = (SCIENTIFIC_FUNCTIONS[func] as (x: number) => number)(currentValue);
              break;
            case 'factorial':
              if (currentValue < 0 || currentValue > 170) {
                throw new Error('Factorial out of range');
              }
              result = SCIENTIFIC_FUNCTIONS.factorial(Math.floor(currentValue));
              break;
            default:
              result = currentValue;
          }
        }

        if (isNaN(result) || !isFinite(result)) {
          throw new Error('Invalid calculation');
        }

        const expression = func === 'rand' ? 'rand()' : func === 'pi' ? 'π' : func === 'e' ? 'e' : `${func}(${currentValue})`;
        addToHistory(expression, formatResult(result, prev.precision));

        return {
          ...prev,
          display: formatResult(result, prev.precision),
          waitingForOperand: true,
        };
      } catch (error) {
        return {
          ...prev,
          display: 'Error',
        };
      }
    });
  }, [addToHistory, formatResult]);

  const handleMemory = useCallback((operation: 'MC' | 'MR' | 'MS' | 'M+' | 'M-', slot: number = 0) => {
    playSound(600);

    setState(prev => {
      try {
        const currentValue = parseFloat(prev.display);
        const newMemory = [...prev.memory];

        if (isNaN(currentValue) && (operation === 'MS' || operation === 'M+' || operation === 'M-')) {
          return { ...prev, display: 'Error' };
        }

        switch (operation) {
          case 'MC':
            newMemory[slot] = 0;
            break;
          case 'MR':
            return { ...prev, display: formatResult(newMemory[slot], prev.precision), waitingForOperand: true };
          case 'MS':
            newMemory[slot] = currentValue;
            break;
          case 'M+':
            newMemory[slot] += currentValue;
            break;
          case 'M-':
            newMemory[slot] -= currentValue;
            break;
        }

        return { ...prev, memory: newMemory };
      } catch (error) {
        return { ...prev, display: 'Error' };
      }
    });
  }, [playSound, formatResult]);

  const handleVariable = useCallback((operation: 'store' | 'recall', name: string, value?: number) => {
    setState(prev => {
      try {
        const newVariables = [...prev.variables];
        const existingIndex = newVariables.findIndex(v => v.name === name);

        if (operation === 'store' && value !== undefined) {
          if (isNaN(value)) {
            return { ...prev, display: 'Error' };
          }
          if (existingIndex >= 0) {
            newVariables[existingIndex].value = value;
          } else {
            newVariables.push({ name, value });
          }
        } else if (operation === 'recall' && existingIndex >= 0) {
          return { ...prev, display: formatResult(newVariables[existingIndex].value, prev.precision), waitingForOperand: true };
        } else if (operation === 'recall' && existingIndex === -1) {
          return { ...prev, display: 'Error' };
        }

        return { ...prev, variables: newVariables };
      } catch (error) {
        return { ...prev, display: 'Error' };
      }
    });
  }, [formatResult]);


  const calculate = (firstValue: number, secondValue: number, operator: string): number => {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) throw new Error('Division by zero');
        return firstValue / secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      case 'mod':
        return firstValue % secondValue;
      case 'and':
        return firstValue & secondValue;
      case 'or':
        return firstValue | secondValue;
      case 'xor':
        return firstValue ^ secondValue;
      case 'nand':
        return ~(firstValue & secondValue);
      case 'nor':
        return ~(firstValue | secondValue);
      default:
        return secondValue;
    }
  };

  const convertBase = useCallback((value: string, fromBase: string, toBase: string): string => {
    try {
      if (!value || value.trim() === '') return '0';

      let decimal: number;

      switch (fromBase) {
        case 'BIN':
          if (!/^[01]+$/.test(value)) return 'Error';
          decimal = parseInt(value, 2);
          break;
        case 'OCT':
          if (!/^[0-7]+$/.test(value)) return 'Error';
          decimal = parseInt(value, 8);
          break;
        case 'HEX':
          if (!/^[0-9A-Fa-f]+$/.test(value)) return 'Error';
          decimal = parseInt(value, 16);
          break;
        default:
          if (!/^[0-9]+$/.test(value)) return 'Error';
          decimal = parseInt(value, 10);
      }

      if (isNaN(decimal) || !isFinite(decimal)) return 'Error';

      switch (toBase) {
        case 'BIN':
          return Math.floor(decimal).toString(2);
        case 'OCT':
          return Math.floor(decimal).toString(8);
        case 'HEX':
          return Math.floor(decimal).toString(16).toUpperCase();
        default:
          return Math.floor(decimal).toString(10);
      }
    } catch (error) {
      return 'Error';
    }
  }, []);

  const generateGraph = useCallback((expression: string, xMin: number = -10, xMax: number = 10, steps: number = 100) => {
    try {
      if (!expression || expression.trim() === '') {
        setState(prev => ({ ...prev, graphData: [] }));
        return;
      }

      const points: GraphPoint[] = [];
      const stepSize = (xMax - xMin) / steps;

      for (let i = 0; i <= steps; i++) {
        const x = xMin + i * stepSize;
        try {
          // Replace x with actual value in expression
          const expr = expression.replace(/x/g, x.toString());
          // Use the expression evaluator directly
          let processedExpr = expr.trim();

          // Replace common mathematical symbols and functions
          processedExpr = processedExpr
            .replace(/\^/g, '**') // Replace ^ with ** for JavaScript
            .replace(/π/g, 'Math.PI') // Replace π with Math.PI
            .replace(/\be\b/g, 'Math.E') // Replace e with Math.E
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/exp\(/g, 'Math.exp(');

          const y = eval(processedExpr);
          if (isFinite(y) && !isNaN(y)) {
            points.push({ x, y });
          }
        } catch (error) {
          // Skip invalid points
        }
      }

      setState(prev => ({ ...prev, graphData: points }));
    } catch (error) {
      setState(prev => ({ ...prev, graphData: [] }));
    }
  }, []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(state.display);
  }, [state.display]);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  const exportData = useCallback(() => {
    const dataToExport = {
      history: state.history,
      variables: state.variables,
      memory: state.memory,
      settings: {
        angleMode: state.angleMode,
        precision: state.precision,
        baseMode: state.baseMode,
        theme: state.theme,
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setState(prev => ({
          ...prev,
          history: data.history?.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          })) || prev.history,
          variables: data.variables || prev.variables,
          memory: data.memory || prev.memory,
          angleMode: data.settings?.angleMode || prev.angleMode,
          precision: data.settings?.precision || prev.precision,
          baseMode: data.settings?.baseMode || prev.baseMode,
          theme: data.settings?.theme || prev.theme,
        }));
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  const toggleAngleMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      angleMode: prev.angleMode === 'DEG' ? 'RAD' : prev.angleMode === 'RAD' ? 'GRAD' : 'DEG'
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'auto' : 'light'
    }));
  }, []);

  const SimpleCalculator = () => (
    <div className="grid grid-cols-4 gap-3 p-6">
      {/* Display */}
      <div className="col-span-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-right">
          {/* Operation Preview */}
          {state.expression && (
            <div className="text-lg font-mono text-gray-600 dark:text-gray-400 mb-2 min-h-[1.5rem]">
              {state.expression}
            </div>
          )}
          {/* Main Display */}
          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white overflow-hidden">
            {state.display}
          </div>
          {/* Status Indicators */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex gap-2">
              {state.previousValue !== null && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded animate-pulse">
                  {state.previousValue}
                </span>
              )}
              {state.operator && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded animate-bounce">
                  {state.operator}
                </span>
              )}
            </div>
            <div className="text-gray-400 flex items-center gap-1">
              {state.waitingForOperand ? (
                <>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  Enter number
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Ready
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <Button variant="outline" onClick={() => handleInput('C')} className="h-16 text-lg">
        C
      </Button>
      <Button variant="outline" onClick={() => handleInput('±')} className="h-16 text-lg">
        ±
      </Button>
      <Button variant="outline" onClick={() => handleInput('⌫')} className="h-16 text-lg">
        ⌫
      </Button>
      <Button variant="outline" onClick={() => handleInput('÷')} className="h-16 text-lg bg-orange-500 text-white hover:bg-orange-600">
        ÷
      </Button>

      {/* Row 2 */}
      <Button variant="outline" onClick={() => handleInput('7')} className="h-16 text-lg">
        7
      </Button>
      <Button variant="outline" onClick={() => handleInput('8')} className="h-16 text-lg">
        8
      </Button>
      <Button variant="outline" onClick={() => handleInput('9')} className="h-16 text-lg">
        9
      </Button>
      <Button variant="outline" onClick={() => handleInput('×')} className="h-16 text-lg bg-orange-500 text-white hover:bg-orange-600">
        ×
      </Button>

      {/* Row 3 */}
      <Button variant="outline" onClick={() => handleInput('4')} className="h-16 text-lg">
        4
      </Button>
      <Button variant="outline" onClick={() => handleInput('5')} className="h-16 text-lg">
        5
      </Button>
      <Button variant="outline" onClick={() => handleInput('6')} className="h-16 text-lg">
        6
      </Button>
      <Button variant="outline" onClick={() => handleInput('-')} className="h-16 text-lg bg-orange-500 text-white hover:bg-orange-600">
        −
      </Button>

      {/* Row 4 */}
      <Button variant="outline" onClick={() => handleInput('1')} className="h-16 text-lg">
        1
      </Button>
      <Button variant="outline" onClick={() => handleInput('2')} className="h-16 text-lg">
        2
      </Button>
      <Button variant="outline" onClick={() => handleInput('3')} className="h-16 text-lg">
        3
      </Button>
      <Button variant="outline" onClick={() => handleInput('+')} className="h-16 text-lg bg-orange-500 text-white hover:bg-orange-600">
        +
      </Button>

      {/* Row 5 */}
      <Button variant="outline" onClick={() => handleInput('0')} className="h-16 text-lg col-span-2">
        0
      </Button>
      <Button variant="outline" onClick={() => handleInput('.')} className="h-16 text-lg">
        .
      </Button>
      <Button variant="outline" onClick={() => handleInput('=')} className="h-16 text-lg bg-orange-500 text-white hover:bg-orange-600">
        =
      </Button>

      {/* Calculation Steps Display */}
      {calculationSteps.length > 0 && (
        <div className="col-span-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Calculation Steps:</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {calculationSteps.slice(-5).map((step, index) => (
                <div key={index} className="text-sm font-mono text-blue-700 dark:text-blue-300 bg-white/50 dark:bg-blue-800/30 px-2 py-1 rounded">
                  {step}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCalculationSteps([])}
              className="mt-2 text-xs"
            >
              Clear Steps
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const ProgrammerCalculator = () => (
    <div className="p-6 space-y-4">
      {/* Display with multiple bases */}
      <div className="space-y-2">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-2 text-sm mb-2">
            <Button
              variant={state.baseMode === 'DEC' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, baseMode: 'DEC' }))}
            >
              DEC
            </Button>
            <Button
              variant={state.baseMode === 'HEX' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, baseMode: 'HEX' }))}
            >
              HEX
            </Button>
            <Button
              variant={state.baseMode === 'OCT' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, baseMode: 'OCT' }))}
            >
              OCT
            </Button>
            <Button
              variant={state.baseMode === 'BIN' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setState(prev => ({ ...prev, baseMode: 'BIN' }))}
            >
              BIN
            </Button>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-500">DEC: {convertBase(state.display, state.baseMode, 'DEC')}</div>
            <div className="text-xs text-gray-500">HEX: {convertBase(state.display, state.baseMode, 'HEX')}</div>
            <div className="text-xs text-gray-500">OCT: {convertBase(state.display, state.baseMode, 'OCT')}</div>
            <div className="text-xs text-gray-500">BIN: {convertBase(state.display, state.baseMode, 'BIN')}</div>
          </div>

          {/* Operation Preview */}
          {state.expression && (
            <div className="text-lg font-mono text-gray-600 dark:text-gray-400 mb-2 min-h-[1.5rem] border-b border-gray-200 dark:border-gray-700 pb-2">
              {state.expression}
            </div>
          )}

          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mt-2">
            {state.display}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex gap-2">
              {state.previousValue !== null && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {state.previousValue}
                </span>
              )}
              {state.operator && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                  {state.operator}
                </span>
              )}
            </div>
            <div className="text-gray-400">
              {state.waitingForOperand ? 'Enter number' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Bitwise Operations */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" onClick={() => handleInput('and')} className="h-12">AND</Button>
        <Button variant="outline" onClick={() => handleInput('or')} className="h-12">OR</Button>
        <Button variant="outline" onClick={() => handleInput('xor')} className="h-12">XOR</Button>
        <Button variant="outline" onClick={() => handleInput('not')} className="h-12">NOT</Button>

        <Button variant="outline" onClick={() => handleInput('nand')} className="h-12">NAND</Button>
        <Button variant="outline" onClick={() => handleInput('nor')} className="h-12">NOR</Button>
        <Button variant="outline" onClick={() => handleInput('lsh')} className="h-12">LSH</Button>
        <Button variant="outline" onClick={() => handleInput('rsh')} className="h-12">RSH</Button>
      </div>

      {/* Hex digits (when in HEX mode) */}
      {state.baseMode === 'HEX' && (
        <div className="grid grid-cols-6 gap-2">
          {['A', 'B', 'C', 'D', 'E', 'F'].map(digit => (
            <Button
              key={digit}
              variant="outline"
              onClick={() => handleInput(digit)}
              className="h-12"
            >
              {digit}
            </Button>
          ))}
        </div>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" onClick={() => handleInput('C')} className="h-12 bg-red-500 text-white hover:bg-red-600">C</Button>
        <Button variant="outline" onClick={() => handleInput('CE')} className="h-12">CE</Button>
        <Button variant="outline" onClick={() => handleInput('⌫')} className="h-12">⌫</Button>
        <Button variant="outline" onClick={() => handleInput('÷')} className="h-12 bg-orange-500 text-white hover:bg-orange-600">÷</Button>

        {[7, 8, 9].map(num => (
          <Button key={num} variant="outline" onClick={() => handleInput(num.toString())} className="h-12">
            {num}
          </Button>
        ))}
        <Button variant="outline" onClick={() => handleInput('×')} className="h-12 bg-orange-500 text-white hover:bg-orange-600">×</Button>

        {[4, 5, 6].map(num => (
          <Button key={num} variant="outline" onClick={() => handleInput(num.toString())} className="h-12">
            {num}
          </Button>
        ))}
        <Button variant="outline" onClick={() => handleInput('-')} className="h-12 bg-orange-500 text-white hover:bg-orange-600">−</Button>

        {[1, 2, 3].map(num => (
          <Button key={num} variant="outline" onClick={() => handleInput(num.toString())} className="h-12">
            {num}
          </Button>
        ))}
        <Button variant="outline" onClick={() => handleInput('+')} className="h-12 bg-orange-500 text-white hover:bg-orange-600">+</Button>

        <Button variant="outline" onClick={() => handleInput('0')} className="h-12 col-span-2">0</Button>
        <Button variant="outline" onClick={() => handleInput('mod')} className="h-12">MOD</Button>
        <Button variant="outline" onClick={() => handleInput('=')} className="h-12 bg-orange-500 text-white hover:bg-orange-600">=</Button>
      </div>
    </div>
  );


  const GraphingCalculator = () => (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="function-input">Function (use 'x' as variable)</Label>
        <div className="flex gap-2">
          <Input
            id="function-input"
            placeholder="e.g., x^2, sin(x), log(x)"
            value={state.expression}
            onChange={(e) => setState(prev => ({ ...prev, expression: e.target.value }))}
          />
          <Button onClick={() => generateGraph(state.expression)}>
            Graph
          </Button>
        </div>
      </div>

      {state.graphData.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-64 relative overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 400 200" className="border">
            {/* Grid lines */}
            {Array.from({ length: 21 }, (_, i) => (
              <g key={i}>
                <line x1={i * 20} y1={0} x2={i * 20} y2={200} stroke="#e5e7eb" strokeWidth={0.5} />
                <line x1={0} y1={i * 10} x2={400} y2={i * 10} stroke="#e5e7eb" strokeWidth={0.5} />
              </g>
            ))}

            {/* Axes */}
            <line x1={200} y1={0} x2={200} y2={200} stroke="#374151" strokeWidth={1} />
            <line x1={0} y1={100} x2={400} y2={100} stroke="#374151" strokeWidth={1} />

            {/* Function plot */}
            <polyline
              points={state.graphData.map(point =>
                `${200 + point.x * 20},${100 - point.y * 10}`
              ).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </svg>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Common Functions</Label>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {['x^2', 'x^3', 'sqrt(x)', 'sin(x)', 'cos(x)', 'tan(x)', 'log(x)', 'ln(x)'].map(func => (
              <Button
                key={func}
                variant="outline"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, expression: func }))}
              >
                {func}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Graph Controls</Label>
          <div className="space-y-2 mt-1">
            <Button variant="outline" size="sm" onClick={() => generateGraph(state.expression, -20, 20)}>
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" onClick={() => generateGraph(state.expression, -5, 5)}>
              Zoom In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const UnitConverter = () => {
    const [fromUnit, setFromUnit] = useState('meters');
    const [toUnit, setToUnit] = useState('feet');
    const [category, setCategory] = useState('length');

    const conversions = {
      length: {
        meters: 1,
        feet: 3.28084,
        inches: 39.3701,
        centimeters: 100,
        kilometers: 0.001,
        miles: 0.000621371,
      },
      weight: {
        kilograms: 1,
        pounds: 2.20462,
        ounces: 35.274,
        grams: 1000,
        tons: 0.001,
      },
      temperature: {
        celsius: (c: number) => c,
        fahrenheit: (c: number) => (c * 9 / 5) + 32,
        kelvin: (c: number) => c + 273.15,
      },
    };

    const convert = () => {
      try {
        const value = parseFloat(state.display);
        if (isNaN(value) || !isFinite(value)) {
          setState(prev => ({ ...prev, display: 'Error' }));
          return;
        }

        if (category === 'temperature') {
          // Temperature conversions need special handling
          let celsius = value;
          if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5 / 9;
          if (fromUnit === 'kelvin') celsius = value - 273.15;

          const result = (conversions.temperature as any)[toUnit](celsius);
          if (isNaN(result) || !isFinite(result)) {
            setState(prev => ({ ...prev, display: 'Error' }));
            return;
          }
          setState(prev => ({ ...prev, display: formatResult(result, prev.precision) }));
        } else {
          const categoryConversions = conversions[category as keyof typeof conversions] as { [key: string]: number };
          if (!categoryConversions[fromUnit] || !categoryConversions[toUnit]) {
            setState(prev => ({ ...prev, display: 'Error' }));
            return;
          }
          const result = (value / categoryConversions[fromUnit]) * categoryConversions[toUnit];
          if (isNaN(result) || !isFinite(result)) {
            setState(prev => ({ ...prev, display: 'Error' }));
            return;
          }
          setState(prev => ({ ...prev, display: formatResult(result, prev.precision) }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, display: 'Error' }));
      }
    };

    return (
      <div className="p-6 space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          {/* Operation Preview */}
          {state.expression && (
            <div className="text-lg font-mono text-gray-600 dark:text-gray-400 mb-2 min-h-[1.5rem] border-b border-gray-200 dark:border-gray-700 pb-2">
              {state.expression}
            </div>
          )}

          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
            {state.display}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex gap-2">
              {state.previousValue !== null && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {state.previousValue}
                </span>
              )}
              {state.operator && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                  {state.operator}
                </span>
              )}
            </div>
            <div className="text-gray-400">
              {state.waitingForOperand ? 'Enter number' : 'Ready'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="length">Length</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(conversions[category as keyof typeof conversions]).map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(conversions[category as keyof typeof conversions]).map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={convert} className="w-full">
            Convert
          </Button>
        </div>

        {/* Number pad for input */}
        <div className="grid grid-cols-3 gap-2">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(num => (
            <Button key={num} variant="outline" onClick={() => handleInput(num.toString())}>
              {num}
            </Button>
          ))}
          <Button variant="outline" onClick={() => handleInput('0')} className="col-span-2">0</Button>
          <Button variant="outline" onClick={() => handleInput('.')}>.</Button>
        </div>
      </div>
    );
  };

  const ScientificCalculator = () => (
    <div className="grid grid-cols-6 gap-2 p-6">
      {/* Display */}
      <div className="col-span-6 mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-right">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              {state.angleMode} | M: {state.memory[0] !== 0 ? state.memory[0].toFixed(2) : '0'}
            </div>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Operation Preview */}
          {state.expression && (
            <div className="text-lg font-mono text-gray-600 dark:text-gray-400 mb-2 min-h-[1.5rem] border-b border-gray-200 dark:border-gray-700 pb-2">
              {state.expression}
            </div>
          )}

          {/* Main Display */}
          <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white overflow-hidden">
            {state.display}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex gap-2">
              {state.previousValue !== null && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {state.previousValue}
                </span>
              )}
              {state.operator && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                  {state.operator}
                </span>
              )}
            </div>
            <div className="text-gray-400">
              {state.waitingForOperand ? 'Enter number' : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Expression Input */}
      <div className="col-span-6 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Expression Input:</div>
          <div className="flex gap-2">
            <Input
              value={state.expression}
              onChange={(e) => setState(prev => ({ ...prev, expression: e.target.value }))}
              placeholder="Enter expression (e.g., sin(30), e^2, log(100))"
              className="flex-1 font-mono text-sm"
            />
            <Button
              onClick={evaluateExpression}
              className="bg-blue-500 text-white hover:bg-blue-600"
              size="sm"
            >
              =
            </Button>
            <Button
              onClick={() => setState(prev => ({ ...prev, expression: '' }))}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Function Buttons */}
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'sin(' }))} className="h-12 text-sm bg-blue-50 hover:bg-blue-100">
        sin(
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'cos(' }))} className="h-12 text-sm bg-blue-50 hover:bg-blue-100">
        cos(
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'tan(' }))} className="h-12 text-sm bg-blue-50 hover:bg-blue-100">
        tan(
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'log(' }))} className="h-12 text-sm bg-blue-50 hover:bg-blue-100">
        log(
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'ln(' }))} className="h-12 text-sm bg-blue-50 hover:bg-blue-100">
        ln(
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'sqrt(' }))} className="h-12 text-sm bg-blue-50 hover:bg-blue-100">
        sqrt(
      </Button>

      {/* Memory Functions */}
      <Button variant="outline" onClick={() => handleMemory('MC')} className="h-12 text-sm">
        MC
      </Button>
      <Button variant="outline" onClick={() => handleMemory('MR')} className="h-12 text-sm">
        MR
      </Button>
      <Button variant="outline" onClick={() => handleMemory('MS')} className="h-12 text-sm">
        MS
      </Button>
      <Button variant="outline" onClick={() => handleMemory('M+')} className="h-12 text-sm">
        M+
      </Button>
      <Button variant="outline" onClick={() => handleMemory('M-')} className="h-12 text-sm">
        M-
      </Button>
      <Button variant="outline" onClick={() => handleInput('C')} className="h-12 text-sm bg-red-500 text-white hover:bg-red-600">
        C
      </Button>

      {/* Trigonometric Functions */}
      <Button variant="outline" onClick={() => handleScientificFunction('sin')} className="h-12 text-sm">
        sin
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('cos')} className="h-12 text-sm">
        cos
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('tan')} className="h-12 text-sm">
        tan
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('asin')} className="h-12 text-sm">
        asin
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('acos')} className="h-12 text-sm">
        acos
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('atan')} className="h-12 text-sm">
        atan
      </Button>

      {/* Hyperbolic Functions */}
      <Button variant="outline" onClick={() => handleScientificFunction('sinh')} className="h-12 text-sm">
        sinh
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('cosh')} className="h-12 text-sm">
        cosh
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('tanh')} className="h-12 text-sm">
        tanh
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('asinh')} className="h-12 text-sm">
        asinh
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('acosh')} className="h-12 text-sm">
        acosh
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('atanh')} className="h-12 text-sm">
        atanh
      </Button>

      {/* Logarithmic Functions */}
      <Button variant="outline" onClick={() => handleScientificFunction('log')} className="h-12 text-sm">
        log
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('ln')} className="h-12 text-sm">
        ln
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('log2')} className="h-12 text-sm">
        log₂
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('exp')} className="h-12 text-sm">
        eˣ
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('pi')} className="h-12 text-sm">
        π
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('e')} className="h-12 text-sm">
        e
      </Button>

      {/* Power and Root Functions */}
      <Button variant="outline" onClick={() => handleInput('^')} className="h-12 text-sm bg-orange-500 text-white hover:bg-orange-600">
        xʸ
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('sqrt')} className="h-12 text-sm">
        √x
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('cbrt')} className="h-12 text-sm">
        ∛x
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('abs')} className="h-12 text-sm">
        |x|
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('factorial')} className="h-12 text-sm">
        x!
      </Button>
      <Button variant="outline" onClick={() => handleInput('±')} className="h-12 text-sm">
        ±
      </Button>

      {/* Number Pad */}
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'e^(' }))} className="h-12 text-sm bg-green-50 hover:bg-green-100">
        e^(
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'π' }))} className="h-12 text-sm bg-green-50 hover:bg-green-100">
        π
      </Button>
      <Button variant="outline" onClick={() => setState(prev => ({ ...prev, expression: prev.expression + 'e' }))} className="h-12 text-sm bg-green-50 hover:bg-green-100">
        e
      </Button>
      <Button variant="outline" onClick={() => handleInput('(')} className="h-12 text-sm">
        (
      </Button>
      <Button variant="outline" onClick={() => handleInput(')')} className="h-12 text-sm">
        )
      </Button>
      <Button variant="outline" onClick={() => handleInput('⌫')} className="h-12 text-sm">
        ⌫
      </Button>
      <Button variant="outline" onClick={() => handleInput('÷')} className="h-12 text-sm bg-orange-500 text-white hover:bg-orange-600">
        ÷
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('rand')} className="h-12 text-sm">
        rand
      </Button>
      <Button variant="outline" onClick={() => handleInput('7')} className="h-12 text-sm">
        7
      </Button>

      <Button variant="outline" onClick={() => handleInput('8')} className="h-12 text-sm">
        8
      </Button>
      <Button variant="outline" onClick={() => handleInput('9')} className="h-12 text-sm">
        9
      </Button>
      <Button variant="outline" onClick={() => handleInput('×')} className="h-12 text-sm bg-orange-500 text-white hover:bg-orange-600">
        ×
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('floor')} className="h-12 text-sm">
        ⌊x⌋
      </Button>
      <Button variant="outline" onClick={() => handleInput('4')} className="h-12 text-sm">
        4
      </Button>

      <Button variant="outline" onClick={() => handleInput('5')} className="h-12 text-sm">
        5
      </Button>
      <Button variant="outline" onClick={() => handleInput('6')} className="h-12 text-sm">
        6
      </Button>
      <Button variant="outline" onClick={() => handleInput('-')} className="h-12 text-sm bg-orange-500 text-white hover:bg-orange-600">
        −
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('ceil')} className="h-12 text-sm">
        ⌈x⌉
      </Button>
      <Button variant="outline" onClick={() => handleInput('1')} className="h-12 text-sm">
        1
      </Button>

      <Button variant="outline" onClick={() => handleInput('2')} className="h-12 text-sm">
        2
      </Button>
      <Button variant="outline" onClick={() => handleInput('3')} className="h-12 text-sm">
        3
      </Button>
      <Button variant="outline" onClick={() => handleInput('+')} className="h-12 text-sm bg-orange-500 text-white hover:bg-orange-600">
        +
      </Button>
      <Button variant="outline" onClick={() => handleScientificFunction('round')} className="h-12 text-sm">
        round
      </Button>
      <Button variant="outline" onClick={() => handleInput('0')} className="h-12 text-sm col-span-2">
        0
      </Button>

      <Button variant="outline" onClick={() => handleInput('.')} className="h-12 text-sm">
        .
      </Button>
      <Button variant="outline" onClick={() => handleInput('=')} className="h-12 text-sm bg-orange-500 text-white hover:bg-orange-600">
        =
      </Button>
      <Button variant="outline" onClick={toggleAngleMode} className="h-12 text-sm">
        {state.angleMode}
      </Button>

      {/* Variable Storage */}
      <div className="col-span-6 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <X className="w-4 h-4" />
          <span className="text-sm font-medium">Variables & Expression Evaluator</span>
        </div>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Enter expression (e.g., 2*x + sin(30))"
            value={state.expression}
            onChange={(e) => setState(prev => ({ ...prev, expression: e.target.value }))}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={() => {
              try {
                if (!state.expression || state.expression.trim() === '') {
                  setState(prev => ({ ...prev, display: 'Error' }));
                  return;
                }
                // Use the same expression evaluation logic
                let expression = state.expression.trim();

                // Replace common mathematical symbols and functions
                expression = expression
                  .replace(/\^/g, '**') // Replace ^ with ** for JavaScript
                  .replace(/π/g, 'Math.PI') // Replace π with Math.PI
                  .replace(/\be\b/g, 'Math.E') // Replace e with Math.E
                  .replace(/sin\(/g, 'Math.sin(')
                  .replace(/cos\(/g, 'Math.cos(')
                  .replace(/tan\(/g, 'Math.tan(')
                  .replace(/asin\(/g, 'Math.asin(')
                  .replace(/acos\(/g, 'Math.acos(')
                  .replace(/atan\(/g, 'Math.atan(')
                  .replace(/sinh\(/g, 'Math.sinh(')
                  .replace(/cosh\(/g, 'Math.cosh(')
                  .replace(/tanh\(/g, 'Math.tanh(')
                  .replace(/asinh\(/g, 'Math.asinh(')
                  .replace(/acosh\(/g, 'Math.acosh(')
                  .replace(/atanh\(/g, 'Math.atanh(')
                  .replace(/log\(/g, 'Math.log10(')
                  .replace(/ln\(/g, 'Math.log(')
                  .replace(/log2\(/g, '(Math.log(')
                  .replace(/sqrt\(/g, 'Math.sqrt(')
                  .replace(/cbrt\(/g, 'Math.cbrt(')
                  .replace(/abs\(/g, 'Math.abs(')
                  .replace(/floor\(/g, 'Math.floor(')
                  .replace(/ceil\(/g, 'Math.ceil(')
                  .replace(/round\(/g, 'Math.round(')
                  .replace(/exp\(/g, 'Math.exp(')
                  .replace(/factorial\(/g, 'factorial(');

                // Handle angle mode conversion for trigonometric functions
                if (state.angleMode === 'DEG') {
                  expression = expression.replace(/(Math\.(sin|cos|tan|asin|acos|atan)\()([^)]+)\)/g, (match, func, trigFunc, angle) => {
                    return `${func}(${angle} * Math.PI / 180)`;
                  });
                } else if (state.angleMode === 'GRAD') {
                  expression = expression.replace(/(Math\.(sin|cos|tan|asin|acos|atan)\()([^)]+)\)/g, (match, func, trigFunc, angle) => {
                    return `${func}(${angle} * Math.PI / 200)`;
                  });
                }

                // Add factorial function
                const factorial = (n: number) => {
                  if (n < 0) throw new Error('Factorial of negative number');
                  if (n === 0 || n === 1) return 1;
                  let result = 1;
                  for (let i = 2; i <= n; i++) {
                    result *= i;
                  }
                  return result;
                };

                const result = eval(expression);

                if (isNaN(result) || !isFinite(result)) {
                  throw new Error('Invalid calculation');
                }

                const formattedResult = formatResult(result, state.precision);
                setState(prev => ({ ...prev, display: formattedResult }));
                addToHistory(state.expression, formattedResult);
              } catch (error) {
                setState(prev => ({ ...prev, display: 'Error' }));
              }
            }}
          >
            Eval
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Variable name"
            className="text-sm flex-1"
            id="var-name"
          />
          <Button
            size="sm"
            onClick={() => {
              try {
                const nameInput = document.getElementById('var-name') as HTMLInputElement;
                const name = nameInput?.value?.trim();
                const value = parseFloat(state.display);

                if (!name) {
                  setState(prev => ({ ...prev, display: 'Error' }));
                  return;
                }

                if (isNaN(value) || !isFinite(value)) {
                  setState(prev => ({ ...prev, display: 'Error' }));
                  return;
                }

                handleVariable('store', name, value);
                nameInput.value = '';
              } catch (error) {
                setState(prev => ({ ...prev, display: 'Error' }));
              }
            }}
          >
            Store
          </Button>
        </div>
        {state.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {state.variables.map((variable, index) => (
              <Button
                key={`variable-${variable.name}-${index}`}
                variant="outline"
                size="sm"
                onClick={() => handleVariable('recall', variable.name)}
                className="text-xs"
              >
                {variable.name}={variable.value.toFixed(2)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calculator className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Calculator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate multi-mode calculator suite. From basic arithmetic to advanced scientific functions,
              programmer tools, statistical analysis, function graphing, and unit conversions.
              Everything you need for mathematics, engineering, programming, and research.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium">Scientific</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Code className="w-5 h-5 text-green-600" />
                <span className="text-xs font-medium">Programmer</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-medium">Graphing</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Grid3X3 className="w-5 h-5 text-red-600" />
                <span className="text-xs font-medium">Unit Convert</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <X className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-medium">Variables</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <History className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-medium">History</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
                <span className="text-xs font-medium">Multi-Memory</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Volume2 className="w-5 h-5 text-pink-600" />
                <span className="text-xs font-medium">Sound Effects</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-medium">Keyboard</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Download className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-medium">Export/Import</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Infinity className="w-5 h-5 text-violet-600" />
                <span className="text-xs font-medium">High Precision</span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Calculator
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2"
                      >
                        <History className="w-4 h-4" />
                        History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="calculator" className="flex items-center gap-1 text-xs">
                        <Calculator className="w-3 h-3" />
                        Calc
                      </TabsTrigger>
                      <TabsTrigger value="programmer" className="flex items-center gap-1 text-xs">
                        <Code className="w-3 h-3" />
                        Prog
                      </TabsTrigger>
                      <TabsTrigger value="graphing" className="flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        Graph
                      </TabsTrigger>
                      <TabsTrigger value="converter" className="flex items-center gap-1 text-xs">
                        <Grid3X3 className="w-3 h-3" />
                        Convert
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {activeTab === 'calculator' && (
                    <Tabs value={mode} onValueChange={(value) => setMode(value as 'simple' | 'scientific')}>
                      <TabsList className="grid w-full grid-cols-2 mt-2">
                        <TabsTrigger value="simple" className="flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Simple
                        </TabsTrigger>
                        <TabsTrigger value="scientific" className="flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Scientific
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                </CardHeader>

                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                    <TabsContent value="calculator" className="m-0">
                      <Tabs value={mode} onValueChange={(value) => setMode(value as 'simple' | 'scientific')}>
                        <TabsContent value="simple" className="m-0">
                          <SimpleCalculator />
                        </TabsContent>
                        <TabsContent value="scientific" className="m-0">
                          <ScientificCalculator />
                        </TabsContent>
                      </Tabs>
                    </TabsContent>
                    <TabsContent value="programmer" className="m-0">
                      <ProgrammerCalculator />
                    </TabsContent>
                    <TabsContent value="graphing" className="m-0">
                      <GraphingCalculator />
                    </TabsContent>
                    <TabsContent value="converter" className="m-0">
                      <UnitConverter />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* History Panel */}
              {showHistory && (
                <Card className="mt-6 shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Calculation History
                      </CardTitle>
                      <Button variant="outline" size="sm" onClick={clearHistory}>
                        <Delete className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {state.history.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No calculations yet</p>
                        <p className="text-sm">Start calculating to see your history here</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {state.history.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div>
                              <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                {item.expression}
                              </div>
                              <div className="font-bold text-lg text-gray-900 dark:text-white">
                                = {item.result}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Settings Panel */}
              {showSettings && (
                <Card className="mt-6 shadow-xl border-0">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Advanced Settings
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportData}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <label htmlFor="import-file" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                          </label>
                        </Button>
                        <input
                          id="import-file"
                          type="file"
                          accept=".json"
                          onChange={importData}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Angle Mode</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant={state.angleMode === 'DEG' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setState(prev => ({ ...prev, angleMode: 'DEG' }))}
                            >
                              Degrees
                            </Button>
                            <Button
                              variant={state.angleMode === 'RAD' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setState(prev => ({ ...prev, angleMode: 'RAD' }))}
                            >
                              Radians
                            </Button>
                            <Button
                              variant={state.angleMode === 'GRAD' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setState(prev => ({ ...prev, angleMode: 'GRAD' }))}
                            >
                              Gradians
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Precision (Decimal Places)</Label>
                          <div className="mt-2">
                            <Slider
                              value={[state.precision]}
                              onValueChange={([value]) => setState(prev => ({ ...prev, precision: value }))}
                              max={15}
                              min={2}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-sm text-gray-500 mt-1">
                              Current: {state.precision} decimal places
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Sound Effects</Label>
                          <Switch
                            checked={state.soundEnabled}
                            onCheckedChange={(checked) => setState(prev => ({ ...prev, soundEnabled: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Complex Numbers</Label>
                          <Switch
                            checked={state.complexMode}
                            onCheckedChange={(checked) => setState(prev => ({ ...prev, complexMode: checked }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Theme</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant={state.theme === 'light' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setState(prev => ({ ...prev, theme: 'light' }))}
                              className="flex items-center gap-2"
                            >
                              <Sun className="w-4 h-4" />
                              Light
                            </Button>
                            <Button
                              variant={state.theme === 'dark' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setState(prev => ({ ...prev, theme: 'dark' }))}
                              className="flex items-center gap-2"
                            >
                              <Moon className="w-4 h-4" />
                              Dark
                            </Button>
                            <Button
                              variant={state.theme === 'auto' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setState(prev => ({ ...prev, theme: 'auto' }))}
                              className="flex items-center gap-2"
                            >
                              <Monitor className="w-4 h-4" />
                              Auto
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Memory Slots</Label>
                          <div className="grid grid-cols-5 gap-1 mt-2">
                            {state.memory.map((value, index) => (
                              <div key={`memory-${index}-${value}`} className="text-center">
                                <div className="text-xs text-gray-500">M{index + 1}</div>
                                <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 rounded px-1">
                                  {value.toFixed(2)}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMemory('MC', index)}
                                  className="text-xs mt-1 h-6"
                                >
                                  Clear
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Variables</Label>
                          <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                            {state.variables.map((variable, index) => (
                              <div key={`variable-display-${variable.name}-${index}`} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                                <span className="text-sm font-mono">{variable.name} = {variable.value}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setState(prev => ({
                                      ...prev,
                                      variables: prev.variables.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <Delete className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            {state.variables.length === 0 && (
                              <div className="text-sm text-gray-500 text-center py-2">
                                No variables stored
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Keyboard Shortcuts Info */}
              <Card className="mt-6 shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Keyboard Shortcuts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Numbers:</strong> 0-9
                    </div>
                    <div>
                      <strong>Operators:</strong> +, -, *, /
                    </div>
                    <div>
                      <strong>Clear:</strong> C, Escape
                    </div>
                    <div>
                      <strong>Backspace:</strong> Backspace, ⌫
                    </div>
                    <div>
                      <strong>Equals:</strong> Enter, =
                    </div>
                    <div>
                      <strong>Decimal:</strong> ., ,
                    </div>
                    <div>
                      <strong>Power:</strong> ^, **
                    </div>
                    <div>
                      <strong>Constants:</strong> p (π), e
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

