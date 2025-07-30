# AI Resume Analyzer 🚀

An intelligent resume analysis platform that provides comprehensive feedback on resumes using AI-powered insights. Built with React Router v7, TypeScript, and integrated with Puter.js for cloud storage and AI processing.

## ✨ Features

- 📄 **PDF Resume Upload**: Drag-and-drop interface for easy resume uploading
- 🤖 **AI-Powered Analysis**: Comprehensive resume feedback using advanced AI models
- 📊 **ATS Compatibility Check**: Analyze how well resumes perform with Applicant Tracking Systems
- 🎯 **Detailed Scoring**: Visual score gauges and detailed breakdown of resume strengths
- 💡 **Actionable Insights**: Specific suggestions for resume improvement
- 🔒 **Secure Authentication**: User authentication with Puter.js integration
- � **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🗂️ **Resume Management**: Save, view, and manage multiple resume analyses
- 🧹 **Data Management**: Complete data wipe functionality for privacy

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, React Router v7
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand
- **File Processing**: PDF.js for PDF to image conversion
- **Cloud Services**: Puter.js (authentication, file storage, AI, key-value storage)
- **UI Components**: Custom accordion, score gauges, and feedback displays

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A modern web browser
- Puter.js account (for cloud services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (if needed for Puter.js configuration)

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## 📱 How to Use

1. **Sign In**: Use the authentication system to create an account or sign in
2. **Upload Resume**: Navigate to the upload page and drag-drop your PDF resume
3. **AI Analysis**: The system will automatically analyze your resume using AI
4. **View Results**: Get comprehensive feedback including:
   - Overall score and breakdown
   - ATS compatibility analysis
   - Detailed suggestions for improvement
   - Section-by-section feedback
5. **Manage Resumes**: View all your analyzed resumes on the dashboard
6. **Data Management**: Use the wipe functionality to clear all data if needed

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

## 🚀 Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t ai-resume-analyzer .

# Run the container
docker run -p 3000:3000 ai-resume-analyzer
```

### Cloud Deployment

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway
- Vercel
- Netlify

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## 🎨 Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Accordion.tsx    # Expandable content sections
│   ├── ATS.tsx         # ATS analysis display
│   ├── Details.tsx     # Detailed feedback
│   ├── FileUploader.tsx # Drag-and-drop file upload
│   ├── Navbar.tsx      # Navigation component
│   ├── ResumeCard.tsx  # Resume preview cards
│   ├── ScoreCircle.tsx # Circular score indicators
│   ├── ScoreGuage.tsx  # Score gauge visualizations
│   └── Summary.tsx     # Analysis summary
├── lib/                # Utility libraries
│   ├── pdftoimage.ts   # PDF conversion utilities
│   ├── puter.ts        # Puter.js integration
│   └── utils.ts        # Helper functions
├── routes/             # Page components
│   ├── auth.tsx        # Authentication page
│   ├── home.tsx        # Dashboard/home page
│   ├── resume.tsx      # Resume analysis results
│   ├── upload.tsx      # File upload page
│   └── wipe.tsx        # Data management page
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) for the excellent routing framework
- [Puter.js](https://puter.com/) for cloud storage and AI services
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF processing

---

Built with ❤️ using React Router v7 and modern web technologies.
