import { useState } from "react";
import { Randomizer } from "../components/Rendomizer";

export function Sample02MuliRandomizer() {
    const [myValue, setValue] = useState(1)
    return (
      <div >
      <Randomizer value={myValue} onNewNumber={(val)=>setValue(myValue)} />
      </div>
    );
  }