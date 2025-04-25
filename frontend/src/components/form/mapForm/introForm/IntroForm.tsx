// import des bibliothèques
import { useContext, useEffect, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router";
import Select from "react-select";
// import des composants
import NavigationButtonComponent from "../navigationButton/NavigationButtonComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
import EditorComponent from "../../storymapForm/wysiwygBlock/EditorComponent";
import LabelComponent from "../../inputComponent/LabelComponent";
// import du contexte
import { TagOptionsContext } from "../../../../context/TagContext";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useMapFormStore } from "../../../../utils/stores/builtMap/mapFormStore";
import { useShallow } from "zustand/shallow";
import { createNewMap } from "../../../../utils/api/builtMap/postRequests";
import { updateMap } from "../../../../utils/api/builtMap/putRequests";
import { notifyCreateSuccess } from "../../../../utils/functions/toast";
// import des types
import type { FieldErrors, SubmitHandler } from "react-hook-form";
import type { InputType } from "../../../../utils/types/formTypes";
import type { MapInfoType, TagType } from "../../../../utils/types/mapTypes";
import type { TranslationType } from "../../../../utils/types/languageTypes";
import type Quill from "quill";
import type { Dispatch, SetStateAction } from "react";
import type { MultiValue } from "react-select";
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "./introForm.module.scss";
import { getOneMapInfos } from "../../../../utils/api/builtMap/getRequests";

type IntroFormProps = {
	inputs: InputType[];
	setIsMapCreated: Dispatch<SetStateAction<boolean>>;
};

/**
 * Formulaire de la première étape de création : informations générales (titre, description, catégorie)
 * @param inputs la liste des inputs du formulaire
 * @returns ErrorComponent | NavigationButtonComponent
 */
const IntroForm = ({ inputs, setIsMapCreated }: IntroFormProps) => {
	const { translation, language } = useTranslation();

	const { tagOptions } = useContext(TagOptionsContext);

	const { pathname, state } = useLocation();

	const { mapId } = useParams();

	// récupération des données des stores
	const { mapInfos, setMapInfos, step, incrementStep } = useMapFormStore(
		useShallow((state) => state),
	);

	const handleSelectTagsChange = (value: MultiValue<OptionType>) => {
		const tagIds = value.map((tag) => tag.value as string).join("|");
		const newMapInfos = { ...mapInfos, tags: tagIds };
		setMapInfos(newMapInfos as MapInfoType);
	};

	// définition de la fonction de soumission du formulaire (ajout des données au store et passage à l'étape suivante)
	const onSubmit: SubmitHandler<MapInfoType> = async (data) => {
		if (pathname.includes("create")) {
			const newMapResponse = await createNewMap({
				...mapInfos,
				...data,
			});
			if (newMapResponse?.status === 201) {
				setMapInfos(newMapResponse.data);
				setIsMapCreated(true);
				incrementStep(step);
				notifyCreateSuccess("Carte", true);
			}
		} else if (pathname.includes("edit")) {
			// mise à jour de la carte
			const updatedMapResponse = await updateMap(mapInfos as MapInfoType);
			if (updatedMapResponse?.status === 200) {
				setMapInfos(updatedMapResponse.data);
				incrementStep(step);
			}
		}
	};

	// import des services du formulaire
	const {
		control,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<MapInfoType>({
		defaultValues: mapInfos ?? {},
	});

	useEffect(() => {
		const fetchMapInfos = async () => {
			const allMapInfos = await getOneMapInfos(mapId as string);
			setMapInfos(allMapInfos);
		};
		if (state?.from.includes("/maps/preview/")) {
			fetchMapInfos();
		}
	}, [mapId, state]);

	// à chaque changement dans les inputs, mise à jour du store avec les informations des inputs
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const subscription = watch((value) => {
			setMapInfos(value as MapInfoType);
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const addTagOptions = async () => {
			for (const input of inputs) {
				if (input.name === "tag") {
					input.options = [
						{ value: "0", label: "Choisir un tag" },
						...tagOptions,
					];
				}
			}
		};
		addTagOptions();
	}, [language]);

	// WYSIWYG
	const quillRef = useRef<Quill | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const defaultTagValues = useMemo(() => {
		return (mapInfos?.tags as TagType[])?.map((tag: TagType) => ({
			value: tag.id,
			label: tag[`name_${language}`],
		}));
	}, [language]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={style.commonFormContainer}
		>
			<h4>{translation[language].backoffice.mapFormPage.addMapIntro}</h4>
			{inputs.map((input) => {
				if (input.type === "select") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<LabelComponent
								htmlFor={input.name}
								label={input[`label_${language}`]}
								description={input[`description_${language}`] ?? ""}
							/>
							<div className={style.inputContainer}>
								<select
									{...register(input.name as keyof MapInfoType, {
										required: input.required.value,
									})}
								>
									{input.options?.map((option) => {
										return (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										);
									})}
								</select>

								{errors[input.name as keyof FieldErrors<MapInfoType>] && (
									<ErrorComponent
										message={
											input.required.message?.[
												language as keyof TranslationType
											] as string
										}
									/>
								)}
							</div>
						</div>
					);
				}
				if (input.type === "text") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<LabelComponent
								htmlFor={input.name}
								label={input[`label_${language}`]}
								description={input[`description_${language}`] ?? ""}
							/>
							<div className={style.inputContainer}>
								<input
									{...register(input.name as keyof MapInfoType, {
										required: input.required.value,
									})}
								/>
								{input.required.value &&
									errors[input.name as keyof FieldErrors<MapInfoType>] && (
										<ErrorComponent
											message={
												input.required.message?.[
													language as keyof TranslationType
												] as string
											}
										/>
									)}
							</div>
						</div>
					);
				}
				if (input.type === "wysiwyg") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<LabelComponent
								htmlFor={input.name}
								label={input[`label_${language}`]}
								description={input[`description_${language}`] ?? ""}
							/>
							<div className={style.inputContainer}>
								<Controller
									name={input.name as keyof MapInfoType}
									control={control}
									rules={{
										required: input.required.value,
										maxLength: 1000,
									}}
									render={({ field: { onChange } }) => (
										<EditorComponent
											ref={quillRef}
											onChange={onChange}
											defaultValue={
												(mapInfos as MapInfoType)
													? (mapInfos as MapInfoType)[
															`${input.name}` as keyof typeof mapInfos
														]
													: null
											}
										/>
									)}
								/>
								{input.required.value &&
									errors[input.name as keyof MapInfoType]?.type ===
										"required" && (
										<ErrorComponent
											message={input.required.message?.[language] as string}
										/>
									)}
								{errors[input.name as keyof MapInfoType] &&
									errors[input.name as keyof MapInfoType]?.type ===
										"maxLength" && <ErrorComponent message="1000 char. max" />}
							</div>
						</div>
					);
				}
			})}

			<div className={style.commonFormInputContainer}>
				<LabelComponent
					htmlFor="tags"
					label={translation[language].backoffice.mapFormPage.intro.tags.label}
					description={
						translation[language].backoffice.mapFormPage.intro.tags.description
					}
				/>
				<div className={style.inputContainer}>
					<Select
						options={tagOptions}
						defaultValue={mapInfos ? defaultTagValues : []}
						delimiter="|"
						isMulti
						onChange={(newValue) =>
							handleSelectTagsChange(newValue as MultiValue<OptionType>)
						}
						placeholder={
							translation[language].backoffice.mapFormPage.intro.tags
								.placeholder
						}
					/>
				</div>
			</div>
			<NavigationButtonComponent step={step} nextButtonDisplayed={true} />
		</form>
	);
};

export default IntroForm;
