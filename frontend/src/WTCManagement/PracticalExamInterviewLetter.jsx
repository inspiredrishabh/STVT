import React from 'react';

const PracticalExamInterviewLetter = ({ trainee }) => {
    return (
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
            <p className="mb-6" contentEditable={true}>
                निम्नांकित प्रशिछु को दिनांक xxxxxx से आपके अधीन प्रयोगात्मक परीक्षा तथा फाइनल इंटरव्यू के लिए भेजा जा रहा है। अतः निम्न सी.जी.प्रशिछु / प्रशिछुओं का प्रयोगात्मक परीक्षा तथा फाइनल इंटरव्यू सम्पादित कराकर परीक्षा परिणाम सील बंद लिफाफे में इस कार्यालय दिनांक xxxxxx तक को भेजने का कष्ट करें।
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
    );
};

export default PracticalExamInterviewLetter;
