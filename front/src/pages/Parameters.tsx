import * as api from './../API';

function Parameters() {
	console.log("params");
	// api.isAuth();
	return (
	  <div className="Parameters">
		  <p>
			this is the Parameters page
		  </p>
		  <button onClick={api.logout}>LOGOUT</button>

		  <button onClick={api.isAuth}>ISAUTH</button>
	  </div>
	);
  }
  
  export default Parameters;