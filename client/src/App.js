import React, {useState, useEffect} from 'react';

function App() {

    const [cats, setCats]  = useState([]);

    useEffect(() => {

//	 const response = await fetch('/cats');
  //      console.log('got resp???', response);

	fetch("/cats").then(
	    res => res.json()
	).then(
	    data => {
		setCats(data);
		console.log('got cats???', data);
	    }
	);

	fetch("/workouts").then(
	     res => res.json()
	).then(
	    data => {
		console.log('got workouts???', data);
	    });


	fetch("/actualWorkouts").then(
	     res => res.json()
	).then(
	    data => {
		console.log('got actual workouts???', data);
	    }); 
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
