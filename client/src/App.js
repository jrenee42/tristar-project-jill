import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Select from 'react-select'

import './App.css';


function App() {

    const [cats, setCats]  = useState([]);
    const [workoutType, setWorkoutType] = useState([]);
    const [workoutDetails, setWorkoutDetails] = useState([]);

    const [workoutOptions, setWorkoutOptions] = useState([]);

    const [duration, setDuration] = useState(30);
    const [date, setDate] = useState();
   	


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
	const opts = workouts.map(w=> ({value: w.id, label: w.workout_name}));
	setWorkoutOptions(opts);
    };
				  

    useEffect(() => {
	
	getData("/cats", setCats);
        getData("/workouts", makeOptions);

            getData("/actualWorkouts", setWorkoutDetails);
	}
    , []);


 const handleSubmit = async (e) => {
    e.preventDefault();
     const data = { workoutId:1, date: '2024-06-12', duration: 60 };

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

    
    return (
	<div class="container">
	    <div class='workout-form'>
	    Hello world


	    <Button variant='contained' onClick={handleSubmit}> hi there </Button>
		<Select options={workoutOptions} onChange={onWorkoutChange}/>

		  <TextField
          label="Duration"
          id="filled-start-adornment"
          sx={{ m: 1, width: '25ch' }}
		      value ={duration}
		      onChange= {(e) => setDuration(e.target.value)}
          variant="filled"
		  />
		 <LocalizationProvider dateAdapter={AdapterDayjs}>
		  <DatePicker label="Date"
			      onChange={setDate} />
		     </LocalizationProvider>

	</div>
	    </div>
    )
}

export default App;
