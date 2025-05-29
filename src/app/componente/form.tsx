"use client";

import axios from "axios";
import { ChangeEvent, useState } from "react";
import "/src/app/style.css";
import { useDropzone } from "react-dropzone";

export const Form = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        setSelectedFile(file);
        setFotoString(URL.createObjectURL(file));
      }
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [legendField, setLegendField] = useState("");
  const [progressUpload, setProgressUpload] = useState(0);
  const [photoString, setFotoString] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFotoString(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("legend", legendField);

    const url = "https://b7web.com.br/uploadtest/";

    try {
      setProgressUpload(0); // reset progress
      await axios.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = (progressEvent.loaded / progressEvent.total) * 100;
            setProgressUpload(pct);
          }
        },
      });
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  };

  return (
    <div className="form-container">
      {/* Área de Dropzone */}
      <div
        className="dropzone"
        style={{
          backgroundColor: "grey",
          width: "525px",
          height: "96px",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
          cursor: "pointer",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} hidden />
        <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
      </div>

      <div>Arquivos: {acceptedFiles.length}</div>

      {/* Upload Manual */}
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
        <div
          className="progress-bar"
          style={{ width: `${progressUpload}%` }}
        ></div>
      </div>

      <div className="progress-text">{progressUpload.toFixed(1)}%</div>

      {photoString && (
        <img
          src={photoString}
          alt="Pré-visualização"
          className="image-preview"
          style={{ marginLeft: "150px", width: "280px" }}
        />
      )}
    </div>
  );
};
