function UploadCard({ file, setFile, uploadPDF }) {
  return (
    <div className="card">
      <h2>📄 Upload PDF</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="upload-btn"
        onClick={uploadPDF}
      >
        Upload PDF
      </button>
    </div>
  );
}

export default UploadCard;