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

        </div>
    );
};

export default PracticalTrainingLetter;
