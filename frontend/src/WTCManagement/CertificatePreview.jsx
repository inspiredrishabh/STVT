import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import BgImage from '../assets/fullsizelogo.png';


// Format date for display (can be used by both components)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const designationToHindi = (designation) => {
  const translations = {
    "CG Apprentice Technician III ": "सीजी अपरेंटिस तकनीशियन III कोर्स",
    "RRB Apprentice Technician III": "आरआरबी अपरेंटिस तकनीशियन III कोर्स",
    "RRC Assistant Workshop": "आरआरसी सहायक कार्यशाला",
    "CG Assistant Workshop ": "सीजी सहायक कार्यशाला",
    "GDCE Apprentice tech. III ": "जीडीसीई अपरेंटिस तकनीशियन III कोर्स",
    "Refresher Course for Welders ": "वेल्डर्स के लिए रिफ्रेशर कोर्स",
    "Refresher Course for Artisans ": "कल कारखाने के लिए रिफ्रेशर कोर्स",
    "Special Course on MIG/ MAG Welding & Air Plasma Cutting ": "एमआईजी/एमएजी वेल्डिंग और एयर प्लाज्मा कटिंग पर विशेष पाठ्यक्रम",
    "Basic Welding Training for Beginners": "आरंभकर्ता करने वालों के लिए बुनियादी वेल्डिंग ",
    "Pre-selection Coaching for JE Selection": "जेई चयन के लिए पूर्व-चयन कोचिंग",
  };
  // Return the Hindi translation or the original designation if not found
  return translations[designation] || designation;
};

const CertificatePreview = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);

  // Load selected trainees from sessionStorage or URL params
  useEffect(() => {
    try {
      const storedTrainees = sessionStorage.getItem('selectedTrainees');
      if (storedTrainees) {
        setTrainees(JSON.parse(storedTrainees));
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const traineeIdsParam = queryParams.get('trainees');
      if (traineeIdsParam) {
        const traineeIds = JSON.parse(decodeURIComponent(traineeIdsParam));
        fetch('/api/wtc')
          .then(response => {
            if (!response.ok) throw new Error('Failed to fetch trainees');
            return response.json();
          })
          .then(data => {
            const traineeArray = Array.isArray(data.data) ? data.data : [];
            const selectedTrainees = traineeArray.filter(trainee =>
              traineeIds.includes(trainee.id)
            );
            if (selectedTrainees.length > 0) {
              setTrainees(selectedTrainees);
            } else {
              throw new Error('No matching trainees found');
            }
          })
          .catch(err => {
            console.error('Error fetching trainee data:', err);
            navigate('/wtc/certificate');
          });
        return;
      }

      navigate('/wtc/certificate');
    } catch (err) {
      console.error('Error loading trainee data:', err);
      navigate('/wtc/certificate');
    }

    return () => {
      sessionStorage.removeItem('selectedTrainees');
    };
  }, [navigate]);

  // Individual Certificate Component for HTML Preview
  const CertificateTemplate = ({ trainee }) => {
    return (
      <div className='certificate-container mb-8 page-break-after'>
        <div className="certificate border-4 border-double border-gray-800 p-8 bg-pink-300/5 relative overflow-hidden" >
          {/* Watermark background image */}
          <img
            src={BgImage}
            alt="Watermark"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.2,
              zIndex: 0,
              pointerEvents: 'none',
              objectFit: 'contain',
            }}
            draggable={false}
          />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="w-1/4">
                <img src={BgImage} alt="Logo" className="w-28" />
              </div>
              <div className="w-1/2 text-center">
                <h1 className="text-blue-700 text-4xl font-bold uppercase mb-2">पर्यवेक्षक प्रशिक्षण केंद्र</h1>
                <h2 className="text-blue-700 text-2xl font-bold uppercase">चारबाग, लखनऊ – 226005</h2>
                <h3 className="text-2xl mt-2 underline">प्रशिक्षण प्रमाण – पत्र</h3>
              </div>
              <div className="w-1/4 flex justify-end">
                <div className="h-36 w-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-center text-xs text-gray-500">
                  Passport Size Photograph
                </div>
              </div>
            </div>

            <div className="text-justify text-2xl font-mangal mb-16 leading-14">
              <p className=""> प्रमाणित किया जाता है कि श्री
                <span className="font-bold mr-2 capitalize "> {trainee.name} </span>
                <span className=" mr-2"> पद </span>
                <span className="underline mr-2" contentEditable={true} > ___________________ </span>
                <span className=""> स्टाफ सं. </span>
                <span className="underline mr-2" contentEditable={true} > _______________________________ </span>
                <span className="mr-2"> कार्य स्थल / यूनिट </span>
                <span className="underline mr-2" contentEditable={true} > ________________________________ </span>
                <span className=""> ने इस संस्थान में {designationToHindi(trainee.designation)} प्रशिक्षण कार्यक्रम में दिनांक </span>
                <span className="italic mr-2">
                  {formatDate(trainee.dateOfJoiningStcWtcNonRailway)} से दिनांक  {formatDate(trainee.dateOfSparing)}
                </span>
                तक सफलतापूर्वक भाग लिया है। </p>
              <p className="mt-8 font-semibold text-left text-2xl" contentEditable={true}>दिनांक:</p>
            </div>

            <div className="flex justify-between mt-16">
              <div className="text-center">
                <div className="w-56 mx-auto">
                  <p className="text-xl my-1" contentEditable={true} >(___________)</p>
                  <p className="font-semibold text-2xl">पाठ्यक्रम समन्वयक </p>
                </div>
              </div>
              <div className="text-center">
                <div className="w-48 mx-auto">
                  <p className="text-xl my-1" contentEditable={true} >(___________)</p>
                  <p className="font-semibold text-2xl">निदेशक</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/wtc/certificate" className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Certificates Preview
            </h1>
          </div>

          <div className="flex space-x-3">
            <button onClick={() => window.print()} className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              <Printer className="w-4 h-4" />
              <span>Print All</span>
            </button>
          </div>
        </div>

        {/* Certificates Container for HTML Preview */}
        <div className="certificates-container">
          {trainees.map(trainee => (
            <CertificateTemplate key={trainee.id} trainee={trainee} />
          ))}
        </div>
      </div>

      {/* Add CSS for PDF printing */}
      <style jsx="true">{`
        @media print {
          @page {size: landscape}
          body * {
            visibility: hidden;
          }
          .certificates-container, .certificates-container * {
            visibility: visible;
          }
          .certificates-container {
            position: absolute;
            left: 0;
            top: -20px;
            width: 100%;
            padding: 20px;
          }
          .page-break-after {
            page-break-after: always;
          }
          .certificate {
            height: 190mm;
            width: 270mm;
            margin: auto;
            padding: 20mm;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePreview;
