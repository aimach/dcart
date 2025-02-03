// import des bibliothèques
import { useParams } from "react-router";
// import des composants
import MapMenuNav from "../../components/map/mapMenuNav/MapMenuNav";
// import du style
import style from "./mapMenuPage.module.scss";

const MapMenuPage = () => {
	const { categoryId } = useParams();

	return (
		<section className={style.mapMenu}>
			<div className={style.mapMenuNavContainer}>
				<MapMenuNav categoryId={categoryId as string} />
			</div>
		</section>
	);
};

export default MapMenuPage;
