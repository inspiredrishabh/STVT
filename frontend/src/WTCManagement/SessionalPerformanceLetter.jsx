import React from 'react';

const SessionalPerformanceLetter = ({ trainee }) => {
    return (
        <div className="p-8 bg-white shadow-lg" style={{ width: '210mm', height: '297mm', margin: 'auto' }}>
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold">NORTHERN RAILWAY</h1>
                <h2 className="text-lg font-bold">SUPERVISORS TRAINING CENTRE</h2>
                <h3 className="text-lg font-bold">CHARBAGH, LUCKNOW</h3>
            </div>

            <div className="flex justify-between mb-4">
                <p contentEditable={true}>L. NO. STC/WTC/RRC/Act App./2022</p>
                <p contentEditable={true}>STATION- LUCKNOW</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 mb-4">
                <p><span className="font-bold">NAME:</span> <span contentEditable={true}>{trainee.name}</span></p>
                <p><span className="font-bold">DEPARTMENT-</span> <span contentEditable={true}>STC/WTC/CB/LKO</span></p>
                <p><span className="font-bold">DESIGNATION:</span> <span contentEditable={true}>RRC ACT APPRENTICE</span></p>
                <p><span className="font-bold">TRADE:</span> <span contentEditable={true}>XXXXXX</span></p>
                <p><span className="font-bold">TICKET No.:</span> <span contentEditable={true}>{trainee.ticketNo}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 mb-4">
                <p><span className="font-bold">DATE OF TRAINING START:</span> <span contentEditable={true}>XXXXXX</span></p>
                <p><span className="font-bold">DATE OF TRAINING COMPLETION:</span> <span contentEditable={true}>XXXXXX</span></p>
                <p><span className="font-bold">DATE TRADE TEST ON:</span></p>
            </div>

            <div className="mb-4">
                <p className="font-bold">TRADE TESTING OFFICER</p>
                <p contentEditable={true}>SSE (XXXXXX) /RSW/CB/LKO</p>
            </div>

            <div className="text-center my-4">
                <p className="font-bold underline">PARTICULAR OF TRADE TEST</p>
                <p contentEditable={true}>TOTAL MARKS: 300 (PASS MARKS-180 FOR GENERAL & OBC CANDIDATES)</p>
                <p contentEditable={true}>(150 FOR SC/ST CANDIDATES)</p>
            </div>

            <div className="text-center my-4">
                <p className="font-bold underline">PARTICULAR OF TRADE TEST (If any)</p>
                <p className="font-bold">TOTAL MARKS OBTAINED: ________________</p>
            </div>

            <div className="flex justify-between my-8">
                <p className="font-bold">SIGNATURE OF SHOP SUPDT<br />INCHARGE (With Seal)</p>
                <p className="font-bold">SIGNATURE OF OFFICER<br />(With Seal)</p>
            </div>

            <div className="text-center my-4">
                <h3 className="font-bold underline">RESULT OF SESSIONAL PERFORMANCE</h3>
            </div>

            <table className="w-full border-collapse border border-black mb-6">
                <thead>
                    <tr>
                        <th className="border border-black p-2">S.NO.</th>
                        <th className="border border-black p-2">PARTICULARS</th>
                        <th className="border border-black p-2">TOTAL MARKS</th>
                        <th className="border border-black p-2">MARK OBTAINED</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-black p-2 text-center">1.</td>
                        <td className="border border-black p-2">CLASS TEST</td>
                        <td className="border border-black p-2 text-center">50</td>
                        <td className="border border-black p-2" contentEditable={true}></td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2 text-center">2.</td>
                        <td className="border border-black p-2">ATTENDANCE %</td>
                        <td className="border border-black p-2 text-center">20</td>
                        <td className="border border-black p-2" contentEditable={true}></td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2 text-center">3.</td>
                        <td className="border border-black p-2">CLASSROOM PARTICIPATION</td>
                        <td className="border border-black p-2 text-center">30</td>
                        <td className="border border-black p-2" contentEditable={true}></td>
                    </tr>
                    <tr>
                        <td colSpan="2" className="border border-black p-2 text-right font-bold">GRAND TOTAL</td>
                        <td className="border border-black p-2 text-center font-bold">100</td>
                        <td className="border border-black p-2" contentEditable={true}></td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-between">
                <p className="font-bold">DIRECTOR/STC/CB</p>
                <p className="font-bold">Chief Inst./WTC/CB</p>
            </div>
        </div>
    );
};

export default SessionalPerformanceLetter;
