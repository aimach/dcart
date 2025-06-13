// import des bibliothèques
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import LoaderComponent from "../../../components/common/loader/LoaderComponent";
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
import { notifyEditSuccess } from "../../../utils/functions/toast";
import { updateDivinityList } from "../../../utils/api/builtMap/putRequests";
import { divinityRequest } from "../../../utils/forms/divinityRequest";
// import des types
import type { DivinityListType } from "../../../utils/types/mapTypes";
// import des styles
import style from "./divinityManagementPage.module.scss";
// import des icônes
import { CircleHelp } from "lucide-react";

const DivinityManagementPage = () => {
	const { isAdmin } = useContext(AuthContext);

	const { translation, language } = useTranslation();

	const navigate = useNavigate();

	const { reload, setReload } = useModalStore();

	useEffect(() => {
		if (!isAdmin) {
			navigate("/backoffice");
		}
	}, [isAdmin, navigate]);

	const [divinityList, setDivinityList] = useState<string>("");
	useEffect(() => {
		const fetchDivinityIdsList = async () => {
			const dinvityIdsList = await getDivinityIdsList();
			setDivinityList(dinvityIdsList);
			setValue("divinity_list", dinvityIdsList);
		};
		fetchDivinityIdsList();
	}, []);

	// import des sevice de formulaire
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<DivinityListType>();

	const handleUpdateDivinityIdsList = async (data: DivinityListType) => {
		const statusResponse = await updateDivinityList(data);
		if (statusResponse === 201) {
			notifyEditSuccess("Liste des divinités", true);
			setReload(!reload);
			setValue("divinity_list", data.divinity_list);
		}
	};

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(divinityRequest);
			setCopied(true);

			setTimeout(() => setCopied(false), 3000);
		} catch (err) {
			console.error(err);
		}
	};
	return divinityList !== "" ? (
		<section className={style.divinityManagementSection}>
			<div className={style.divinityManagementHeader}>
				<div>
					<CircleHelp />
					<p>
						Cette page permet d'enregister la liste des identifiants des
						éléments qui sont des divinités. Actuellement, cette liste a été
						générée par une requête SQL qui récupère tous les ids des éléments
						qui n'ont pas de catégorie.
					</p>
				</div>
				<button type="button" onClick={handleCopy}>
					{translation[language].button.copyRequest}
				</button>
				{copied && (
					<p className={style.copiedMessage}>
						{translation[language].alert.copied}
					</p>
				)}
			</div>
			<div className={style.divinityManagementContainer}>
				{
					<form
						onSubmit={handleSubmit(handleUpdateDivinityIdsList)}
						key={reload.toString()}
					>
						<div className={style.divinityManagementForm}>
							<div className={style.divinityManagementRow}>
								<div
									className={style.tagInputContainer}
									style={{ width: "100%" }}
								>
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
								onClickFunction={handleSubmit(handleUpdateDivinityIdsList)}
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
