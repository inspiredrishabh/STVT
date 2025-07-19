import React from 'react';

const PracticalExamInterviewLetter = ({ trainee }) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="p-8 bg-white shadow-lg font-mangal" style={{ width: '210mm', height: '297mm', margin: 'auto' }}>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">पर्यवेक्षक प्रशिक्षण केंद्र, उ.रे., चारबाग, लखनऊ</h1>
                </div>

                <div className="flex justify-between mb-6">
                    <p contentEditable={true}>सं: एस.टी.सी./सी.बी././02</p>
                    <p contentEditable={true}>दिनांक: XXXXXX</p>
                </div>

                <div className="mb-6">
                    <p contentEditable={true}>XXXXXX</p>
                    <p contentEditable={true}>XXXXX,</p>
                    <p contentEditable={true}>XXXXX</p>
                </div>

                <div className="mb-6">
                    <p><span className="font-bold">विषय:</span> <span contentEditable={true}>प्रयोगात्मक परीक्षा एवं फाइनल इंटरव्यू के सम्बंध में ।</span></p>
                </div>

                <p className="mb-4" contentEditable={true}>
                    उपरोक्त विषय में अधोलिखित सी.जी. प्रशिछु / प्रशिछुओं की प्रयोगात्मक परीक्षा आपके अधीन सम्पादित होनी है तथा इनका फाइनल इंटरव्यू संबंधित अधिकारी द्वारा लिया जाना है।
                </p>
                <p className="mb-6">
                    निम्नांकित प्रशिछु को दिनांक <span contentEditable={true}>xxxxxx</span> से आपके अधीन प्रयोगात्मक परीक्षा तथा फाइनल इंटरव्यू के लिए भेजा जा रहा है। अतः निम्न सी.जी.प्रशिछु / प्रशिछुओं का प्रयोगात्मक परीक्षा तथा फाइनल इंटरव्यू सम्पादित कराकर परीक्षा परिणाम सील बंद लिफाफे में इस कार्यालय दिनांक <span contentEditable={true}>xxxxxx</span> तक को भेजने का कष्ट करें।
                </p>

                <table className="w-full border-collapse border border-black mb-6">
                    <thead>
                        <tr>
                            <th className="border border-black p-2">क्र.सं.</th>
                            <th className="border border-black p-2">नाम/ श्री/ श्रीमती/ कु.</th>
                            <th className="border border-black p-2">टि.नं.</th>
                            <th className="border border-black p-2">ट्रेड</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 text-center">1.</td>
                            <td className="border border-black p-2" contentEditable={true}>{trainee.name}</td>
                            <td className="border border-black p-2" contentEditable={true}>{trainee.ticketNo}</td>
                            <td className="border border-black p-2" contentEditable={true}>XXXXXX</td>
                        </tr>
                    </tbody>
                </table>

                <p className="mb-16" contentEditable={true}>इस हेतु सक्षम अधिकारी का अनुमोदन प्राप्त है।</p>

                <div className="text-right">
                    <p className="font-bold">कृते निदेशक</p>
                    <p>पर्यवेक्षक प्रशिक्षण केंद्र,</p>
                    <p>उ.रे., चारबाग, लखनऊ।</p>
                </div>
            </div>

            <br className="break-after-page" />

            <div className="p-8 bg-white shadow-lg font-mangal" style={{ width: '210mm', height: '297mm', margin: 'auto' }}>
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold">NORTHERN RAILWAY</h1>
                    <h2 className="text-lg font-bold">SUPERVISORS TRAINING CENTRE</h2>
                    <h3 className="text-lg font-bold">CHARBAGH, LUCKNOW</h3>
                </div>

                <div className="flex justify-between">
                    <div>
                        <p><span className="font-bold">L.P.NO. STC/B/B/01</span></p>
                        <p><span className="font-bold">NAME: </span><span contentEditable={true}>{trainee.name || "xxxxx"}</span></p>
                        <p><span className="font-bold">DESIGNATION: </span><span contentEditable={true}>CG Apprentice Tech. III</span> <span contentEditable={true}>{trainee.ticketNo || "xxxxxx"}</span></p>
                        <p><span className="font-bold">DATE OF APPOINTMENT</span></p>
                        <p><span className="font-bold">SSE/BTM/MM</span> <span contentEditable={true}>xxxxxxxx</span></p>
                        <p><span className="font-bold">DATE TEST ON</span> <span contentEditable={true}>xxxxxxxx</span></p>
                        <p><span className="font-bold">CODE NO OF TEST APPLIED: </span><span contentEditable={true}>CG-xxxx</span></p>
                        <p><span className="font-bold">TRADE TESTING INCHARGE: SSE</span></p>
                        <p><span contentEditable={true}>xxxxxxx</span></p>
                    </div>
                    <div>
                        <p><span className="font-bold">DATE: </span><span contentEditable={true}>xxxx</span></p>
                        <p><span className="font-bold">STATION: </span>LUCKNOW</p>
                        <p><span className="font-bold">DEPARTMENT: </span><span contentEditable={true}>SSE/STC/CB/LKO</span></p>
                        <p><span className="font-bold">STATION TESTED: </span><span contentEditable={true}>SSE/xxxxxx/LKO</span></p>
                        <p><span className="font-bold">DISTINGUTING NO. </span><span contentEditable={true}>CG-xxxx</span></p>
                        <p className='mt-10'><span className="font-bold">DESIGNATION:</span></p>
                        <p><span contentEditable={true}>xxxxxxxxxxx</span></p>
                    </div>
                </div>

                <hr className="border-black my-2" />

                <div className="flex justify-between">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold">PARTICULAR OF TRADE TEST(A)</p>
                        <p className="font-bold">60-MARKS (PASS MARKS=36)</p>
                        <p className="font-bold">(3/4*60= 36)</p>
                    </div>
                    <div className="w-1/2 pl-28">
                        <p className="font-bold">RESULT OF ORAL TEST (B)</p>
                        <p className="font-bold">40-MARKS (PASS MARKS=15)</p>
                    </div>
                </div>

                <hr className="border-black my-2" />

                <div className="flex justify-between">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold">PARTICULAR OF TRADE TEST</p>
                        <p className="font-bold">TRADE TEST MARKS (A) <span contentEditable={true}>xxxx</span></p>
                    </div>
                    <div className="w-1/2 pl-28">
                        <p className="font-bold">TOTAL MARK(A+B)</p>
                        <p className="font-bold">(Total marks for passing : 60% min.)</p>
                        <p className="font-bold">RESULT: (<span contentEditable={true}>PASS/FAIL</span>)</p>
                    </div>
                </div>

                <div className="flex justify-between mt-8">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold text-sm">SIGNATURE OF SHOP SUPDT./</p>
                        <p className="font-bold text-sm">INSPECTOR</p>
                    </div>
                    <div className="w-1/2 pl-26">
                        <p className="font-bold text-center text-sm">SIGNATURE TRADE TESTING</p>
                        <p className="font-bold text-center text-sm">OFFICER</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-bold text-sm">SUPERVISOR PRACTICAL TEST</p>
                    <p className="font-bold text-sm">MEMO NO. <span contentEditable={true}>CG-xxxx</span></p>
                </div>

                <p className="font-bold mt-4 text-sm">SCRUTINISED & FORWARDED IN ORIGINAL TO CHAIRMAN TRADE TEST PANEL FOR APPROVAL</p>

                <div className="flex justify-between mt-8">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold text-sm">STATION:- LUCKNOW</p>
                    </div>
                    <div className="w-1/2 pl-28">
                        <p className="font-bold text-sm">SIGNATURE & DESIGNATION</p>
                        <p className="font-bold text-sm">OF DISTRICT OFFICER</p>
                    </div>
                </div>

                <p className="font-bold text-center mt-4 text-sm">REMARKS OF THE TRADE TEST PANEL</p>

                <div className="flex justify-between mt-8">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold text-sm">STATION:- LUCKNOW</p>
                        <p className="font-bold mt-2 text-sm">DATED <span contentEditable={true}>xxxx</span></p>
                    </div>
                    <div className="w-1/2 pl-28">
                        <p className="font-bold text-center text-sm">CHAIRMAN MEMBER TRADE</p>
                        <p className="font-bold text-center text-sm">TEST PANEL</p>
                    </div>
                </div>

                <hr className="border-black my-2" />

                <p className="font-bold text-center mt-4">NOTE : THIS FORM SHOULD BE FINALLY PLACED IN PERSONAL FILE OF THE EMPLOYEE AFTER MARKING SUITABLE ENTRY IN THE SERVICE RECORD OF THE EMPLOYEE.</p>
            </div>
        </div>
    );
};

export default PracticalExamInterviewLetter;
