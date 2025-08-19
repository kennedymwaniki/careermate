/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../utils/authStore";
import api from "../axios";
import Modal from "../components/Modal";
import ProfileEditForm from "../components/ProfileEditForm";

// TypeScript interfaces
interface Education {
  id?: number;
  degree: string;
  coursename: string;
  institution: string;
  startYear: number;
  endYear: number;
}

interface Experience {
  id?: number;
  title: string;
  companyName: string;
  startYear: number;
  endYear: number;
  duration: string;
}

interface UserProfile {
  id: number;
  fullname: string;
  image: string;
  bio: string;
  skills: string[];
  phone: string;
  availability: string;
  experience: Experience[];
  education: Education[];
}

interface User {
  id: number;
  email: string;
  profile: UserProfile;
}

type TabType = "experience" | "education";

const ProfileHeaderSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse">
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-5 sm:h-6 bg-gray-200 rounded w-36 sm:w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-48 sm:w-64 mb-4"></div>
      <div className="h-16 sm:h-20 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-8 sm:h-10 bg-gray-200 rounded w-20 sm:w-24"></div>
    </div>
  </div>
);

const SkillsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse">
    <div className="h-5 sm:h-6 bg-gray-200 rounded w-14 sm:w-16 mb-4"></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-6 sm:h-8 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

const BasicInfoSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-pulse">
    <div className="h-5 sm:h-6 bg-gray-200 rounded w-28 sm:w-32 mb-4"></div>
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0"
        >
          <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-28 sm:w-32"></div>
        </div>
      ))}
    </div>
  </div>
);

const TabContentSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={index}
        className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg animate-pulse"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-36 sm:w-48"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-28 sm:w-32"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("experience");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userId = user?.id ? Number(user.id) : null;

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/users/${userId}`);
      setUserProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      setError(error.response?.data?.message || "Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchUserProfile();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId, fetchUserProfile]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Please log in to view your profile
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const profile = userProfile?.profile;

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-2 sm:py-4 sm:px-4 lg:ml-0">
      <div className="max-w-7xl mx-auto">
        <div className="h-12 lg:hidden"></div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {isLoading ? (
              <ProfileHeaderSkeleton />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-500">
                    {profile?.image ? (
                      <img
                        src={profile.image}
                        alt={profile.fullname || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg sm:text-xl">
                          {profile?.fullname?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center px-2">
                    {profile?.fullname || "Unknown User"}
                  </h1>

                  <p className="text-sm sm:text-base text-gray-600 text-center mb-4 px-2 leading-relaxed">
                    {profile?.bio || "No bio available"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <SkillsSkeleton />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Skills
                </h2>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm break-words max-w-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm sm:text-base">
                    No skills listed
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {isLoading ? (
              <BasicInfoSkeleton />
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Full Name
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base break-words">
                        {profile?.fullname || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Email
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base break-all">
                        {userProfile?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Phone
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base break-words">
                        {profile?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Years of Experience
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base break-words">
                        {profile?.experience && profile.experience.length > 0
                          ? `${profile.experience.length} positions`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Employment Level
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base break-words">
                        {profile?.availability === "full_time"
                          ? "Full-Time"
                          : profile?.availability === "part_time"
                          ? "Part-Time"
                          : profile?.availability === "freelance"
                          ? "Freelance"
                          : profile?.availability || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-sm sm:text-base font-medium">
                        Notice Period
                      </span>
                      <span className="text-gray-900 text-sm sm:text-base">
                        N/A
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("experience")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "experience"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Experience
                  </button>
                  <button
                    onClick={() => setActiveTab("education")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "education"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Education
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isLoading ? (
                  <TabContentSkeleton />
                ) : (
                  <>
                    {activeTab === "experience" && (
                      <div className="space-y-4">
                        {profile?.experience &&
                        profile.experience.length > 0 ? (
                          profile.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                            >
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-semibold text-sm sm:text-base">
                                  {exp.companyName?.charAt(0) || "C"}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                                  {exp.title}
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base break-words">
                                  {exp.companyName}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 break-words">
                                  {exp.startYear} - {exp.endYear} •{" "}
                                  {exp.duration}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm sm:text-base">
                              No experience information available
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "education" && (
                      <div className="space-y-4">
                        {profile?.education && profile.education.length > 0 ? (
                          profile.education.map((edu, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                            >
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-green-600 font-semibold text-sm sm:text-base">
                                  {edu.institution?.charAt(0) || "S"}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                                  {edu.degree} in {edu.coursename}
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base break-words">
                                  {edu.institution}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {edu.startYear} - {edu.endYear}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm sm:text-base">
                              No education information available
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {userProfile && (
          <Modal
            isOpen={isEditModalOpen}
            onClose={handleEditCancel}
            title="Edit Profile"
            size="2xl"
          >
            <ProfileEditForm
              user={userProfile}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Profile;
