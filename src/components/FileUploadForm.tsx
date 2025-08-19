/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../utils/authStore";
import api from "../axios";

interface FileUploadFormProps {
  uploadFunction?: (file: File) => Promise<any>;
  acceptedTypes?: string;
  maxFileSize?: number;
  multiple?: boolean;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  uploadFunction,
  acceptedTypes = "*",
  maxFileSize = 10,
  multiple = true,
}) => {
  const user = useAuthStore((state) => state.user);
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = user?.id;
  console.log("userId:", userId);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(
          `File "${file.name}" is too large. Maximum size is ${maxFileSize}MB.`,
          {
            position: "top-right",
          }
        );
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles.slice(0, 1));
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setUploadedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileToRemove.name);
      return newSet;
    });
  };

  const uploadFile = async (file: File) => {
    if (!uploadFunction) {
      toast.error("Upload function not provided", {
        position: "top-right",
      });
      return;
    }

    setUploadingFiles((prev) => new Set(prev).add(file.name));

    try {
      const result = await uploadFunction(file);

      console.log("Upload result:", result);

      if (result) {
        toast.success(
          `File "${file.name}" uploaded successfully to supabase!`,
          {
            position: "top-right",
          }
        );
        setUploadedFiles((prev) => new Set(prev).add(file.name));
        const data = {
          filepath: result.path!,
          userId: userId,
          fileurl: result.signedUrl!,
        };
        try {
          const response = await api.post("/resumes", data);

          toast.success(`Resume uploaded successfully to backend!`, {
            position: "top-right",
          });
          console.log("Resume uploaded:", response.data);
        } catch (error: any) {
          toast.error(`Error uploading resume: ${error.message}`);
          console.error("Error uploading resume:", error);
        }
        toast.success(`File "${file.name}" uploaded successfully!`, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload "${file.name}"`, {
        position: "top-right",
      });
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(file.name);
        return newSet;
      });
    }
  };

  const uploadAllFiles = async () => {
    const filesToUpload = files.filter((file) => !uploadedFiles.has(file.name));

    for (const file of filesToUpload) {
      await uploadFile(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileStatus = (file: File) => {
    if (uploadingFiles.has(file.name)) return "uploading";
    if (uploadedFiles.has(file.name)) return "uploaded";
    return "pending";
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your files here, or click to browse
        </p>
        <p className="text-sm text-gray-500">
          {multiple ? "Multiple files allowed" : "Single file only"} • Max size:{" "}
          {maxFileSize}MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileSelect}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Selected Files</h3>

          <div className="space-y-2">
            {files.map((file, index) => {
              const status = getFileStatus(file);

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {status === "uploading" && (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      {status === "uploaded" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {status === "pending" && (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {status === "pending" && (
                      <button
                        onClick={() => uploadFile(file)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                        disabled={!uploadFunction}
                      >
                        Upload
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(file)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={uploadingFiles.has(file.name)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {files.some((file) => !uploadedFiles.has(file.name)) && (
            <button
              onClick={uploadAllFiles}
              disabled={
                !uploadFunction || Array.from(uploadingFiles).length > 0
              }
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {Array.from(uploadingFiles).length > 0 ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </span>
              ) : (
                "Upload All Files"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;
