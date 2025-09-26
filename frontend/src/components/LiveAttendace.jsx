import React from "react";

// Reusable Card component
const Card = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-md h-full flex flex-col ${className}`}
  >
    {title && (
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    )}
    {children}
  </div>
);

// LiveAttendance Component
const LiveAttendance = ({ liveAttendanceData = [] }) => {
  return (
    <Card className="flex-1">
      <div className="flex items-center space-x-2 text-blue-600 mb-4">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 8v13m0 0l4-4m-4 4l-4-4"
          ></path>
        </svg>
        <span className="font-medium text-lg">Live Attendance</span>
        <span className="bg-gray-100 text-gray-600 text-sm font-semibold ml-auto px-2 py-1 rounded-full">
          {liveAttendanceData.length}
        </span>
      </div>
      <ul className="divide-y divide-gray-200">
        {liveAttendanceData.length === 0 ? (
          <li className="py-2 text-gray-500 text-sm">
            No students have checked in yet.
          </li>
        ) : (
          liveAttendanceData.map(
            (student, index) =>
              student && ( // Skip undefined or null entries
                <li
                  key={index}
                  className="py-2 flex items-center justify-between"
                >
                  <div>
                    <div className="text-gray-900 font-medium">
                      {student.studentName}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {student.studentId}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        student.status === "Present"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.status}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {student.time}
                    </span>
                  </div>
                </li>
              )
          )
        )}
      </ul>
    </Card>
  );
};

export default LiveAttendance;
