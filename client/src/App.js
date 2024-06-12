import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Select from 'react-select'


function App() {

    const [cats, setCats]  = useState([]);
    // const [workoutTypes, setWorkoutTypes] = useState([]);
    const [workoutDetails, setWorkoutDetails] = useState([]);

    const [workoutOptions, setWorkoutOptions] = useState([]);

   	


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


    
    
    return (
	<div>
	    Hello world


	    <Button variant='contained' onClick={handleSubmit}> hi there </Button>
	    <Select options={workoutOptions} />
	</div>
    )
}

export default App;
