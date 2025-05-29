"use client";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import "/src/app/style.css";
import { useDropzone } from "react-dropzone";

export const Form = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [legendField, setLegendField] = useState("");
  const [progressUpload, setProgressUpload] = useState(0);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (files) => {
      setSelectedFiles(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      setPhotoPreviews(previews);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotoPreviews(previews);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append("files[]", file); // Backend must support multiple files under the same key
    });
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
        <p>Arraste e solte os arquivos aqui ou clique para selecionar</p>
      </div>

      <div>Arquivos: {selectedFiles.length}</div>

      {/* Upload Manual */}
      <input type="file" className="input" multiple onChange={handleFileChange} />

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
        {photoPreviews.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Pré-visualização ${index}`}
            className="image-preview"
            style={{ width: "120px", borderRadius: "8px" }}
          />
        ))}
      </div>
    </div>
  );
};
