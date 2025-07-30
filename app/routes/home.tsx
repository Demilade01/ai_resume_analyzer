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
              return JSON.parse(resume.value) as Resume;
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

    loadResumes();
  }, [kv]);



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

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="resume-scan" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
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
