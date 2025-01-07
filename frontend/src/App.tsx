// import du style
import "./App.css";
// import des composants
import MapComponent from "./components/MapComponent";

function App() {
	return (
		<div className="app">
			<h1>My Leaflet Map</h1>
			<MapComponent />
		</div>
	);
}

export default App;
