// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
import ModalComponent from "../../../components/common/modal/ModalComponent";
import DeleteTagContent from "../../../components/common/modal/DeleteTagContent";
import LabelComponent from "../../../components/form/inputComponent/LabelComponent";
import ErrorComponent from "../../../components/form/errorComponent/ErrorComponent";
import ButtonComponent from "../../../components/common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import du context
import { AuthContext } from "../../../context/AuthContext";
// import des services
import { getDivinityIdsList } from "../../../utils/api/builtMap/getRequests";
import { useModalStore } from "../../../utils/stores/storymap/modalStore";
import { addNewTag } from "../../../utils/api/builtMap/postRequests";
import { notifyCreateSuccess } from "../../../utils/functions/toast";
// import des types
import type { DivinityListType, TagType } from "../../../utils/types/mapTypes";
// import des styles
import style from "./divinityManagementPage.module.scss";

const DivinityManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const { translation, language } = useTranslation();

	const navigate = useNavigate();

	const { closeUpdateModal, isUpdateModalOpen, reload, setReload } =
		useModalStore();

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	const [divinityList, setDivinityList] = useState<string>("");
	// biome-ignore lint/correctness/useExhaustiveDependencies: force le re-render pour le rafraîchissement de la liste
	useEffect(() => {
		const fetchDivinityIdsList = async () => {
			const dinvityIdsList = await getDivinityIdsList();
			setDivinityList(dinvityIdsList);
		};
		fetchDivinityIdsList();
	}, [reload]);

	// import des sevice de formulaire
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<DivinityListType>();

	console.log(divinityList);

	const handleCreateTag = async (data: DivinityListType) => {
		console.log("data", data);
		// const statusResponse = await addNewTag(data);
		// if (statusResponse === 201) {
		// 	notifyCreateSuccess("Etiquette", true);
		// 	setReload(!reload);
		// }
	};

	return divinityList !== "" ? (
		<section className={style.tagManagementSection}>
			{isUpdateModalOpen && (
				<ModalComponent onClose={() => closeUpdateModal()}>
					<DeleteTagContent />
				</ModalComponent>
			)}
			<h4>{translation[language].backoffice.tagManagement.title}</h4>

			<div className={style.tagManagementContainer}>
				{
					<form onSubmit={handleSubmit(handleCreateTag)}>
						<div className={style.tagManagementForm}>
							<div className={style.tagManagementRow}>
								<div className={style.tagInputContainer}>
									<LabelComponent
										htmlFor="divinity_list"
										label="Liste des identifiants des divinités"
										description=""
									/>
									<textarea
										id="divinity_list"
										{...register("divinity_list", {
											required:
												"La liste des identifiants des divinités est requise",
										})}
									/>
								</div>
							</div>

							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].button.edit}
								onClickFunction={handleSubmit(handleCreateTag)}
							/>

							{Object.keys(errors).length > 0 && (
								<ErrorComponent
									message={errors[Object.keys(errors)[0]].message}
								/>
							)}
						</div>
					</form>
				}
			</div>
		</section>
	) : (
		<LoaderComponent size={40} />
	);
};

export default DivinityManagementPage;
