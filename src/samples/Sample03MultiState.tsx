import styles from './Multi.module.scss';
import { Slider } from "@fluentui/react";
import { useState } from "react";
import { Randomizer } from "../components/Rendomizer";

export function Sample03MultiState() {
  const [values, setValues] = useState<number[]>([1]);

  const setNewArryValue = (val: number, index: number): void => {
    const clone = values.slice();
    clone[index] = val;
    setValues(clone);
  }

  const changeArraySize = (value: number): void => {
    if (value < values.length) {
      const clone = values.slice();
      const count = clone.length - value;
      clone.splice(value - 1, count);
      setValues(clone);
    } else if (value > values.length) {
      const count = value - values.length;
      const clone = values.slice();
      for (let i = 0; i < count; i++) {
        clone.push(1);
      }
      setValues(clone);
    }
  }

  return (
    <div className={styles.Multi} >
       <div className={styles.Slider}>
      <Slider defaultValue={values.length} onChanged={(ev, value) => changeArraySize(value)} />
      </div>
      <div className={styles.MultiRandomizer}>
        {values.map((v, i) => {
          return (<Randomizer value={v} key={'random' + i}
            onNewNumber={(val) => setNewArryValue(val, i)} />);
        })
        }
      </div>
    
    </div>
  );
}