// import du style
import { useContext } from "react";
import "./App.scss";
// import des composants
import MapComponent from "./components/mapComponent/MapComponent";
// import du context
import { TranslationContext } from "./context/TranslationContext";

function App() {
	const { language, translation } = useContext(TranslationContext);
	return (
		<div className="app">
			<h1>{translation[language].title}</h1>
			{/* <MapComponent /> */}
		</div>
	);
}

export default App;
