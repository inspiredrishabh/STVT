import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import BgImage from '../assets/rail.png';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    width: 'auto',
    height: 'auto',
    opacity: 0.1,
  },
  certificateContainer: {
    border: '4px double #000000',
    padding: 20,
    flexGrow: 1,
  },
  textCenter: {
    textAlign: 'center',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  bold: {
    fontWeight: 'bold',
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  p: {
    fontSize: 12,
    marginBottom: 5,
  },
  signatureContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    borderTop: '1px solid #000000',
    paddingTop: 5,
    width: 150,
    textAlign: 'center',
  },
});

// Certificate Component for PDF
const PDFCertificate = ({ trainee }) => (
  <Page size="A4" orientation="landscape" style={styles.page}>
    <Image src={BgImage} style={styles.watermark} />
    <View style={styles.certificateContainer}>
      <View style={styles.textCenter}>
        <Text style={styles.h1}>Workshop Training Center</Text>
        <Text style={styles.h2}>Northern Railway - Charbagh, Lucknow</Text>
        <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 20 }}>Certificate of Completion</Text>
      </View>

      <View style={styles.textCenter}>
        <Text style={styles.p}>This is to certify that</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{trainee.name}</Text>
        <Text style={{ ...styles.p, marginTop: 5 }}>Ticket No: {trainee.ticketNo}</Text>
        <Text style={{ ...styles.p, marginTop: 10 }}>has successfully completed</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>{trainee.moduleDescription}</Text>
        <Text style={styles.p}>({trainee.moduleNo})</Text>
        <Text style={{ ...styles.p, marginTop: 10 }}>from</Text>
        <Text style={{ ...styles.p, fontWeight: 'semibold' }}>
          {formatDate(trainee.dateOfJoiningStcWtcNonRailway)} to {formatDate(trainee.dateOfSparingFromStcWtcNonRailway)}
        </Text>
        <Text style={{ ...styles.p, marginTop: 5 }}>Duration: {trainee.duration}</Text>
      </View>

      <View style={styles.signatureContainer}>
        <View style={styles.signature}>
          <Text style={{ fontWeight: 'bold' }}>Date</Text>
          <Text>{new Date().toLocaleDateString('en-IN')}</Text>
        </View>
        <View style={styles.signature}>
          <Text style={{ fontWeight: 'bold' }}>WTC Director</Text>
          <Text>Northern Railway</Text>
        </View>
      </View>
    </View>
  </Page>
);

// Document Component for PDF
const CertificateDocument = ({ trainees }) => (
  <Document>
    {trainees.map(trainee => (
      <PDFCertificate key={trainee.id} trainee={trainee} />
    ))}
  </Document>
);

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
              width: '80%',
              height: '80%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.08,
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
                <span className=""> ने इस संस्थान में वेल्डर रिफ्रेशर कोर्स प्रशिक्षण कार्यक्रम में दिनांक </span>
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
            <PDFDownloadLink
              document={<CertificateDocument trainees={trainees} />}
              fileName={`WTC_Certificates_Bulk_${new Date().toISOString().slice(0, 10)}.pdf`}
              className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {({ loading }) =>
                loading ? (
                  'Loading document...'
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export All as PDF</span>
                  </>
                )
              }
            </PDFDownloadLink>

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
