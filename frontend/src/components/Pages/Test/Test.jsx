import { useState } from "react";

const Test = () => {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <>
      <h1>Тест</h1>
      <input
        type="date"
        value={selectedDate}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </>
  );
};

export default Test;
