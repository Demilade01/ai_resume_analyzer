import React, { useState } from 'react'
import Navbar from '~/components/Navbar'

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [statusText, setStatusText] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {}


  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className='page-heading py-16'>
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="scan" className='w-full' />
            </>
          ): (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}

          {isProcessing && (
            <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
              <div className='form-div'>
                <label htmlFor="company-name">Company Name</label>
                <input type="text" id="company-name" placeholder='Company Name' />
              </div>
              <div className='form-div'>
                <label htmlFor="job-title">Job Title</label>
                <input type="text" id="job-title" placeholder='Job Title' />
              </div>
              <div className='form-div'>
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} id="job-description" placeholder='Job Description' />
              </div>
               <div className='form-div'>
                <label htmlFor="job-description">Job Description</label>
                <div>Uploader</div>
              </div>

              <button className='primary-button' type='submit'>
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default upload
