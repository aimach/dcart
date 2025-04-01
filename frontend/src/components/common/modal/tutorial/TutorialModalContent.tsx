// import des bibliothèques
import { useState } from "react";
// import des composants
// import du context
// import des services
// import des types
// import du style
import style from "./modalComponent.module.scss";
import { useMapStore } from "../../../../utils/stores/builtMap/mapStore";
import { useShallow } from "zustand/shallow";

const TutorialModalContent = () => {
	const { tutorialStep, incrementTutorialStep, decrementTutorialStep } =
		useMapStore(useShallow((state) => state));

	console.log(tutorialStep);
	return (
		<div>
			{tutorialStep === 1 && (
				<>
					<h4>Bienvenue sur le tutoriel de la carte</h4>
					<p>
						L'objectif de ce tutoriel est de vous apprendre à naviguer à travers
						la carte. Vous pouvez passer les étapes avec les boutons de
						navigation et quitter le tutoriel dès que vous le souhaitez.
					</p>
				</>
			)}
			{tutorialStep === 2 && (
				<>
					<h4>L'espace carte </h4>
					<p>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ea
						voluptate magni voluptates doloribus temporibus in sint, quibusdam
						perferendis officiis odit illum! Neque, exercitationem? Accusantium
						officia odio corporis recusandae voluptates.
					</p>
				</>
			)}
			{tutorialStep === 3 && (
				<>
					<h4>Informations de la carte en cours</h4>
					<p>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ea
						voluptate magni voluptates doloribus temporibus in sint, quibusdam
						perferendis officiis odit illum! Neque, exercitationem? Accusantium
						officia odio corporis recusandae voluptates.
					</p>
				</>
			)}
			{tutorialStep === 4 && (
				<>
					<h4>Le bas de la carte</h4>
					<p>
						Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ea
						voluptate magni voluptates doloribus temporibus in sint, quibusdam
						perferendis officiis odit illum! Neque, exercitationem? Accusantium
						officia odio corporis recusandae voluptates.
					</p>
				</>
			)}
			<div>
				{tutorialStep > 1 && (
					<button
						type="button"
						onClick={() => decrementTutorialStep(tutorialStep)}
						onMouseDown={() => decrementTutorialStep(tutorialStep)}
					>
						Précédent
					</button>
				)}

				<button
					type="button"
					onClick={() => incrementTutorialStep(tutorialStep)}
					onMouseDown={() => incrementTutorialStep(tutorialStep)}
				>
					Suivant
				</button>
			</div>{" "}
		</div>
	);
};

export default TutorialModalContent;
