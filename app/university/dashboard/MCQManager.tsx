import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye } from "lucide-react";

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

export default function MCQManager({
  mcqs,
  setMcqs,
}: {
  mcqs: MCQ[];
  setMcqs: (mcqs: MCQ[]) => void;
}) {
  const [currentMCQ, setCurrentMCQ] = useState<MCQ>({
    id: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
    explanation: "",
  });
  const [editingMCQId, setEditingMCQId] = useState<string | null>(null);

  const saveMCQ = () => {
    if (
      currentMCQ.question.trim() &&
      currentMCQ.options.every((opt) => opt.trim())
    ) {
      if (editingMCQId) {
        setMcqs(
          mcqs.map((mcq) =>
            mcq.id === editingMCQId ? { ...currentMCQ, id: editingMCQId } : mcq
          )
        );
        setEditingMCQId(null);
      } else {
        const newMCQ = {
          ...currentMCQ,
          id: Date.now().toString() + Math.random().toString(36).slice(2),
        };
        setMcqs([...mcqs, newMCQ]);
      }
      setCurrentMCQ({
        id: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
        explanation: "",
      });
    }
  };

  const editMCQ = (id: string) => {
    const mcq = mcqs.find((m) => m.id === id);
    if (mcq) {
      setCurrentMCQ({ ...mcq });
      setEditingMCQId(id);
    }
  };

  const removeMCQ = (id: string) => {
    setMcqs(mcqs.filter((mcq) => mcq.id !== id));
    if (editingMCQId === id) {
      setCurrentMCQ({
        id: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
        explanation: "",
      });
      setEditingMCQId(null);
    }
  };

  return (
    <div>
      <div className="space-y-4 mb-6">
        <Label>Question</Label>
        <Textarea
          value={currentMCQ.question}
          onChange={(e) =>
            setCurrentMCQ({ ...currentMCQ, question: e.target.value })
          }
          placeholder="Enter the question"
        />
        <Label>Options</Label>
        {currentMCQ.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <Input
              value={opt}
              onChange={(e) => {
                const newOptions = [...currentMCQ.options];
                newOptions[idx] = e.target.value;
                setCurrentMCQ({ ...currentMCQ, options: newOptions });
              }}
              placeholder={`Option ${idx + 1}`}
            />
            <input
              type="radio"
              checked={currentMCQ.correctAnswer === idx}
              onChange={() =>
                setCurrentMCQ({ ...currentMCQ, correctAnswer: idx })
              }
            />
            <span className="text-xs">Correct</span>
          </div>
        ))}
        <Label>Points</Label>
        <Input
          type="number"
          value={currentMCQ.points}
          onChange={(e) =>
            setCurrentMCQ({ ...currentMCQ, points: Number(e.target.value) })
          }
          min={1}
        />
        <Label>Explanation (optional)</Label>
        <Textarea
          value={currentMCQ.explanation}
          onChange={(e) =>
            setCurrentMCQ({ ...currentMCQ, explanation: e.target.value })
          }
          placeholder="Explanation for the answer (optional)"
        />
        <Button
          onClick={saveMCQ}
          disabled={
            !currentMCQ.question.trim() ||
            currentMCQ.options.some((opt) => !opt.trim())
          }
        >
          {editingMCQId ? "Update MCQ" : "Add MCQ"}
        </Button>
      </div>
      <div className="space-y-4">
        {mcqs.map((mcq, idx) => (
          <div key={mcq.id} className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-bold">Q{idx + 1}</span>
              <span className="text-xs text-gray-500">{mcq.points} pts</span>
              <Button variant="ghost" size="sm" onClick={() => editMCQ(mcq.id)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMCQ(mcq.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-2 font-medium">{mcq.question}</div>
            <ul className="list-disc ml-6">
              {mcq.options.map((opt, oidx) => (
                <li
                  key={oidx}
                  className={
                    oidx === mcq.correctAnswer
                      ? "text-green-700 font-semibold"
                      : ""
                  }
                >
                  {String.fromCharCode(65 + oidx)}. {opt}
                  {oidx === mcq.correctAnswer && (
                    <span className="ml-2 text-xs">(Correct)</span>
                  )}
                </li>
              ))}
            </ul>
            {mcq.explanation && (
              <div className="mt-2 text-xs text-blue-700">
                Explanation: {mcq.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
