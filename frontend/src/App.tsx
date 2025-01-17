// import des bibliothèques
import { useContext } from "react";
// import du context
import { TranslationContext } from "./context/TranslationContext";
// import du style
import "./App.scss";

function App() {
	const { language, translation } = useContext(TranslationContext);

	return (
		<div className="app">
			<h1>{translation[language].title as string}</h1>
		</div>
	);
}

export default App;
