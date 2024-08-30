import React, { useState } from 'react';
// import axios from 'axios';

function FileDrop() {
  /*const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null); // Add state for error

  const handleDrop = (e) => {
    e.preventDefault();
    const fileObjects = Array.from(e.dataTransfer.files);
    setFiles(fileObjects);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(file.name, file); // Use filename as key
      console.log(file);
    });

    try {
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (progress) => {
          setUploadProgress({
            ...uploadProgress,
            [index]: (progress.loaded / progress.total) * 100,
          });
        },
      });
      console.log(response.data);
      setError(null); // Clear error on successful upload
    } catch (error) {
      console.error(error);
      setError(error.message); // Set error message for display
    }
  };
*/
  return (
    <div className='max-w-md'>
      {/* <div className='flex flex-col justify-center items-center content-center'>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className='border border-dashed h-48 bg-red-700'
        >
          <p>Drop files here</p>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}
                {uploadProgress[index] ? ` - ${uploadProgress[index]}%` : null}
              </li>
            ))}
          </ul>
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <button onClick={handleUpload}>Upload</button> */}
      </div> 
     

    // </div>
  );
}

export default FileDrop;
