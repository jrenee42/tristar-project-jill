import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import ReactECharts from 'echarts-for-react';

import Select from 'react-select';

import './App.css';

function App() {

    // data that is shown in the graph:
    const [graphData, setGraphData] = useState([]);
    const [daysForGraph, setDaysForGraph] = useState([]);

    // for select dropdown
    const [workoutOptions, setWorkoutOptions] = useState([]);

    // for form:
    const [workoutType, setWorkoutType] = useState([]);
    const [duration, setDuration] = useState(30);
    const defaultDate = dayjs(new Date());
    console.log('using date????', defaultDate);
    const [date, setDate] = useState(defaultDate);

    const getData = (endpt, setter) => {
        fetch(endpt).then(
            res => res.json()
        ).then(
            data => {
                setter(data);
                console.log("ack; data?", data);
            }
        );
    };

    const makeOptions = workouts => {
        const opts = workouts.map(w => ({value: w.id, label: w.workout_name}));
        setWorkoutOptions(opts);
    };


    useEffect(() => {
        getData("/workouts", makeOptions);
        getData("/actualWorkouts", processData);
    }, []);


    const processData = data => {
        const result = {};
        const uniqueWorkouts = new Set();

        // make a map of dates; to a list of all the workouts for each date
        // and add up similar workouts (so 2 walks of 20 min on the same day equals one workout of 40 min)
        // at the same time; collect all the actual workouts used; so only those show up in the graph
        data.forEach(item => {
            const {date, duration_minutes, workout_name} = item;
            // const date = dayjs(longDate).format('MM-DD-YYYY');

            if (!result[date]) {
                result[date] = {};
            }
            if (!result[date][workout_name]) {
                result[date][workout_name] = 0;
            }
            result[date][workout_name] += duration_minutes;

            uniqueWorkouts.add(item.workout_name);
        });

        // used a set to make them unique, now get the unique list as an array:
        const uniqueWorkoutsList = Array.from(uniqueWorkouts);

        const dataLists = [];
        const keys = Object.keys(result);
        setDaysForGraph(keys);

        // now: make a list of; by workout, an entry for each day that is present
        // b/c this is the format that echarts wants for the stacked graph

        // so if there are three days, and mon has 10 min of biking,
        // tues has 20 min of biking,
        // mon has 25 min of walking;
        // and wed has 30 min of walking:

        // and the unique workout list would be ['biking', 'walking'];
        // then dataLists would be:
        //[[10,25], [20, ,], [,30]]
        uniqueWorkoutsList.forEach(wname => {
            const workoutList = new Array(keys.length);
            keys.forEach((oneDay, index) => {
                const duration = result[oneDay][wname];
                if (duration) {
                    workoutList[index] = duration;
                }

            });
            dataLists.push(workoutList);
        })

        const seriesData = dataLists.map((durations, index) => ({
            name: uniqueWorkoutsList[index],
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: durations
        }));

        setGraphData(seriesData);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("in handleSubmit", date);
        const dateStr = dayjs(date).format('MM-DD-YYYY');
        console.log("just formatted:", dateStr);

        const data = {workoutId: workoutType, date: dateStr, duration};

        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        await response.json();

        // now; refetch data:
        // optimization:  add the new data to the raw data; and reprocess it here
        // without adding another network call.
        getData("/actualWorkouts", processData);
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
            data: daysForGraph,
        },
        series: graphData,
    };

    const arghSetDate = x => {
        console.log('about to set date????', x);
        setDate(x);
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
                                    onChange={arghSetDate}/>
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
