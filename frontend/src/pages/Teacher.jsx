import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BrowserQRCodeSvgWriter } from "@zxing/library";

function RollingQR() {
  const [qrData, setQrData] = useState(null);
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [isActive, setIsActive] = useState(false);
  const qrRef = useRef(null);
  const intervalRef = useRef(null); 
  const fetchQR = async () => {
    if (!className || !subject) return;
    const res = await axios.get("http://localhost:5000/api/qr/generate", {
      params: { className, subject },
    });
    setQrData(res.data);
  };
  const toggleQR = () => {
    if (isActive) {
      clearInterval(intervalRef.current);
      setQrData(null); 
      setIsActive(false);
    } else {
      fetchQR();
      intervalRef.current = setInterval(fetchQR, 10000);
      setIsActive(true);
    }
  };
  useEffect(() => {
    if (qrData && qrRef.current) {
      const writer = new BrowserQRCodeSvgWriter();
      const svgElement = writer.write(JSON.stringify(qrData), 250, 250);

      qrRef.current.innerHTML = ""; 
      qrRef.current.appendChild(svgElement);
    }
  }, [qrData]);
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Smart Attendance QR</h2>
      <input
        type="text"
        placeholder="Enter Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="border p-2 m-2"
      />
      <input
        type="text"
        placeholder="Enter Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 m-2"
      />
      <button
        onClick={toggleQR}
        disabled={!className || !subject}
        className={`px-4 py-2 rounded text-white ${
          isActive ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isActive ? "Stop QR" : "Start QR"}
      </button>
      {isActive && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Rolling QR for {subject}</h3>
          <div ref={qrRef}></div>
        </div>
      )}
    </div>
  );
}

export default RollingQR;
