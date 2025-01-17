// import des types
import type { PointType } from "../../../types/mapTypes";
import InfoComponent from "./InfoComponent";

interface ResultComponentProps {
	results: PointType[];
}
const ResultComponent = ({ results }: ResultComponentProps) => {
	return (
		<div>
			{results.map((result: PointType) => {
				return <InfoComponent key={result.nom_ville} point={result} />;
			})}
		</div>
	);
};

export default ResultComponent;
