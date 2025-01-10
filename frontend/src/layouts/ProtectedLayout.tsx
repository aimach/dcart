// import des bibliothèques
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
// import du contexte
import { AuthContext } from "../context/AuthContext";

const ProtectedLayout = () => {
	const { isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();

	// biome-ignore lint/correctness/useExhaustiveDependencies: ignore "navigate" dans le tableau de dépendances
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated]);
	return (
		<div>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default ProtectedLayout;
