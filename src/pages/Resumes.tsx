/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import FileUploadForm from "../components/FileUploadForm";
import { useAuthStore } from "../utils/authStore";
import uploadFiles from "../utils/uploads";
import { toast } from "sonner";
import api from "../axios";
import type { Resume, User } from "../types/types";

const Resumes = () => {
  const user = useAuthStore((state) => state.user);
  const [resumes, setResumes] = useState<Resume[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = user?.id;

  const getUserData = useCallback(async () => {
    setIsLoading(true);
    if (userId) {
      try {
        const response = await api.get<User>(`/users/${userId}`);
        setResumes(response.data.resumes || []);
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    getUserData();
  }, [getUserData, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Management
        </h1>
        <p className="text-gray-600">Upload and manage your resume files</p>
      </div>

      <FileUploadForm
        uploadFunction={uploadFiles}
        acceptedTypes=".pdf,.doc,.docx"
        maxFileSize={10}
        multiple={true}
      />

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Your Resumes
        </h2>
        <p className="text-gray-500">
          Your uploaded resumes will be displayed here.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes?.length === 0 ? (
            <p className="text-gray-500 col-span-full">
              No resumes uploaded yet.
            </p>
          ) : (
            resumes?.map((resume) => (
              <div
                key={resume.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">
                  {resume.filepath}
                </h3>
                <button
                  onClick={() => window.open(resume.fileurl, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View Resume
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Resumes;
