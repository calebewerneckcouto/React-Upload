"use client";

import axios from "axios";
import { ChangeEvent, useState } from "react";
import '/src/app/style.css'; // Certifique-se de que este arquivo existe

export const Form = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [legendField, setLegendField] = useState("");
  const [progressUpload, setProgressUpload] = useState(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("legend", legendField);

      const url = "https://b7web.com.br/uploadtest/";
      await axios.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = (progressEvent.loaded / progressEvent.total) * 100;
            setProgressUpload(pct);
          }
        },
      });
    }
  };

  return (
    <div className="form-container">
      <input type="file" className="input" onChange={handleFileChange} />

      <input
        type="text"
        className="input"
        placeholder="Digite uma legenda"
        value={legendField}
        onChange={(e) => setLegendField(e.target.value)}
      />

      <button className="button" onClick={handleSubmit}>
        Enviar
      </button>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${progressUpload}%` }}></div>
      </div>

      <div className="progress-text">{progressUpload.toFixed(1)}%</div>
    </div>
  );
};
