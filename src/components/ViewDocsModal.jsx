export default function ViewDocsModal({ driver, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold">Driver Documents</h2>

        {driver.documents?.files?.length > 0 ? (
          <ul className="list-disc pl-5 max-h-60 overflow-y-auto">
            {driver.documents.files.map((file, idx) => (
              <li key={idx}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No documents uploaded.</p>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
