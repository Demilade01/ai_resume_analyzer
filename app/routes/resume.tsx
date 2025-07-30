import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            // Transform the feedback data to match expected format
            let transformedFeedback = null;
            if (data.feedback) {
                // Check if it's already in the correct format
                if (data.feedback.overallScore !== undefined && data.feedback.ATS !== undefined) {
                    transformedFeedback = data.feedback;
                } else {
                    // Transform from the AI's format to our expected format
                    transformedFeedback = {
                        overallScore: data.feedback.overallRating === "Low" ? 30 :
                                     data.feedback.overallRating === "Medium" ? 60 :
                                     data.feedback.overallRating === "High" ? 85 : 50,
                        ATS: {
                            score: 45, // Default score
                            tips: data.feedback.areasForImprovement?.slice(0, 3).map((item: any) => ({
                                type: "improve" as const,
                                tip: typeof item === 'string' ? item : (item.Category || item.category || item.tip || 'Improvement needed')
                            })) || []
                        },
                        toneAndStyle: {
                            score: 50,
                            tips: data.feedback.strengths?.slice(0, 2).map((strength: string) => ({
                                type: "good" as const,
                                tip: "Positive aspect",
                                explanation: strength
                            })) || []
                        },
                        content: {
                            score: 45,
                            tips: data.feedback.areasForImprovement?.slice(3, 6).map((item: any) => ({
                                type: "improve" as const,
                                tip: typeof item === 'string' ? item : (item.Category || item.category || item.tip || 'Improvement needed'),
                                explanation: typeof item === 'string' ? '' : (item.Details || item.details || item.explanation || '')
                            })) || []
                        },
                        structure: {
                            score: 40,
                            tips: data.feedback.areasForImprovement?.slice(6, 8).map((item: any) => ({
                                type: "improve" as const,
                                tip: typeof item === 'string' ? item : (item.Category || item.category || item.tip || 'Improvement needed'),
                                explanation: typeof item === 'string' ? '' : (item.Details || item.details || item.explanation || '')
                            })) || []
                        },
                        skills: {
                            score: 55,
                            tips: [...(data.feedback.strengths?.slice(1).map((strength: string) => ({
                                type: "good" as const,
                                tip: "Skill highlight",
                                explanation: strength
                            })) || []), ...(data.feedback.areasForImprovement?.slice(8).map((item: any) => ({
                                type: "improve" as const,
                                tip: typeof item === 'string' ? item : (item.Category || item.category || item.tip || 'Improvement needed'),
                                explanation: typeof item === 'string' ? '' : (item.Details || item.details || item.explanation || '')
                            })) || [])]
                        }
                    };
                }
            }

            setFeedback(transformedFeedback);
            console.log({resumeUrl, imageUrl, originalFeedback: data.feedback, transformedFeedback });
        }

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />

                            <ATS score={feedback?.ATS?.score || 0} suggestions={feedback?.ATS?.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume