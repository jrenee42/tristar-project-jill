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
	) 
    }, []);
    
    return (
	<div>
	    Hello world
	</div>
    )
}

export default App;
