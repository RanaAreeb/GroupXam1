import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  UserPlus,
  UserMinus,
  Share2,
  Copy,
  Link,
  MessageSquare,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Crown,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
  isOnline: boolean;
  lastSeen: Date;
  cursor?: { x: number; y: number };
  color: string;
}

interface WhiteboardCollaborationProps {
  whiteboardId: string;
  currentUser: Collaborator;
  collaborators: Collaborator[];
  onAddCollaborator: (email: string, role: "editor" | "viewer") => void;
  onRemoveCollaborator: (id: string) => void;
  onUpdateRole: (id: string, role: "owner" | "editor" | "viewer") => void;
  onTogglePermission: (permission: string) => void;
  isSharing: boolean;
  onToggleSharing: () => void;
  shareUrl: string;
}

export default function WhiteboardCollaboration({
  whiteboardId,
  currentUser,
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateRole,
  onTogglePermission,
  isSharing,
  onToggleSharing,
  shareUrl,
}: WhiteboardCollaborationProps) {
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"editor" | "viewer">(
    "editor"
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "editor":
        return <Shield className="w-4 h-4 text-blue-500" />;
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800";
      case "editor":
        return "bg-blue-100 text-blue-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Collaboration</h3>
          <Button
            size="sm"
            variant={isSharing ? "default" : "outline"}
            onClick={onToggleSharing}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isSharing ? "Stop Sharing" : "Share"}
          </Button>
        </div>

        {/* Share URL */}
        {isSharing && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Share Link
            </Label>
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly className="text-sm" />
              <Button size="sm" variant="outline" onClick={copyShareUrl}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {isCopied && (
              <p className="text-xs text-green-600 mt-1">
                Copied to clipboard!
              </p>
            )}
          </div>
        )}

        {/* Add Collaborator */}
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Collaborator
          </Button>

          {showAddForm && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newCollaboratorEmail}
                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                className="mb-2"
              />
              <div className="flex space-x-2 mb-2">
                <Button
                  size="sm"
                  variant={selectedRole === "editor" ? "default" : "outline"}
                  onClick={() => setSelectedRole("editor")}
                >
                  Editor
                </Button>
                <Button
                  size="sm"
                  variant={selectedRole === "viewer" ? "default" : "outline"}
                  onClick={() => setSelectedRole("viewer")}
                >
                  Viewer
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => {
                    if (newCollaboratorEmail) {
                      onAddCollaborator(newCollaboratorEmail, selectedRole);
                      setNewCollaboratorEmail("");
                      setShowAddForm(false);
                    }
                  }}
                >
                  Invite
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Collaborators List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Collaborators ({collaborators.length})
          </h4>

          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={collaborator.avatar} />
                  <AvatarFallback className="text-xs">
                    {collaborator.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-800">
                      {collaborator.name}
                    </span>
                    {getRoleIcon(collaborator.role)}
                    {collaborator.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getRoleColor(collaborator.role)}`}
                    >
                      {collaborator.role}
                    </Badge>
                    {!collaborator.isOnline && (
                      <span className="text-xs text-gray-500">
                        Last seen {collaborator.lastSeen.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {currentUser.role === "owner" &&
                collaborator.id !== currentUser.id && (
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newRole =
                          collaborator.role === "editor" ? "viewer" : "editor";
                        onUpdateRole(collaborator.id, newRole);
                      }}
                    >
                      {collaborator.role === "editor" ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <Shield className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveCollaborator(collaborator.id)}
                    >
                      <UserMinus className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Permissions */}
        {currentUser.role === "owner" && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Permissions
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Allow editing</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTogglePermission("editing")}
                >
                  <Lock className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Allow comments</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTogglePermission("comments")}
                >
                  <MessageSquare className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Recent Activity
          </h4>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">
              {collaborators.filter((c) => c.isOnline).length} people online
            </div>
            <div className="text-xs text-gray-500">
              Last saved 2 minutes ago
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
