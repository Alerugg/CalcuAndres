import React, { useState } from "react";
import "./style.css";


export const Home = () => {
  const [sexo, setSexo] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [edad, setEdad] = useState("");
  const [factorActividad, setFactorActividad] = useState("");

  const [objetivo, setObjetivo] = useState("");
  const [intensidad, setIntensidad] = useState("");

  const [diasFiesta, setDiasFiesta] = useState("0");
  const [excesoFiesta, setExcesoFiesta] = useState("");

  const [resultados, setResultados] = useState(null);

  const r0 = (val) => Math.round(val);

  const calcularTMB = ({ sexo, peso, altura, edad }) => {
    if (!sexo || !peso || !altura || !edad) return 0;
    return sexo === "hombre"
      ? 10 * peso + 6.25 * altura - 5 * edad + 5
      : 10 * peso + 6.25 * altura - 5 * edad - 161;
  };

  const obtenerAjusteDiario = (objetivo, intensidad) => {
    if (objetivo === "mantener") return 0;
    if (objetivo === "perder") {
      if (intensidad === "suave") return -300;
      if (intensidad === "moderado") return -500;
      if (intensidad === "acelerado") return -700;
    }
    if (objetivo === "ganar") {
      if (intensidad === "suave") return 200;
      if (intensidad === "moderado") return 300;
      if (intensidad === "acelerado") return 500;
    }
    return 0;
  };

  const calcularMacros = (caloriasDiarias, peso) => {
    if (caloriasDiarias <= 0 || peso <= 0) {
      return { proteina: 0, grasa: 0, carbs: 0 };
    }

    const proteinaGr = 2 * peso;
    const kcalProteina = proteinaGr * 4;
    const kcalGrasa = 0.3 * caloriasDiarias;
    const grasaGr = kcalGrasa / 9;
    const kcalRest = caloriasDiarias - (kcalProteina + kcalGrasa);
    const carbsGr = kcalRest > 0 ? kcalRest / 4 : 0;

    return { proteina: proteinaGr, grasa: grasaGr, carbs: carbsGr };
  };

  const handleCalcular = () => {
    if (!sexo || !peso || !altura || !edad || !factorActividad) {
      alert("Completa todos los datos.");
      return;
    }

    if (!objetivo || ((objetivo === "perder" || objetivo === "ganar") && !intensidad)) {
      alert("Selecciona objetivo e intensidad.");
      return;
    }

    const numericTMB = calcularTMB({ sexo, peso: Number(peso), altura: Number(altura), edad: Number(edad) });
    const tdeeBase = numericTMB * Number(factorActividad);
    const ajusteDiario = obtenerAjusteDiario(objetivo, intensidad);
    const calsSinFiesta = tdeeBase + ajusteDiario;

    const calsSemanalSF = calsSinFiesta * 7;
    const totalExcesoSemanal = Number(diasFiesta) * Number(excesoFiesta || 0);
    let calsSemanalCF = calsSemanalSF - totalExcesoSemanal;
    if (calsSemanalCF < 0) calsSemanalCF = 0;
    const calsConFiesta = calsSemanalCF / 7;

    const macros = calcularMacros(calsSinFiesta, Number(peso));

    setResultados({
      tmb: numericTMB,
      tdeeBase,
      ajusteDiario,
      calsSinFiesta,
      calsConFiesta,
      diasFiesta: Number(diasFiesta),
      proteina: macros.proteina,
      grasa: macros.grasa,
      carbs: macros.carbs,
    });
  };

  return (
    <div className="container p-4">
      <h2>Calculadora Nutricional</h2>

      <div className="row mb-3">
        <input type="text" placeholder="Sexo" onChange={(e) => setSexo(e.target.value)} />
        <input type="number" placeholder="Peso (kg)" onChange={(e) => setPeso(e.target.value)} />
        <input type="number" placeholder="Altura (cm)" onChange={(e) => setAltura(e.target.value)} />
        <input type="number" placeholder="Edad" onChange={(e) => setEdad(e.target.value)} />
        <input type="number" placeholder="Factor actividad (ej. 1.55)" onChange={(e) => setFactorActividad(e.target.value)} />
      </div>

      <div className="row mb-3">
        <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
          <option value="">Objetivo</option>
          <option value="perder">Perder</option>
          <option value="mantener">Mantener</option>
          <option value="ganar">Ganar</option>
        </select>

        {(objetivo === "perder" || objetivo === "ganar") && (
          <select value={intensidad} onChange={(e) => setIntensidad(e.target.value)}>
            <option value="">Intensidad</option>
            <option value="suave">Suave</option>
            <option value="moderado">Moderado</option>
            <option value="acelerado">Acelerado</option>
          </select>
        )}

        <input type="number" placeholder="Días de fiesta" value={diasFiesta} onChange={(e) => setDiasFiesta(e.target.value)} />
        {Number(diasFiesta) > 0 && (
          <input type="number" placeholder="Exceso por día (kcal)" value={excesoFiesta} onChange={(e) => setExcesoFiesta(e.target.value)} />
        )}
      </div>

      <button onClick={handleCalcular}>Calcular</button>

      {resultados && (
        <div className="mt-4">
          <h4>Resultados</h4>
          <ul>
            <li><strong>TMB:</strong> {r0(resultados.tmb)} kcal/día</li>
            <li><strong>TDEE Base:</strong> {r0(resultados.tdeeBase)} kcal/día</li>
            <li><strong>Con Ajuste:</strong> {r0(resultados.calsSinFiesta)} kcal/día</li>
            <li><strong>Con Fiesta:</strong> {r0(resultados.calsConFiesta)} kcal/día</li>
            <li><strong>Proteína:</strong> {r0(resultados.proteina)} g</li>
            <li><strong>Grasa:</strong> {r0(resultados.grasa)} g</li>
            <li><strong>Carbohidratos:</strong> {r0(resultados.carbs)} g</li>
          </ul>
        </div>
      )}
    </div>
  );
};
