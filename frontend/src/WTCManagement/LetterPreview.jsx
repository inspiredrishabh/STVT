import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import logo from '../assets/rail.png';

const formatMonthYear = (dateString) => {
    if (!dateString) return 'MM/YYYY';
    const date = new Date(dateString);
    return `${date.toLocaleString('default', { month: 'short' })}/${date.getFullYear()}`;
};

const formatDateDDMMYY = (dateString) => {
    if (!dateString) return 'xx/xx/xxxx';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(/\//g, '/');
};

const LetterPreview = () => {
    const navigate = useNavigate();
    const [trainees, setTrainees] = useState([]);

    const letterData = {
        letterNo: `STC/B/B/01`,
        date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-'),
        station: 'LUCKNOW',
        department: 'STC/BTC/CBLKO',
        stationTested: 'SSE/xxxxxxx/LKO',
        testDate: new Date().toLocaleDateString('en-IN'),
        codeNo: 'CG-xxxx',
        distinguishingNo: 'CG-xxx',
        tradeTestingInCharge: 'SSE xxxxxxx',
        tradeOfficerDesignation: 'xxxxxxxxxx',
        tradeTestMarks: 65,
        oralTestMarks: 25,
        supervisorMemoNo: 'CG-xxx',
        dateForwarded: new Date().toLocaleDateString('en-IN'),
        hindiDate: new Date().toLocaleDateString('hi-IN'),
        hindiLetterNo: 'एम.टी.सी./बी.बी./02',
    };
    const passMarks = 36;
    const totalMarks = letterData.tradeTestMarks + letterData.oralTestMarks;
    const result = totalMarks >= passMarks ? 'PASS' : 'FAIL';


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
                        navigate('/wtc/letter');
                    });
                return;
            }

            navigate('/wtc/letter');
        } catch (err) {
            console.error('Error loading trainee data:', err);
            navigate('/wtc/letter');
        }

        return () => {
            sessionStorage.removeItem('selectedTrainees');
        };
    }, [navigate]);

    const LetterTemplate = ({ trainee }) => {
        if (trainee.designation === 'CG Apprentice') {
            return (
                <div className="letter-container mb-12 page-break-after p-8">
                    <header className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <img src={logo} alt="Northern Railway Logo" className="h-20 mr-4" />
                        </div>
                        <div className="text-right">
                            <p className="font-bold">Office of the Director</p>
                            <p>Supervisors' Training Centre</p>
                            <p>Northern Railway</p>
                            <p>Charbagh, Lucknow - 226005</p>
                        </div>
                    </header>
                    <div className="flex justify-between mb-4">
                        <p>No. STC/CG/16</p>
                        <p>DATE: {new Date().toLocaleDateString('en-GB')}</p>
                    </div>
                    <div className="mb-4">
                        <p contentEditable={true}>XXXXXX</p>
                        <p contentEditable={true}>XXXXXXXXXXXX</p>
                        <p contentEditable={true}>XXXXX, Lucknow</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-bold underline">Sub: Practical Training of C.G. Apprentices on Shop Floor/Job Training.</p>
                    </div>
                    <div className="mb-4">
                        <p>
                            Undernoted CG Apprentices are directed to you for trade related on job
                            Practical Training for the period mentioned against them. Please send their
                            attendance to this office on 14th of every month during training and arrange to
                            spare them after completion of the training period.
                        </p>
                    </div>
                    <table className="w-full border-collapse border border-black mb-4">
                        <thead>
                            <tr>
                                <th className="border border-black p-1">S.N.</th>
                                <th className="border border-black p-1">NAME/ Sh./Km/Smt.</th>
                                <th className="border border-black p-1">T.No.</th>
                                <th className="border border-black p-1">TRADE</th>
                                <th className="border border-black p-1">FROM</th>
                                <th className="border border-black p-1">TO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainees.map((t, index) => (
                                <tr key={t.id}>
                                    <td className="border border-black p-1 text-center">{index + 1}.</td>
                                    <td className="border border-black p-1">{t.name}</td>
                                    <td className="border border-black p-1">{t.ticketNo}</td>
                                    <td className="border border-black p-1">{t.trade}</td>
                                    <td className="border border-black p-1">{formatDateDDMMYY(t.dateOfJoiningStcWtcNonRailwa)}</td>
                                    <td className="border border-black p-1">{formatDateDDMMYY(t.dateOfSparing)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mb-8">
                        <p>This has approval of the competent authority.</p>
                    </div>
                    <div className="flex justify-end">
                        <p className="font-bold">For Director</p>
                    </div>
                    <div className="mt-8">
                        <p>Copy to: Ch. OS/Time Office/ STC for n/action please.</p>
                    </div>
                </div>
            )
        }
        return (
            <div className="letter-container mb-12 page-break-after">
                {/* Hindi Letter */}
                <div className="mb-6">
                    <div className="text-center mb-6">
                        <p className="text-2xl font-bold underline">पर्यवेक्षक प्रशिक्षण केंद्र, उ.रे., चारबाग, लखनऊ</p>
                    </div>

                    <div className="flex justify-between mb-6">
                        <div>
                            <p>{letterData.hindiLetterNo}</p>
                        </div>
                        <div>
                            <p>दिनांक, {letterData.hindiDate}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p>{trainee.name || 'xxxxx'}</p>
                        <p>{trainee.trade || 'xxxxx'}</p>
                        <p>{letterData.department || 'xxxxx'}</p>
                    </div>

                    <div className="mb-6">
                        <p className="font-bold">विषय: प्रायोगिक परीक्षा एवं फाइनल इंटरव्यू के संबंध में ।</p>
                    </div>

                    <div className="mb-6">
                        <p>
                            उपरोक्त विषय मे अधोलिखित सी.जी. प्रशिक्षु / प्रशिक्षुओं की प्रायोगिक परीक्षा आपके अधीन
                            सम्पादित होनी है तथा इनका फाइनल इंटरव्यू संबंधित अधिकारी द्वारा लिया जाना है ।
                        </p>
                        <p>
                            निर्धारित प्रशिक्षु को दिनांक {formatDateDDMMYY(trainee.dateOfJoiningStcWtcNonRailwa)} से आपके अधीन प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू के लिए
                            भेजा जा रहा है। अतः निम्न सी.जी.प्रशिक्षु / प्रशिक्षुओं का प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू सम्पादित
                            करवाकर परीक्षा परिणाम नीचे दिए विवरण मे इस कार्यालय दिनांक {formatDateDDMMYY(trainee.dateOfSparing)} तक भेजने का कष्ट करें।
                        </p>
                    </div>

                    <div className="mb-6">
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr>
                                    <th className="border border-black p-1">क्र.सं.</th>
                                    <th className="border border-black p-1">नाम/ श्री/ श्रीमती/ कु.</th>
                                    <th className="border border-black p-1">टि.नं.</th>
                                    <th className="border border-black p-1">ट्रेड</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 text-center">1.</td>
                                    <td className="border border-black p-1">{trainee.name || 'xxxxx'}</td>
                                    <td className="border border-black p-1">{trainee.ticketNo || 'xxxxx'}</td>
                                    <td className="border border-black p-1">{trainee.trade || 'xxxxx'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6">
                        <p>इस हेतु सक्षम अधिकारी का अनुमोदन प्राप्त है।</p>
                    </div>

                    <div className="flex justify-end mt-10">
                        <div className="text-right">
                            <p>कृते निदेशक</p>
                            <p>पर्यवेक्षक प्रशिक्षण केंद्र,</p>
                            <p>उ.रे., चारबाग, लखनऊ।</p>
                        </div>
                    </div>
                </div>

                {/* Page Break for PDF */}
                <div className="page-break-after"></div>

                {/* English Letter */}
                <div className="mb-10 print:mb-0">
                    {/* Letter Header */}
                    <div className="text-center mb-6">
                        <p className="uppercase font-bold">NORTHERN RAILWAY</p>
                        <p className="uppercase font-bold">SUPERVISORS TRAINING CENTRE</p>
                        <p className="uppercase font-bold">CHARBAGH, LUCKNOW</p>
                    </div>

                    {/* Letter Details Grid */}
                    <div className="grid grid-cols-2 mb-4">
                        <div>
                            <p><span className="font-bold">L.P.NO. {trainee.ticketNo}</span></p>
                            <p><span className="font-bold">NAME:</span> {trainee.name || 'xxxxx'}</p>
                            <p><span className="font-bold">DESIGNATION:</span> {trainee.trade || 'CG Apprentice Tech. III /xxxxx'}</p>
                            <p>
                                <span className="font-bold">DATE OF APPOINTMENT</span> <br />
                                SSK/BTMMM &nbsp;&nbsp;&nbsp; {formatMonthYear(trainee.dateOfJoiningStcWtcNonRailwa)}
                            </p>
                            <p><span className="font-bold">DATE TEST ON:</span> {letterData.testDate}</p>
                            <p><span className="font-bold">CODE NO OF TEST APPLIED:CG</span> {letterData.codeNo}</p>
                            <p>
                                <span className="font-bold">TRADE TESTING IN CHARGE: SSE</span><br />
                                {letterData.tradeTestingInCharge}
                            </p>
                        </div>
                        <div>
                            <p><span className="font-bold">DATE</span> {letterData.date}</p>
                            <p><span className="font-bold">STATION:</span> {letterData.station}</p>
                            <p><span className="font-bold">DEPARTMENT:</span> {letterData.department}</p>
                            <p><span className="font-bold">STATION TESTED:SSE/{letterData.stationTested}/LKO</span> </p>
                            <p><span className="font-bold">DISTINGUTING NO.</span> {letterData.distinguishingNo}</p>
                            <p>
                                <span className="font-bold">DESIGNATION:CG</span><br />
                                {letterData.tradeOfficerDesignation}
                            </p>
                        </div>
                    </div>

                    {/* Horizontal Line */}
                    <hr className="border-black mb-4" />

                    {/* Test Results */}
                    <div className="grid grid-cols-2 mb-4">
                        <div>
                            <p className="font-bold">PARTICULAR OF TRADE TEST(A)</p>
                            <p>60 MARKS/(PASS MARKS-36)</p>
                            <p>(S-CASTE- 30)</p>
                        </div>
                        <div>
                            <p className="font-bold">RESULT OF ORAL TEST (B)</p>
                            <p>40 MARKS/(PASS MARKS-15)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 mb-4">
                        <div>
                            <p className="font-bold">PARTICULAR OF TRADE TEST</p>
                            <p className="font-bold">TRADE TEST MARKS (A)</p>
                            <p className="ml-4">{letterData.tradeTestMarks}</p>
                        </div>
                        <div>
                            <p className="font-bold">ORAL TEST MARKS (B)</p>
                            <p className="ml-4">{letterData.oralTestMarks}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 mb-4">
                        <div>
                            <p className="font-bold">TOTAL MARK(A+B)</p>
                            <p>(Total marks for passing : 60% min.)</p>
                        </div>
                        <div>
                            <p className="font-bold">RESULT: ({result})</p>
                        </div>
                    </div>


                    {/* Signatures */}
                    <div className="grid grid-cols-2 mb-4">
                        <div>
                            <p className="font-bold">SIGNATURE OF SHOP SUPDT/</p>
                            <p className="font-bold">INSPECTOR</p>
                        </div>
                        <div>
                            <p className="font-bold">SIGNATURE TRADE TESTING</p>
                            <p className="font-bold">OFFICER</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <p className="font-bold">SUPERVISOR PRACTICAL TEST</p>
                        <p className="font-bold">MEMO NO. CG{letterData.supervisorMemoNo}</p>
                    </div>

                    <p className="font-bold mb-4">SCRUTINISED & FORWARDED IN ORIGINAL TO CHAIRMAN TRADE TEST PANEL FOR APPROVAL</p>

                    <div className="grid grid-cols-2 mb-4">
                        <div>
                            <p className="font-bold">SIGNATURE OF S.T.C</p>
                            <p className="font-bold">INCHARGE</p>
                        </div>
                        <div>
                            <p className="font-bold">CHAIRMAN</p>
                            <p className="font-bold">TRADE TEST PANEL</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <Link to="/wtc/letter" className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200">
                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Letters Preview
                        </h1>
                    </div>

                    <div className="flex space-x-3">
                        <button onClick={() => window.print()} className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                            <Printer className="w-4 h-4" />
                            <span>Print All</span>
                        </button>
                    </div>
                </div>

                {/* Letters Container for HTML Preview */}
                <div className="letters-container">
                    {trainees.map(trainee => (
                        <LetterTemplate key={trainee.id} trainee={trainee} />
                    ))}
                </div>
            </div>

            {/* Add CSS for PDF printing */}
            <style jsx="true">{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .letters-container, .letters-container * {
                        visibility: visible;
                    }
                    .letters-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .page-break-after {
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    );
};

export default LetterPreview;