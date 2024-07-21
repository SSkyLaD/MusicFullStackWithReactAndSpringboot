import React from "react"
import "./Clock.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
export default function Clock(){
    const [time,setTime] = React.useState({
        year: null,
        month: null,
        date: null,
        day: null,
        hour : null,
        minute: null,
        second: null
    })
    const [loading,setLoading] = React.useState(true);

    React.useEffect(()=>{
        const ticTac = setInterval(getTime,1000);
        return (() => clearInterval(ticTac));
    })

    function normalize(input){
        return(input < 10 ? `0${input}` : `${input}`)
    }

    function getTime(){
        setLoading(false)
        const time = new Date();
        const dayInWeek =['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        dayInWeek.forEach((value,index)=>{
            if(time.getDay()===index) setTime((prev)=>{
                return({...prev, day: value})
            })
        })
        setTime((prev)=>{
            return({...prev,
                year : time.getFullYear(),
                month : time.getMonth(),
                date : normalize(time.getDate()),
                hour : normalize(time.getHours()),
                minute : normalize(time.getMinutes()),
                second : normalize(time.getSeconds())
            })
        })
    }

    return (
        <div className="clock">
            <div className="date">
                <div>{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.day}</div>
                <div>{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.date}</div>
                <div>{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.month+1}</div>
                <div>{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.year}</div>
            </div>
            <div className="time-container">
                <div className="number-container">
                    <div className="number">{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.hour}</div>
                    <div className="number-tag">Hour</div>
                </div>
                <p>:</p>
                <div className="number-container">
                    <div className="number">{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.minute}</div>
                    <div className="number-tag">Minute</div>
                </div>
                <p>:</p>
                <div className="number-container">
                    <div className="number">{loading ? <FontAwesomeIcon className="spinner" icon={faSpinner}/>: time.second}</div>
                    <div className="number-tag">Second</div>
                </div>
            </div>
        </div>
    )
}