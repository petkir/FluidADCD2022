import { DefaultButton } from "@fluentui/react";
import { Component } from "react";

import styles from './Randomizer.module.scss';

export interface IRandomizerProps {
    value: number;
    onNewNumber: (value: number) => void;
}

export class Randomizer extends Component<IRandomizerProps>{
    
    public render(): React.ReactElement<IRandomizerProps> {
        const {value,onNewNumber} = this.props;
        return (
            <div className={styles.Randomizer}>
                <div className={styles.Value}>
                    {value}
                </div>
                <div className={styles.Action}>
                    <DefaultButton text="next Value" onClick={() => {
                        const round = Math.floor(Math.random() * 10);
                        onNewNumber(round);
                    }} />
                </div>
            </div>
        );
    }
}
