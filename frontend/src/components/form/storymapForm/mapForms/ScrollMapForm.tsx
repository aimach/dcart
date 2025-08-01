// import des bibliothèques
import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
// import des composants
import StepPanel from "./StepPanel";
import ErrorComponent from "../../errorComponent/ErrorComponent";
import FormTitleComponent from "../common/FormTitleComponent";
import StepForm from "./StepForm";
import ButtonComponent from "../../../common/button/ButtonComponent";
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
import {
	addLangageBetweenBrackets,
	removeLang2Inputs,
} from "../../../../utils/functions/storymap";
// import des types
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
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

	const { storymapInfos, block, updateFormType, reload, setReload } =
		useBuilderStore(useShallow((state) => state));

	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");

	const { storymapId } = useParams();

	// génération d'un id pour le bloc de type "scroll_map"
	const [scrollMapContent, setScrollMapContent] =
		useState<BlockContentType | null>(block ?? null);

	// fonction appelée lors de la soumission du formulaire (création ou édition d'un bloc de type "scroll_map")
	const handleScrollMapSubmit = async (data: scrollMapInputsType) => {
		if (action === "create") {
			const result = await createBlock({
				...data,
				storymapId,
				typeName: "scroll_map",
			});
			setScrollMapContent(result);
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
			setScrollMapContent(block as BlockContentType);
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
	}, [action, block, setValue]);

	const [inputs, setInputs] = useState(scrollMapInputs);
	useEffect(() => {
		if (!storymapInfos?.lang2) {
			const newInputs = removeLang2Inputs(scrollMapInputs);
			const newInputsWithLangInLabel = addLangageBetweenBrackets(
				newInputs,
				storymapInfos as StorymapType,
			);
			setInputs(newInputsWithLangInLabel);
		}
	}, [storymapInfos]);

	return (
		<section className={style.scrollMapFormContainer}>
			<StepPanel scrollMapContent={scrollMapContent as BlockContentType} />
			<section className={style.scrollMapFormSection}>
				<FormTitleComponent
					action={action as string}
					translationKey="scroll_map"
				/>
				{!scrollMapContent?.id || action === "edit" ? (
					<form
						onSubmit={handleSubmit(handleScrollMapSubmit)}
						className={style.mapFormContainer}
					>
						{inputs.map((input) => {
							if (input.type === "text") {
								return (
									<div key={input.name} className={style.mapFormInputContainer}>
										<div className={style.labelContainer}>
											<label htmlFor={input.name}>
												{input[`label_${language}`]}{" "}
												{input.required.value && (
													<span style={{ color: "#9d2121" }}>*</span>
												)}
											</label>
										</div>
										<div className={style.inputContainer}>
											<input
												{...register(input.name as keyof scrollMapInputsType, {
													required: input.required.value,
												})}
											/>
											{errors[input.name as keyof scrollMapInputsType] && (
												<ErrorComponent
													message={input.required.message?.[language] as string}
												/>
											)}
										</div>
									</div>
								);
							}
							if (input.type === "select") {
								return (
									<div key={input.name} className={style.mapFormInputContainer}>
										<div className={style.labelContainer}>
											<label htmlFor={input.name}>
												{input[`label_${language}`]}{" "}
												{input.required.value && (
													<span style={{ color: "#9d2121" }}>*</span>
												)}
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
											{errors[input.name as keyof scrollMapInputsType] && (
												<ErrorComponent
													message={input.required.message?.[language] as string}
												/>
											)}
										</div>
									</div>
								);
							}
						})}
						<div className={style.formButtonNavigation}>
							<ButtonComponent
								type="button"
								color="brown"
								textContent={translation[language].common.back}
								onClickFunction={() => {
									updateFormType("blockChoice");
									setSearchParams(undefined);
								}}
								icon={<ChevronLeft />}
							/>
							<ButtonComponent
								type="submit"
								color="brown"
								textContent={
									translation[language].backoffice.storymapFormPage.form[
										action === "create" ? "create" : "edit"
									]
								}
							/>
							{action === "edit" && (
								<ButtonComponent
									type="button"
									color="brown"
									textContent={
										translation[language].backoffice.storymapFormPage.form
											.goToSteps
									}
									onClickFunction={() =>
										setSearchParams({ stepAction: "create" })
									}
								/>
							)}
						</div>
					</form>
				) : (
					<div className={style.stepFormContainer}>
						<StepForm scrollMapContent={scrollMapContent} />
					</div>
				)}
			</section>
		</section>
	);
};

export default ScrollMapForm;
