import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Letter = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const letterRef = useRef(null);

    // Get trainee data from URL params
    const traineeId = queryParams.get('traineeId');
    const ticketNo = queryParams.get('ticketNo');
    const traineeName = queryParams.get('name');
    const trade = queryParams.get('trade');
    const fromDate = queryParams.get('from') ? new Date(queryParams.get('from')) : null;
    const toDate = queryParams.get('to') ? new Date(queryParams.get('to')) : null;

    // Additional data for the letter
    const [letterData, setLetterData] = useState({
        letterNo: `STC/B/B/01`,
        date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-'),
        station: 'LUCKNOW',
        department: 'STC/BTC/CBLKO',
        stationTested: 'SSE/xxxxxxx/LKO',
        testDate: fromDate ? new Date(fromDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN') : '',
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
    });

    // Calculate results
    const passMarks = 36; // 60% of max marks (60)
    const totalMarks = letterData.tradeTestMarks + letterData.oralTestMarks;
    const result = totalMarks >= passMarks ? 'PASS' : 'FAIL';

    // Format date functions
    const formatDateDDMMYY = (dateString) => {
        if (!dateString) return 'xx/xx/xxxx';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '/');
    };

    const formatMonthYear = (dateString) => {
        if (!dateString) return 'MM/YYYY';
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })}/${date.getFullYear()}`;
    };

    // Export to PDF
    const exportToPdf = () => {
        const element = letterRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Trade_Test_Letter_${ticketNo}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header with back button and actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/wtc/trainee-profile"
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">Trade Test Letter</h1>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={exportToPdf}
                            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export as PDF</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print</span>
                        </button>
                    </div>
                </div>

                {/* Letter Container */}
                <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                    <div ref={letterRef} className="letter">


                        {/* Hindi Letter */}

                        <div className="mt-4">
                            <div className="text-center mb-6">
                                <p className="font-bold underline">पर्यवेक्षक प्रशिक्षण केंद्र, उ.रे., चारबाग, लखनऊ</p>
                            </div>

                            <div className="flex justify-between mb-6">
                                <div>
                                    <p>सं, एम.टी.सी./बी.बी./02</p>
                                </div>
                                <div>
                                    <p>दिनांक, {letterData.hindiDate}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p>{traineeName || 'xxxxx'}</p>
                                <p>{trade || 'xxxxx'}</p>
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
                                    निर्धारित प्रशिक्षु को दिनांक {formatDateDDMMYY(fromDate)} से आपके अधीन प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू के लिए
                                    भेजा जा रहा है। अतः निम्न सी.जी.प्रशिक्षु / प्रशिक्षुओं का प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू सम्पादित
                                    करवाकर परीक्षा परिणाम नीचे दिए विवरण मे इस कार्यालय दिनांक {formatDateDDMMYY(toDate)} तक भेजने का कष्ट करें।
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
                                            <td className="border border-black p-1">{traineeName || 'xxxxx'}</td>
                                            <td className="border border-black p-1">{ticketNo || 'xxxxx'}</td>
                                            <td className="border border-black p-1">{trade || 'xxxxx'}</td>
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
                        <div className="page-break"></div>

                        {/* Letter Content */}
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
                                    <p><span className="font-bold">L.P.NO. {ticketNo}</span></p>
                                    <p><span className="font-bold">NAME:</span> {traineeName || 'xxxxx'}</p>
                                    <p><span className="font-bold">DESIGNATION:</span> {trade || 'CG Apprentice Tech. III /xxxxx'}</p>
                                    <p>
                                        <span className="font-bold">DATE OF APPOINTMENT</span> <br />
                                        SSK/BTMMM &nbsp;&nbsp;&nbsp; {formatMonthYear(fromDate)}
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
                                    <p className="font-bold">TOTAL MARK(A+B)</p>
                                    <p>(Total marks for passing : 60% min.)</p>
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
                                    <p className="font-bold">STATION: {letterData.station}</p>
                                </div>
                                <div>
                                    <p className="font-bold">SIGNATURE & DESIGNATION</p>
                                    <p className="font-bold">OF DISTRICT OFFICER</p>
                                </div>
                            </div>

                            <p className="font-bold mb-4 text-center">REMARKS OF THE TRADE TEST PANEL</p>

                            <div className="grid grid-cols-2 mb-4">
                                <div>
                                    <p className="font-bold">STATION: {letterData.station}</p>
                                    <p className="font-bold">DATED</p>
                                </div>
                                <div>
                                    <p className="font-bold">CHAIRMAN MEMBER TRADE</p>
                                    <p className="font-bold">TEST PANEL</p>
                                </div>
                            </div>

                            <hr className="border-black mb-4" />

                            <p className="font-bold mb-4 text-center underline">
                                NOTE : THIS FORM SHOULD BE FINALLY PLACED IN PERSONAL FILE OF THE EMPLOYEE AFTER
                                MARKING SUITABLE ENTRY IN THE SERVICE RECORD OF THE EMPLOYEE.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add CSS for PDF printing */}
            <style jsx="true">{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  .letter, .letter * {
                    visibility: visible;
                  }
                  .letter {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 40px;
                  }
                  .page-break {
                    page-break-after: always;
                    margin-bottom: 0;
                  }
                }
            `}
            </style>
        </div>
    );
};

export default Letter;