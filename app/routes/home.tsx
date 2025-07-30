import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Best AI Resume Analyzer" },
  ];
}

export default function Home() {
  const { auth, isLoading, kv} = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false)
  const navigate = useNavigate();

  // Calculate analytics from resumes
  const analytics = {
    totalResumes: resumes.length,
    averageScore: resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + (r.feedback?.overallScore || 0), 0) / resumes.length)
      : 0,
    highestScore: resumes.length > 0
      ? Math.max(...resumes.map(r => r.feedback?.overallScore || 0))
      : 0,
    improvementAreas: resumes.length > 0
      ? resumes.reduce((sum, r) => sum + (r.feedback?.ATS?.tips?.length || 0), 0)
      : 0
  };

  useEffect(() => {
    // Only check auth after loading is complete
    if (isLoading) return;

    // If user is NOT authenticated, redirect to auth with return URL
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/', { replace: true });
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];
        const parsedResumes = resumes
          ?.filter((resume) => resume.value && resume.value !== 'undefined')
          ?.map((resume) => {
            try {
              const resumeData = JSON.parse(resume.value) as Resume;

              // Transform feedback if it's in the AI format
              if (resumeData.feedback && !resumeData.feedback.overallScore) {
                const aiFeedback = resumeData.feedback as any;
                resumeData.feedback = {
                  overallScore: aiFeedback.overallRating === "Low" ? 30 :
                               aiFeedback.overallRating === "Medium" ? 60 :
                               aiFeedback.overallRating === "High" ? 85 : 50,
                  ATS: {
                    score: 45,
                    tips: aiFeedback.areasForImprovement?.slice(0, 3).map((item: any) => ({
                      type: "improve" as const,
                      tip: typeof item === 'string' ? item : (item.Category || item.category || 'Improvement needed')
                    })) || []
                  },
                  toneAndStyle: {
                    score: 50,
                    tips: aiFeedback.strengths?.slice(0, 2).map((strength: string) => ({
                      type: "good" as const,
                      tip: "Positive aspect",
                      explanation: strength
                    })) || []
                  },
                  content: {
                    score: 45,
                    tips: []
                  },
                  structure: {
                    score: 40,
                    tips: []
                  },
                  skills: {
                    score: 55,
                    tips: []
                  }
                };
              }

              return resumeData;
            } catch (parseError) {
              console.error('Failed to parse resume:', resume.key, parseError);
              return null;
            }
          })
          ?.filter((resume): resume is Resume => resume !== null);

        console.log({ resumes: parsedResumes });
        setResumes(parsedResumes || []);
      } catch (error) {
        console.error('Failed to load resumes:', error);
        setResumes([]);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [kv, auth.isAuthenticated]);



  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found. Upload your resume to get feedback</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )}
        </div>

        {/* Analytics Dashboard */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalResumes}</div>
              <div className="text-sm text-gray-600">Total Resumes</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.averageScore}/100</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.highestScore}/100</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.improvementAreas}</div>
              <div className="text-sm text-gray-600">Tips Given</div>
            </div>
          </div>
        )}

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="resume-scan" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Your Resume Analyses</h3>
              <Link to="/upload" className="primary-button text-white px-4 py-2 rounded-lg transition-colors">
                Analyze New Resume
              </Link>
            </div>
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          </>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
            Upload Resume
            </Link>
          </div>
        )}
      </section>

    </main>
  );
}
