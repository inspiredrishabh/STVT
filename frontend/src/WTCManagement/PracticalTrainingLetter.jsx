import React from 'react';

const PracticalTrainingLetter = ({ trainee }) => {
    return (
        <div className="flex flex-col gap-8">
            <div className="p-8 bg-white shadow-lg font-mangal" style={{ width: '210mm', height: '297mm', margin: 'auto' }}>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">NORTHERN RAILWAY</h1>
                    <h2 className="text-xl">Office of the Director</h2>
                    <h3 className="text-lg">Supervisors' Training Centre</h3>
                    <h4 className="text-lg">Northern Railway</h4>
                    <h5 className="text-lg">Charbagh, Lucknow – 226005</h5>
                </div>

                <div className="flex justify-between mb-6">
                    <p contentEditable={true}>No. STC/CG/16</p>
                    <p contentEditable={true}>DATE: XXXXXXXX</p>
                </div>

                <div className="mb-6">
                    <p contentEditable={true}>XXXXXX</p>
                    <p contentEditable={true}>XXXXXXXXXX</p>
                    <p contentEditable={true}>XXXXX, Lucknow</p>
                </div>

                <div className="mb-6">
                    <p><span className="font-bold">Sub:</span> <span contentEditable={true}>Practical Training of C.G. Apprentices on Shop Floor/Job Training.</span></p>
                </div>

                <p className="mb-6" contentEditable={true}>
                    Undernoted CG Apprentices are directed to you for trade related on job Practical Training for the period mentioned against them. Please send their attendance to this office on 14th of every month during training and arrange to spare them after completion of the training period.
                </p>

                <table className="w-full border-collapse border border-black mb-6">
                    <thead>
                        <tr>
                            <th className="border border-black p-2">S.N.</th>
                            <th className="border border-black p-2">NAME/ Sh./Km/Smt.</th>
                            <th className="border border-black p-2">T.No.</th>
                            <th className="border border-black p-2">TRADE</th>
                            <th className="border border-black p-2">FROM</th>
                            <th className="border border-black p-2">TO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 text-center">1.</td>
                            <td className="border border-black p-2" contentEditable={true}>{trainee.name}</td>
                            <td className="border border-black p-2" contentEditable={true}>{trainee.ticketNo}</td>
                            <td className="border border-black p-2" contentEditable={true}>XXXXX</td>
                            <td className="border border-black p-2" contentEditable={true}>XXXXXXX</td>
                            <td className="border border-black p-2" contentEditable={true}>XXXXXXX</td>
                        </tr>

                    </tbody>
                </table>

                <p className="mb-16" contentEditable={true}>This has approval of the competent authority.</p>

                <div className="flex justify-end">
                    <p className="font-bold" contentEditable={true}>For Director</p>
                </div>

                <div className="mt-8">
                    <p contentEditable={true}>Copy to: Ch. OS/Time Office/ STC for n/action please.</p>
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
                        <p><span className="font-bold">DESIGNATION:</span></p>
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
                    <div className="w-1/2 pl-2">
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
                    <div className="w-1/2 pl-2">
                        <p className="font-bold">TOTAL MARK(A+B)</p>
                        <p className="font-bold">(Total marks for passing : 60% min.)</p>
                        <p className="font-bold">RESULT: (<span contentEditable={true}>PASS/FAIL</span>)</p>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold">SIGNATURE OF SHOP SUPDT./</p>
                        <p className="font-bold">INSPECTOR</p>
                    </div>
                    <div className="w-1/2 pl-2">
                        <p className="font-bold text-center">SIGNATURE TRADE TESTING</p>
                        <p className="font-bold text-center">OFFICER</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="font-bold">SUPERVISOR PRACTICAL TEST</p>
                    <p className="font-bold">MEMO NO. <span contentEditable={true}>CG-xxxx</span></p>
                </div>

                <p className="font-bold mt-4">SCRUTINISED & FORWARDED IN ORIGINAL TO CHAIRMAN TRADE TEST PANEL FOR APPROVAL</p>

                <div className="flex justify-between mt-4">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold">STATION:- LUCKNOW</p>
                    </div>
                    <div className="w-1/2 pl-2">
                        <p className="font-bold">SIGNATURE & DESIGNATION</p>
                        <p className="font-bold">OF DISTRICT OFFICER</p>
                    </div>
                </div>

                <p className="font-bold text-center mt-4">REMARKS OF THE TRADE TEST PANEL</p>

                <div className="flex justify-between mt-4">
                    <div className="w-1/2 pr-2">
                        <p className="font-bold">STATION:- LUCKNOW</p>
                        <p className="font-bold mt-2">DATED <span contentEditable={true}>xxxx</span></p>
                    </div>
                    <div className="w-1/2 pl-2">
                        <p className="font-bold text-center">CHAIRMAN MEMBER TRADE</p>
                        <p className="font-bold text-center">TEST PANEL</p>
                    </div>
                </div>

                <hr className="border-black my-2" />

                <p className="font-bold text-center mt-4">NOTE : THIS FORM SHOULD BE FINALLY PLACED IN PERSONAL FILE OF THE EMPLOYEE AFTER MARKING SUITABLE ENTRY IN THE SERVICE RECORD OF THE EMPLOYEE.</p>
            </div>
        </div>
    );
};

export default PracticalTrainingLetter;
