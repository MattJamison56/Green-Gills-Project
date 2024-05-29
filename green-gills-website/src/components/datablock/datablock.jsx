/* eslint-disable react/prop-types */
import { FaThermometerHalf, FaFlask, FaTint } from "react-icons/fa";
import { useEffect, useState } from "react";

const DataBlock = ({ name, data }) => {
  const [stat, setStat] = useState(0);
  const [change, setChange] = useState(0);

  const calculateStatAndChange = (data) => {
    if (data.length < 2) return { stat: 0, change: 0 };
    const stat = data[data.length - 1].temp_fahrenheit;
    const change = stat - data[data.length - 2].temp_fahrenheit;
    return { stat, change };
  };

  useEffect(() => {
    const { stat, change } = calculateStatAndChange(data);
    setStat(stat);
    setChange(change);
  }, [data]);

  const isPositive = change >= 0;
  const changeColor = isPositive ? "green" : "red";
  const changeBGColor = isPositive ? "#f0fff0" : "#fff5f5";
  const changeBorder = isPositive ? "2px solid #d5f5d5" : "2px solid #fc8383";
  const changeTempPic = isPositive ? "#28a745" : "#fc8181";
  const changePHPic = isPositive ? "#007bff" : "#fc8181";
  const changeTDSPic = isPositive ? "#17a2b8" : "#fc8181";

  const getIcon = () => {
    switch (name) {
      case "Temperature":
        return <FaThermometerHalf style={{ fontSize: "30px", color: changeTempPic }} />;
      case "pH":
        return <FaFlask style={{ fontSize: "30px", color: changePHPic }} />;
      case "TDS":
        return <FaTint style={{ fontSize: "30px", color: changeTDSPic }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: changeBGColor, border: changeBorder, borderRadius: "10px", padding: "20px", width: "260px", height: "140px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: "#555" }}>
        <span>{name}</span>
        {getIcon()}
      </div>
      <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333", margin: "10px 0" }}>
        {stat}° F
      </div>
      <div style={{ fontSize: "16px", display: "flex", alignItems: "center", color: changeColor }}>
        <span style={{ fontSize: "18px", marginRight: "5px" }}>{isPositive ? "▲" : "▼"}</span>
        {Math.abs(change)}° F
      </div>
    </div>
  );
};

export default DataBlock;
