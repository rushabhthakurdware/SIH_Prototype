import React, { useState, useEffect } from "react";
// --- Mock Icons (You can replace these with your actual icon components) ---
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
// --- End Icons ---

// A dedicated component for the QR Scanner
const QrScanner = ({ onScanSuccess, onScanError }) => {
  useEffect(() => {
    // Check if the library is loaded
    if (!window.Html5QrcodeScanner || !window.Html5QrcodeScanType) {
      console.error("html5-qrcode library not loaded.");
      return;
    }

    const readerElementId = "reader";

    // The library is now accessed from the window object.
    const html5QrcodeScanner = new window.Html5QrcodeScanner(
      readerElementId,
      {
        qrbox: { width: 250, height: 250 },
        fps: 10,
        // ✅ EDIT: This line restricts the scanner to only use the camera.
        supportedScanTypes: [window.Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      /* verbose= */ false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);

    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      // It's important to check if the scanner instance exists and has the clear method.
      if (html5QrcodeScanner && html5QrcodeScanner.clear) {
        html5QrcodeScanner.clear().catch((error) => {
          console.error("Failed to clear scanner.", error);
        });
      }
    };
  }, [onScanSuccess, onScanError]);

  // The div where the scanner will be rendered
  return <div id="reader" className="w-full max-w-md mx-auto"></div>;
};

// Main App component that manages state and UI
const App = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load the html5-qrcode script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
    script.async = true;
    script.onload = () => {
      console.log("Scanner script loaded successfully.");
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load scanner script.");
    };

    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []); // Empty dependency array ensures this runs only once.

  // --- Handlers ---
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === "dashboard") {
      setScannedData(null); // Reset previous scan
    } else {
      setIsScanning(false);
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log(`✅ Scan successful: ${decodedText}`);
    setScannedData(decodedText);
    setIsScanning(false); // Stop scanning after success
  };

  const onScanError = (errorMessage) => {
    // This fires continuously, so we don't need to log it unless debugging.
  };

  const handleScanAgain = () => {
    setScannedData(null);
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
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          QR Code Attendance System
        </h1>
      </header>

      <main className="p-4 md:p-6">
        {/* --- Tabs UI --- */}
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

        {/* --- Conditional Content Area --- */}
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
                <p className="text-lg text-gray-800 mb-2">Device ID:</p>
                <p className="text-lg font-mono bg-gray-100 p-3 rounded-md inline-block">
                  {scannedData}
                </p>
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
      </main>
    </div>
  );
};

export default App;