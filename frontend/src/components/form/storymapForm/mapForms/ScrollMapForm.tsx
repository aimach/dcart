// import des bibliothèques
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import StepPanel from "./StepPanel";
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
// import du context
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { scrollMapInputs } from "../../../../utils/forms/storymapInputArray";
import {
	createBlock,
	updateBlock,
} from "../../../../utils/api/storymap/postRequests";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useShallow } from "zustand/shallow";
import {
	notifyCreateSuccess,
	notifyEditSuccess,
} from "../../../../utils/functions/toast";
// import des types
import type { BlockContentType } from "../../../../utils/types/storymapTypes";
import StepForm from "./StepForm";
// import du style
import style from "./mapForms.module.scss";
// import des icônes
import { ChevronLeft } from "lucide-react";

export type scrollMapInputsType = {
	content1_lang1: string;
	content1_lang2: string;
	content2_lang1: string;
};

/**
 * Formulaire pour la création d'un bloc de type "scroll_map"
 */
const ScrollMapForm = () => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { block, updateFormType, reload, setReload } = useBuilderStore(
		useShallow((state) => ({
			block: state.block,
			updateFormType: state.updateFormType,
			reload: state.reload,
			setReload: state.setReload,
		})),
	);

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// génération d'un id pour le bloc de type "scroll_map"
	const [scrollMapId, setScrollMapId] = useState<string | null>(
		block?.id ?? null,
	);

	// fonction appelée lors de la soumission du formulaire (création ou édition d'un bloc de type "scroll_map")
	const handleScrollMapSubmit = async (data: scrollMapInputsType) => {
		if (action === "create") {
			const result = await createBlock({
				...data,
				storymapId,
				typeName: "scroll_map",
			});
			setScrollMapId(result?.id);
			notifyCreateSuccess("Carte déroulante", true);
		} else if (action === "edit") {
			await updateBlock(
				{
					...block,
					...data,
					storymapId,
					typeName: "scroll_map",
				},
				block?.id.toString() as string,
			);
			setScrollMapId((block as BlockContentType).id);
			notifyEditSuccess("Carte déroulante", true);
		}
		// mise à jour des paramètres de l'url pour faire passer l'utilisateur sur le formulaire des étapes de la carte
		setSearchParams({ ...searchParams, stepAction: "create" });
		setReload(!reload);
	};

	// récupération des fonctions de gestion du formulaire
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<scrollMapInputsType>({
		defaultValues: block as scrollMapInputsType,
	});

	useEffect(() => {
		if (action === "edit") {
			setValue("content1_lang1", block?.content1_lang1 as string);
			setValue("content1_lang2", block?.content1_lang2 as string);
		}
	}, [action, block]);

	return (
		<section className={style.scrollMapFormContainer}>
			<StepPanel scrollMapId={scrollMapId} />
			<section className={style.scrollMapFormSection}>
				<FormTitleComponent
					action={action as string}
					translationKey="scroll_map"
				/>
				{!scrollMapId || action === "edit" ? (
					<form
						onSubmit={handleSubmit(handleScrollMapSubmit)}
						className={style.mapFormContainer}
					>
						{scrollMapInputs.map((input) => {
							if (input.type === "text") {
								return (
									<div key={input.name} className={style.mapFormInputContainer}>
										<div className={style.labelContainer}>
											<label htmlFor={input.name}>
												{input[`label_${language}`]}
											</label>
										</div>
										<div className={style.inputContainer}>
											<input
												{...register(input.name as keyof scrollMapInputsType, {
													required: input.required.value,
												})}
											/>
										</div>
										{errors[input.name as keyof scrollMapInputsType] && (
											<ErrorComponent
												message={input.required.message?.[language] as string}
											/>
										)}
									</div>
								);
							}
							if (input.type === "select") {
								return (
									<div key={input.name} className={style.mapFormInputContainer}>
										<div className={style.labelContainer}>
											<label htmlFor={input.name}>
												{input[`label_${language}`]}
											</label>
										</div>
										<div className={style.inputContainer}>
											<select
												{...register(input.name as keyof scrollMapInputsType, {
													required: input.required.value,
												})}
											>
												{input.options?.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
										</div>

										{errors[input.name as keyof scrollMapInputsType] && (
											<ErrorComponent
												message={input.required.message?.[language] as string}
											/>
										)}
									</div>
								);
							}
						})}
						<div className={style.formButtonNavigation}>
							<button
								type="button"
								onClick={() => {
									updateFormType("blockChoice");
									setSearchParams(undefined);
								}}
							>
								<ChevronLeft />
								{translation[language].common.back}
							</button>
							<button type="submit">
								{
									translation[language].backoffice.storymapFormPage.form[
										action === "create" ? "create" : "edit"
									]
								}
							</button>
							{action === "edit" && (
								<button
									type="button"
									onClick={() => setSearchParams({ stepAction: "create" })}
								>
									Aller aux étapes
								</button>
							)}
						</div>
					</form>
				) : (
					<div className={style.stepFormContainer}>
						<StepForm parentBlockId={scrollMapId} />
					</div>
				)}
			</section>
		</section>
	);
};

export default ScrollMapForm;
