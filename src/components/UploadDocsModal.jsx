import { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function UploadDocsModal({ driver, onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!files.length) return alert("Please select at least one file.");
    setUploading(true);
    setProgress(0);

    try {
      const uploadedFiles = [];

      for (const file of files) {
        const storageRef = ref(storage, `drivers/${driver.id}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(Math.round(percent));
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedFiles.push({ name: file.name, url });
              resolve();
            }
          );
        });
      }

      // Save into Firestore
      await updateDoc(doc(db, "drivers", driver.id), {
        "documents.files": arrayUnion(...uploadedFiles),
      });

      alert("✅ Files uploaded successfully!");
      onClose();
    } catch (err) {
      console.error("Error uploading files:", err);
      alert("❌ Failed to upload files.");
    }

    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Upload Documents for {driver.name}
        </h2>

        {/* File Selector */}
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="mb-4"
        />

        {/* Show selected files */}
        <ul className="mb-4 text-sm text-gray-600">
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>

        {/* Progress bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={uploading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {uploading ? `Uploading... ${progress}%` : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
