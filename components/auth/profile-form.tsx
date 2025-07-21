"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/user-context";
import type { User } from "@/lib/auth";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProfileFormProps {
  user: User;
  onSuccess: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { updateAvatar, refreshUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "错误",
        description: "请选择图片文件。",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await updateAvatar(file);
      await refreshUser();
      toast({
        title: "成功",
        description: "头像更新成功。",
      });
    } catch (error: any) {
      toast({
        title: "错误",
        description: error.message || "Failed to update avatar",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={user.avatar_url || "/placeholder.svg?height=80&width=80"}
            alt={user.username}
          />
          <AvatarFallback className="text-lg">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {loading ? "Uploading..." : "Change Avatar"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={user.username} disabled />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user.email} disabled />
        </div>

        <div className="space-y-2">
          <Label>Account Type</Label>
          <Input value={user.is_admin ? "Administrator" : "User"} disabled />
        </div>

        <div className="space-y-2">
          <Label>Member Since</Label>
          <Input
            value={new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            disabled
          />
        </div>
      </div>

      <Button onClick={onSuccess} className="w-full">
        Close
      </Button>
    </div>
  );
}
