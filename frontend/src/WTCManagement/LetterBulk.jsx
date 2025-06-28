import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Search, CheckSquare, Square, Filter, X, User, Users, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import ReactDOM from 'react-dom';

const LetterBulk = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const letterRef = useRef(null);
    const [view, setView] = useState('selection'); // 'selection', 'preview'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedTrainees, setSelectedTrainees] = useState([]);
    const [allTrainees, setAllTrainees] = useState([]);
    const [filteredTrainees, setFilteredTrainees] = useState([]);
    const [filters, setFilters] = useState({
        batch: '',
        moduleNo: '',
        status: '',
    });
    
    // Mock trainee data
    const mockTrainees = [
        {
            id: 1,
            name: 'Rahul Sharma',
            ticketNo: 'WTC/24/001',
            trade: 'CG Apprentice Technician III',
            batch: '2024-2025',
            moduleNo: 'ASE',
            moduleDescription: 'Advanced Service Engineering',
            from: '2024-01-15',
            to: '2025-01-14',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Priya Singh',
            ticketNo: 'WTC/24/002',
            trade: 'RRB Apprentice Technician III',
            batch: '2024-2025',
            moduleNo: 'AJE',
            moduleDescription: 'Advanced Junior Engineering',
            from: '2024-02-01',
            to: '2025-01-31',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Amit Kumar',
            ticketNo: 'WTC/24/003',
            trade: 'CG Apprentice Technician III',
            batch: '2024-2025',
            moduleNo: 'ASE',
            moduleDescription: 'Advanced Service Engineering',
            from: '2024-01-20',
            to: '2024-07-19',
            status: 'Active'
        }
    ];
    
    // Combine mock data with location state data
    useEffect(() => {
        const locationTrainees = location.state?.trainees || [];
        const combinedTrainees = locationTrainees.length > 0 ? locationTrainees : mockTrainees;
        
        setAllTrainees(combinedTrainees);
        setFilteredTrainees(combinedTrainees);
        
        // If trainees came from location state, pre-select them
        if (locationTrainees.length > 0) {
            setSelectedTrainees(locationTrainees.map(t => t.id));
            setView('preview'); // Auto-switch to preview if trainees are passed via state
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);
    
    // Handle search and filtering
    useEffect(() => {
        let results = [...allTrainees];
        
        // Apply search term
        if (searchTerm.trim() !== '') {
            results = results.filter(trainee => 
                trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                trainee.ticketNo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply filters
        if (filters.batch) {
            results = results.filter(trainee => trainee.batch === filters.batch);
        }
        
        if (filters.moduleNo) {
            results = results.filter(trainee => trainee.moduleNo === filters.moduleNo);
        }
        
        if (filters.status) {
            results = results.filter(trainee => trainee.status === filters.status);
        }
        
        setFilteredTrainees(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filters, allTrainees]);
    
    // Toggle trainee selection
    const toggleTraineeSelection = (traineeId) => {
        setSelectedTrainees(prev => {
            if (prev.includes(traineeId)) {
                return prev.filter(id => id !== traineeId);
            } else {
                return [...prev, traineeId];
            }
        });
    };
    
    // Select/Deselect all trainees
    const toggleSelectAll = () => {
        if (selectedTrainees.length === filteredTrainees.length) {
            setSelectedTrainees([]);
        } else {
            setSelectedTrainees(filteredTrainees.map(trainee => trainee.id));
        }
    };
    
    // Reset filters
    const resetFilters = () => {
        setFilters({
            batch: '',
            moduleNo: '',
            status: '',
        });
        setSearchTerm('');
    };
    
    // Get unique filter options
    const getUniqueFilterOptions = (field) => {
        return [...new Set(allTrainees.map(trainee => trainee[field]))];
    };
    
    // Generate letter preview
    const generateLettersPreview = () => {
        if (selectedTrainees.length === 0) {
            alert('Please select at least one trainee');
            return;
        }
        setView('preview');
    };
    
    // Export individual PDF for each trainee
    const exportIndividualPDFs = () => {
        if (selectedTrainees.length === 0) {
            alert('No trainees selected');
            return;
        }

        const selectedTraineeObjects = allTrainees.filter(trainee => selectedTrainees.includes(trainee.id));
        
        // Alert user about the process
        alert(`Preparing to download ${selectedTraineeObjects.length} individual letter PDFs. Each file will download separately.`);
        
        selectedTraineeObjects.forEach((trainee, index) => {
            // Small delay between PDF generations to avoid browser freezing
            setTimeout(() => {
                // Create a temporary element to render the letter
                const tempElement = document.createElement('div');
                tempElement.style.position = 'absolute';
                tempElement.style.left = '-9999px';
                tempElement.style.top = '-9999px';
                document.body.appendChild(tempElement);
                
                // Clone the letter template for this trainee
                const letterCopy = letterRef.current.cloneNode(true);
                
                // Keep only the current trainee's letter
                const letters = letterCopy.getElementsByClassName('letter-container');
                Array.from(letters).forEach(letter => {
                    letter.remove();
                });
                
                // Create a new letter container for this trainee only
                const singleLetterContainer = document.createElement('div');
                singleLetterContainer.className = 'letter-container';
                
                // Add Hindi letter
                const hindiLetter = document.createElement('div');
                hindiLetter.className = 'mb-6';
                hindiLetter.innerHTML = `
                    <div class="text-center mb-6">
                        <p class="font-bold underline">पर्यवेक्षक प्रशिक्षण केंद्र, उ.रे., चारबाग, लखनऊ</p>
                    </div>
                    <div class="flex justify-between mb-6">
                        <div><p>सं, एम.टी.सी./बी.बी./02</p></div>
                        <div><p>दिनांक, ${new Date().toLocaleDateString('hi-IN')}</p></div>
                    </div>
                    <div class="mb-6">
                        <p>${trainee.name || 'xxxxx'}</p>
                        <p>${trainee.trade || 'xxxxx'}</p>
                        <p>STC/BTC/CBLKO</p>
                    </div>
                    <div class="mb-6">
                        <p class="font-bold">विषय: प्रायोगिक परीक्षा एवं फाइनल इंटरव्यू के संबंध में ।</p>
                    </div>
                    <div class="mb-6">
                        <p>उपरोक्त विषय मे अधोलिखित सी.जी. प्रशिक्षु / प्रशिक्षुओं की प्रायोगिक परीक्षा आपके अधीन
                        सम्पादित होनी है तथा इनका फाइनल इंटरव्यू संबंधित अधिकारी द्वारा लिया जाना है ।</p>
                        <p>निर्धारित प्रशिक्षु को दिनांक ${formatDateDDMMYY(trainee.from)} से आपके अधीन प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू के लिए
                        भेजा जा रहा है। अतः निम्न सी.जी.प्रशिक्षु / प्रशिक्षुओं का प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू सम्पादित
                        करवाकर परीक्षा परिणाम नीचे दिए विवरण मे इस कार्यालय दिनांक ${formatDateDDMMYY(trainee.to)} तक भेजने का कष्ट करें।</p>
                    </div>
                    <div class="mb-6">
                        <table class="w-full border-collapse border border-black">
                            <thead>
                                <tr>
                                    <th class="border border-black p-1">क्र.सं.</th>
                                    <th class="border border-black p-1">नाम/ श्री/ श्रीमती/ कु.</th>
                                    <th class="border border-black p-1">टि.नं.</th>
                                    <th class="border border-black p-1">ट्रेड</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border border-black p-1 text-center">1.</td>
                                    <td class="border border-black p-1">${trainee.name || 'xxxxx'}</td>
                                    <td class="border border-black p-1">${trainee.ticketNo || 'xxxxx'}</td>
                                    <td class="border border-black p-1">${trainee.trade || 'xxxxx'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mb-6">
                        <p>इस हेतु सक्षम अधिकारी का अनुमोदन प्राप्त है।</p>
                    </div>
                    <div class="flex justify-end mt-10">
                        <div class="text-right">
                            <p>कृते निदेशक</p>
                            <p>पर्यवेक्षक प्रशिक्षण केंद्र,</p>
                            <p>उ.रे., चारबाग, लखनऊ।</p>
                        </div>
                    </div>
                `;
                
                // Add page break
                const pageBreak = document.createElement('div');
                pageBreak.className = 'page-break';
                
                // Create english letter content here too (shortened for brevity)
                const englishLetter = document.createElement('div');
                englishLetter.className = 'mb-10 print:mb-0';
                englishLetter.innerHTML = `
                    <div class="text-center mb-6">
                        <p class="uppercase font-bold">NORTHERN RAILWAY</p>
                        <p class="uppercase font-bold">SUPERVISORS TRAINING CENTRE</p>
                        <p class="uppercase font-bold">CHARBAGH, LUCKNOW</p>
                    </div>
                    <!-- More letter content would go here -->
                    <div class="grid grid-cols-2 mb-4">
                        <div>
                            <p><span class="font-bold">L.P.NO. ${trainee.ticketNo}</span></p>
                            <p><span class="font-bold">NAME:</span> ${trainee.name || 'xxxxx'}</p>
                            <!-- Additional fields would be here -->
                        </div>
                    </div>
                `;
                
                singleLetterContainer.appendChild(hindiLetter);
                singleLetterContainer.appendChild(pageBreak);
                singleLetterContainer.appendChild(englishLetter);
                
                tempElement.appendChild(singleLetterContainer);
                
                // Export as PDF
                html2pdf().set({
                    margin: [10, 10, 10, 10],
                    filename: `Trade_Test_Letter_${trainee.ticketNo}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                }).from(tempElement).save().then(() => {
                    // Clean up
                    document.body.removeChild(tempElement);
                });
            }, index * 1500); // 1.5 second delay between each export
        });
    };

    // Additional data for the letter
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
        if (selectedTrainees.length === 0) {
            alert('No trainees selected');
            return;
        }

        const element = letterRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Trade_Test_Letters_Bulk_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    // Single Letter Component
    const LetterTemplate = ({ trainee }) => {
        return (
            <div className="letter-container mb-12 page-break-after">
                {/* Hindi Letter */}
                <div className="mb-6">
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
                            निर्धारित प्रशिक्षु को दिनांक {formatDateDDMMYY(trainee.from)} से आपके अधीन प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू के लिए
                            भेजा जा रहा है। अतः निम्न सी.जी.प्रशिक्षु / प्रशिक्षुओं का प्रायोगिक परीक्षा तथा फाइनल इंटरव्यू सम्पादित
                            करवाकर परीक्षा परिणाम नीचे दिए विवरण मे इस कार्यालय दिनांक {formatDateDDMMYY(trainee.to)} तक भेजने का कष्ट करें।
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
                <div className="page-break"></div>

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
                                SSK/BTMMM &nbsp;&nbsp;&nbsp; {formatMonthYear(trainee.from)}
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

                {/* Extra page break after each complete letter */}
                <div className="page-break"></div>
            </div>
        );
    };    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header with back button and actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/wtc/certificate"
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {view === 'selection' ? 'Trainee Letter Selection' : 'Bulk Trade Test Letters'}
                        </h1>
                    </div>

                    {view === 'preview' && (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setView('selection')}
                                className="flex items-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Selection</span>
                            </button>
                            <button
                                onClick={exportIndividualPDFs}
                                className="flex items-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Individual PDFs</span>
                            </button>
                            <button
                                onClick={exportToPdf}
                                className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Combined PDF</span>
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center space-x-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print All</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Trainee Selection View */}
                {view === 'selection' && (
                    <>
                        {/* Search and Filter Controls */}
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                {/* Search Box */}
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search by name or ticket number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                                
                                {/* Filter Controls */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setFilterOpen(!filterOpen)}
                                        className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span>Filter</span>
                                    </button>
                                    
                                    <button 
                                        onClick={resetFilters}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Filter Panel */}
                            {filterOpen && (
                                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Batch Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                                            <select 
                                                className="w-full border rounded-md p-2"
                                                value={filters.batch}
                                                onChange={(e) => setFilters({...filters, batch: e.target.value})}
                                            >
                                                <option value="">All Batches</option>
                                                {getUniqueFilterOptions('batch').map(batch => (
                                                    <option key={batch} value={batch}>{batch}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Module Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                                            <select 
                                                className="w-full border rounded-md p-2"
                                                value={filters.moduleNo}
                                                onChange={(e) => setFilters({...filters, moduleNo: e.target.value})}
                                            >
                                                <option value="">All Modules</option>
                                                {getUniqueFilterOptions('moduleNo').map(module => (
                                                    <option key={module} value={module}>{module}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Status Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select 
                                                className="w-full border rounded-md p-2"
                                                value={filters.status}
                                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                            >
                                                <option value="">All Statuses</option>
                                                {getUniqueFilterOptions('status').map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bulk Actions Bar */}
                        <div className="bg-white shadow rounded-lg p-4 mb-6">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                {/* Selection Counter */}
                                <div className="flex items-center">
                                    <button 
                                        onClick={toggleSelectAll}
                                        className="mr-3"
                                    >
                                        {selectedTrainees.length === filteredTrainees.length && filteredTrainees.length > 0 ? (
                                            <CheckSquare className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <Square className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    <span className="font-medium">
                                        {selectedTrainees.length} of {filteredTrainees.length} selected
                                    </span>
                                </div>
                                
                                {/* Bulk Actions */}
                                <button
                                    onClick={generateLettersPreview}
                                    disabled={selectedTrainees.length === 0}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                                        selectedTrainees.length > 0 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } transition-colors`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Generate Letters</span>
                                </button>
                            </div>
                        </div>

                        {/* Trainees Table */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading trainees...</p>
                                </div>
                            ) : filteredTrainees.length === 0 ? (
                                <div className="p-8 text-center text-gray-600">
                                    <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p>No trainees found matching your search criteria.</p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-4 text-left"></th>
                                                <th className="p-4 text-left">Ticket No.</th>
                                                <th className="p-4 text-left">Name</th>
                                                <th className="p-4 text-left">Designation</th>
                                                <th className="p-4 text-left">Batch</th>
                                                <th className="p-4 text-left">Training Period</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredTrainees.map((trainee) => (
                                                <tr key={trainee.id} className="hover:bg-gray-50">
                                                    <td className="p-4">
                                                        <button onClick={() => toggleTraineeSelection(trainee.id)}>
                                                            {selectedTrainees.includes(trainee.id) ? (
                                                                <CheckSquare className="w-5 h-5 text-blue-600" />
                                                            ) : (
                                                                <Square className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="p-4 font-medium">{trainee.ticketNo}</td>
                                                    <td className="p-4">{trainee.name}</td>
                                                    <td className="p-4">{trainee.trade}</td>
                                                    <td className="p-4">{trainee.batch}</td>
                                                    <td className="p-4">
                                                        {formatDateDDMMYY(trainee.from)} - {formatDateDDMMYY(trainee.to)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Letters Preview */}
                {view === 'preview' && (
                    <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                        <p className="text-gray-700 mb-4">
                            Previewing {selectedTrainees.length} trainee letter{selectedTrainees.length !== 1 ? 's' : ''}
                        </p>
                        
                        <div ref={letterRef} className="letters">
                            {selectedTrainees.map((traineeId) => {
                                const trainee = allTrainees.find(t => t.id === traineeId);
                                return trainee ? (
                                    <LetterTemplate key={traineeId} trainee={trainee} />
                                ) : null;
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Add CSS for PDF printing */}
            <style jsx="true">{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .letters, .letters * {
                        visibility: visible;
                    }
                    .letters {
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
                    .page-break-after {
                        page-break-after: always;
                    }
                    .letter-container {
                        break-inside: avoid;
                        page-break-after: always;
                    }
                }
                
                /* Smooth transitions */
                .letter-container {
                    transition: all 0.3s ease-in-out;
                }
                
                /* Make checkboxes more visible */
                button:focus {
                    outline: 2px solid #3b82f6;
                    outline-offset: 2px;
                }
            `}</style>
        </div>
    );
};

export default LetterBulk;
