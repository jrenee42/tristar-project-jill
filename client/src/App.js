import React, {useState, useEffect} from 'react';

function App() {

    const [cats, setCats]  = useState([]);
    const [workoutTypes, setWorkoutTypes] = useState([]);
    const [workoutDetails, setWorkoutDetails] = useState([]);
	   


    const getData = (endpt, setter) => {
		fetch(endpt).then(
	    res => res.json()
	).then(
	    data => {
		setter(data);
		console.log('got data???', data);
	    }
	);
    };

    useEffect(() => {
	getData("/cats", setCats);
        getData("/workouts", setWorkoutTypes);
        getData("/actualWorkouts", setWorkoutDetails);

    }, []);


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


	    <button onClick={handleSubmit}> hi there </button>
	</div>
    )
}

export default App;
