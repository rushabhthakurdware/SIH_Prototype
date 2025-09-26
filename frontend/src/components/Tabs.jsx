
import React, { useState, useEffect } from "react";
import axios from "axios";
import ODRequestForm from "./ODRequestForm";
import AttendanceCharts from "./AttendanceCharts";
import Header from "./Header";
import Footer from "./Footer";

const QrCodeIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3h6v6H3zM21 15h-6v6h6zM3 15h6v6H3zM21 3h-6v6h6z" />
  </svg>
);

const AssessmentIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20V10M18 20V4M6 20V16" />
  </svg>
);

const FileTextIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const QrScanner = ({ onScanSuccess, onScanError }) => {
  useEffect(() => {
    if (!window.Html5QrcodeScanner || !window.Html5QrcodeScanType) {
      console.error("html5-qrcode library not loaded.");
      return;
    }

    const readerElementId = "reader";
    const html5QrcodeScanner = new window.Html5QrcodeScanner(
      readerElementId,
      {
        qrbox: { width: 250, height: 250 },
        fps: 10,
        supportedScanTypes: [window.Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.clear) {
        html5QrcodeScanner.clear().catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);

  return <div id="reader" className="w-full max-w-md mx-auto" />;
};

const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => console.error("Failed to load scanner script.");
    document.body.appendChild(script);
    return () => script.parentNode && document.body.removeChild(script);
  }, []);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "dashboard") {
      setScannedData(null);
      setAttendanceMessage(null);
    } else {
      setIsScanning(false);
    }
  };

  const onScanSuccess = async (decodedText) => {
    setScannedData(decodedText);
    setIsScanning(false);

    try {
      const qrPayload = JSON.parse(decodedText);
      const studentId = "STUDENT123"; // Replace with actual login ID

      const res = await axios.post(
        "https://discursively-semiformed-herschel.ngrok-free.dev/api/attendance/mark",
        {
          studentId,
          token: qrPayload.token,
          className: qrPayload.className,
          subject: qrPayload.subject,
        }
      );

      setAttendanceMessage(res.data.message);
    } catch (err) {
      setAttendanceMessage(
        err.response?.data?.message || "Failed to mark attendance"
      );
    }
  };

  const onScanError = (errorMessage) => {
    if (
      !errorMessage.includes("No barcode") &&
      !errorMessage.includes("MultiFormat Readers")
    ) {
      console.error("Scan error:", errorMessage);
    }
  };

  const handleScanAgain = () => {
    setScannedData(null);
    setAttendanceMessage(null);
    setIsScanning(true);
  };

  const tabs = [
    {
      key: "dashboard",
      label: "QR Scan",
      icon: <QrCodeIcon className="text-2xl mr-3" />,
    },
    {
      key: "attendance",
      label: "Attendance",
      icon: <AssessmentIcon className="text-2xl mr-3" />,
    },
    {
      key: "od-request",
      label: "OD Request",
      icon: <FileTextIcon className="text-2xl mr-3" />,
    },
  ];

  return (
    <>
    <Header />
      <div className="bg-gray-100 min-h-screen mt-[80px]">
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex items-center justify-center p-4 rounded-lg shadow-sm transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  activeTab === tab.key
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                <span className="font-semibold text-lg">{tab.label}</span>
              </div>
            ))}
          </div>

          {activeTab === "dashboard" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {!scannedData ? (
                isScanning ? (
                  <>
                    <h2 className="text-center text-xl font-semibold mb-4">
                      Point Camera at QR Code
                    </h2>
                    {isScriptLoaded ? (
                      <QrScanner
                        onScanSuccess={onScanSuccess}
                        onScanError={onScanError}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        Loading Scanner...
                      </div>
                    )}
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setIsScanning(false)}
                        className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => setIsScanning(true)}
                      className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400"
                      disabled={!isScriptLoaded}
                    >
                      {isScriptLoaded ? "Start Scanning" : "Loading Scanner..."}
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">
                    Scan Successful!
                  </h2>
                  <pre className="text-sm bg-gray-100 p-3 rounded-md inline-block">
                    {scannedData}
                  </pre>
                  {attendanceMessage && (
                    <p
                      className={`mt-4 font-semibold ${
                        attendanceMessage.includes("success")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {attendanceMessage}
                    </p>
                  )}
                  <button
                    onClick={handleScanAgain}
                    className="mt-6 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Scan Again
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === "od-request" && <ODRequestForm />}
          {activeTab === "attendance" && <AttendanceCharts />}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
