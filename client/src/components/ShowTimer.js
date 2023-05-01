import React, { useEffect, useState } from 'react';
import { Form } from "react-bootstrap";

import API from '../API';

const API_POLLING_INTERVAL = 1000;

function ShowTimer(props) {

    const timeRemaining = props.riddle.timestart !== 0 
                            ? props.riddle.duration - Math.floor((Date.now() - props.riddle.timestart)/1000)
                            : props.riddle.duration;
    
    const [time, setTime] = useState(timeRemaining);

    useEffect(()=>{
                
        if (props.riddle.timestart !== 0) {
            setTime(props.riddle.duration - Math.floor((Date.now() - props.riddle.timestart)/1000));
            
            let myInterval = setInterval(() => {
                if (props.riddle.rstatus === 0) // If riddle has become closed from another user
                    clearInterval(myInterval);
                else {
                    if (time > 0) {
                        let timeToSet = props.riddle.duration - Math.floor((Date.now() - props.riddle.timestart)/1000);
                        setTime(timeToSet > 0 ? timeToSet : 0);
                    } else if (time <= 0) {
                        clearInterval(myInterval);
                    } 
                }
            }, API_POLLING_INTERVAL);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.riddle.timestart, props.riddle.rstatus]);

    useEffect(() => {
    
        const setRiddleClosed = async () => {
            await API.setRiddleClosed(props.riddle);
        };

        if (time <= 0)
            setRiddleClosed();
        else if (time <= props.riddle.duration * 0.25) {
            props.showHints(2);
        }
        else if (time <= props.riddle.duration * 0.5) {
            props.showHints(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    return (
        <Form.Label className={(time <= props.riddle.duration * 0.25) 
                                ? 'icon-red' 
                                : (time <= props.riddle.duration * 0.5) 
                                    ? 'icon-orange' 
                                    : 'icon-green'}>
            {Math.floor(time / 60) + ':' + time % 60}
        </Form.Label>
    );
};

export { ShowTimer};