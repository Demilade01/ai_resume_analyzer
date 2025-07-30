import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle'
import { usePuterStore } from '~/lib/puter';

const ResumeCard = ({ resume: { id, companyName, jobTitle, imagePath, resumePath, feedback }}: { resume: Resume }) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const loadResumeImage = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob) {
          console.error("Failed to load resume image");
          return;
        }

        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (error) {
        console.error("Error loading resume image:", error);
      }
    };

    if (imagePath) {
      loadResumeImage();
    }
  }, [imagePath, fs])


  return (
    <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-1000'>
      <div className='resume-card-header'>
        <div className='flex flex-col gap-2 '>
          {companyName && (
             <h2 className='!text-block font-bold break-words'>{ companyName}</h2>
          )}
          {jobTitle && (
             <h3 className='text-lg break-words text-gray-500'>{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && <h2>Resume</h2>}
        </div>

        <div className='flex-shrink-0'>
          <ScoreCircle score={feedback?.overallScore || 0} />
        </div>
      </div>

      { resumeUrl && (
        <div className='radiant-border animate-in-10 fade-in-10 duration-2000'>
          <div className='w-full h-full '>
            <img
              src={resumeUrl}
              alt='resume'
              className='w-full h-[350px] max-sm:h-[200px] object-cover object-top'
            />
          </div>
        </div>
      )}
    </Link>
  )
}

export default ResumeCard
