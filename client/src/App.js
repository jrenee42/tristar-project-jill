import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import ReactECharts from 'echarts-for-react';

import Select from 'react-select'

import './App.css';


function App() {

    const [workoutType, setWorkoutType] = useState([]);
    const [workoutDetails, setWorkoutDetails] = useState([]);
    const [workoutNames, setWorkoutNames] = useState([]);

    const [workoutOptions, setWorkoutOptions] = useState([]);

    const [duration, setDuration] = useState(30);
    const [date, setDate] = useState(dayjs(new Date()));


    const getData = (endpt, setter) => {
        fetch(endpt).then(
            res => res.json()
        ).then(
            data => {
                setter(data);
                console.log('got data???', data);
                return data;
            }
        );
    };

    const makeOptions = workouts => {
        const opts = workouts.map(w => ({value: w.id, label: w.workout_name}));
        setWorkoutOptions(opts);
        setWorkoutNames(workouts.map(w => w.workout_name));
    };


    useEffect(() => {
        getData("/workouts", makeOptions);
        getData("/actualWorkouts", processData);
    }, []);


    const processData = data => {
        const result = {};
        const uniqueWorkouts = new Set();

        data.forEach(item => {
            const {date, duration_minutes, workout_name} = item;
            if (!result[date]) {
                result[date] = {};
            }
            if (!result[date][workout_name]) {
                result[date][workout_name] = 0;
            }
            result[date][workout_name] += duration_minutes;

            uniqueWorkouts.add(item.workout_name);
        });


        console.log('processed?', result);
        const uniqueWorkoutsList = Array.from(uniqueWorkouts);


        const dataLists = [];
        const keys = Object.keys(result);
        console.log("argh...keys?", keys);

        uniqueWorkoutsList.forEach(wname => {
            const workoutList = new Array(keys.length);


            keys.forEach((oneDay, index) => {
                const duration = result[oneDay][wname];
                if (duration) {
                    workoutList[index] = duration;
                }


                const workoutList = new Array(uniqueWorkoutsList.length);
                uniqueWorkoutsList.forEach((wname, index) => {
                    const duration = result[oneDay][wname];
                    if (duration) {
                        workoutList[index] = duration;
                    }
                });
                dataLists.push(workoutList);
            });
        })

        console.log('lists???', dataLists);

        //  const seriesData = dataLists.map(durations => ({


//
        //}));

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const dateStr = dayjs(date).format('YYYY-MM-DD');
        const data = {workoutId: workoutType, date: dateStr, duration};

        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);
    };

    const onWorkoutChange = wtype => setWorkoutType(wtype.value);


    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                // Use axis to trigger tooltip
                type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
            {
                name: 'Direct',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [320, , 301, 334, 390, 330, 320]
            },
            {
                name: 'Mail Ad',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [120, 132, , 134, 90, 230, 210]
            },
            {
                name: 'Affiliate Ad',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'Video Ad',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
                name: 'Search Engine',
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [820, 832, 901, 934, 1290, 1330, 1320]
            }
        ]
    };


    return (
        <div class="container">
            <div class='workout-form'>

                <div class='header-text'>
                    Add a workout
                </div>

                <div class='form-item'>
                    <Select options={workoutOptions}
                            placeholder='Select Workout'
                            onChange={onWorkoutChange}
                            styles={{menu: provided => ({...provided, zIndex: 9999})}}/>
                </div>
                <div class='form-item'>
                    <TextField
                        label="Duration"
                        id="filled-start-adornment"

                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        variant="filled"
                    />
                </div>
                <div class='form-item'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Date"
                                    value={date}
                                    onChange={setDate}/>
                    </LocalizationProvider>
                </div>
                <Button sx={{marginTop: '8px'}} variant='contained' onClick={handleSubmit}> add workout </Button>


            </div>
            <ReactECharts
                option={option}
                style={{height: '300px', width: '100%'}}
                notMerge={true}
                lazyUpdate={true}
            />
        </div>
    )
}

export default App;
