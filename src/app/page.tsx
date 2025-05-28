import { Form } from "./componente/form";
import '/src/app/style.css'; // Certifique-se de que este arquivo existe

export default function Page() {
  return (
    <div style={{ margin: "40px", background: "#fff", padding: "30px", borderRadius: "10px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" ,marginLeft:"480px"}}>
        🌙 Processo de Upload
      </h1>
      <Form />
    </div>
  );
}
