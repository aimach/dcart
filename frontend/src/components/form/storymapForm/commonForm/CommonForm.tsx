// import des bibliothèques
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "react-router";
// import des composants
import EditorComponent from "../wysiwygBlock/EditorComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
// import des types
import type { SubmitHandler } from "react-hook-form";
import type {
	allInputsType,
	InputType,
	storymapInputsType,
} from "../../../../utils/types/formTypes";

import type Quill from "quill";
import type {
	BlockContentType,
	StorymapType,
} from "../../../../utils/types/storymapTypes";
import type { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "./commonForm.module.scss";
// import des icônes
import { ChevronLeft, ChevronRight } from "lucide-react";

type CommonFormProps = {
	onSubmit: SubmitHandler<allInputsType>;
	inputs: InputType[];
	defaultValues?:
		| storymapInputsType
		| BlockContentType
		| undefined
		| StorymapType;
	action?: string;
};

/**
 * Retourne un formulaire avec inputs de type text, select et wysiwyg
 * @param {CommonFormProps} props - les props du composant
 * @param {SubmitHandler<allInputsType>} props.onSubmit - la fonction à exécuter lors de la soumission du formulaire
 * @param {InputType[]} props.inputs - le tableau des inputs du formulaire
 * @param {storymapInputsType | titleInputsType | undefined} props.defaultValues - les valeurs par défaut des inputs
 * @param {string} props.action - l'action à effectuer
 * @returns ErrorComponent | EditorComponent
 */
const CommonForm = ({
	onSubmit,
	inputs,
	defaultValues,
	action,
}: CommonFormProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { updateFormType } = useBuilderStore();

	const [_, setSearchParams] = useSearchParams();

	const [formInputs, setFormInputs] = useState<InputType[]>(inputs);

	// import des sevice de formulaire
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = useForm<allInputsType>({
		defaultValues: defaultValues ?? {},
	});

	// si des valeurs par défaut sont passées, injection dans l'input des catégories
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (defaultValues) {
			setValue(
				"category_id",
				(defaultValues as storymapInputsType).category_id as string,
			);
			if ((defaultValues as StorymapType).lang1)
				setValue("lang1", (defaultValues as StorymapType).lang1.id as string);
			if ((defaultValues as StorymapType).lang2)
				setValue("lang2", (defaultValues as StorymapType).lang2.id as string);
			if ((defaultValues as StorymapType).relatedMap)
				setValue(
					"relatedMap",
					(defaultValues as StorymapType).relatedMap !== ""
						? ((defaultValues as StorymapType).relatedMap as string)
						: "0",
				);
		}
	}, [defaultValues]);

	// gestion des select/options des langues pour ne pas avoir deux fois la même langue
	const lang1Value = watch("lang1");
	const lang2Value = watch("lang2");
	const defaultLangValue: OptionType[] = useMemo(() => {
		return inputs.filter((input) => input.name === "lang1")[0]?.options ?? [];
	}, [inputs]);

	console.log(defaultLangValue);

	useEffect(() => {
		if (lang1Value && lang2Value) {
			if (lang1Value !== "0") {
				const lang2Input = inputs.find((input) => input.name === "lang2");
				if (lang2Input) {
					const lang2Options = defaultLangValue.filter(
						(option) => option.value !== lang1Value,
					);

					const lang2Index = inputs.map((input) => input.name).indexOf("lang2");

					// insertion des nouvelles données
					const newInputs = inputs;
					newInputs[lang2Index].options = lang2Options;
					setFormInputs([...newInputs]);
				}
			}
			if (lang2Value !== "0") {
				const lang1Input = inputs.find((input) => input.name === "lang1");
				if (lang1Input) {
					const lang1Options = defaultLangValue.filter(
						(option) => option.value !== lang2Value,
					);

					const lang1Index = inputs.map((input) => input.name).indexOf("lang1");

					// insertion des nouvelles données
					const newInputs = inputs;
					newInputs[lang1Index].options = lang1Options;
					setFormInputs([...newInputs]);
				}
			}
		}
	}, [defaultLangValue, lang1Value, lang2Value, inputs]);

	const quillRef = useRef<Quill | null>(null);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={style.commonFormContainer}
		>
			{formInputs.map((input) => {
				if (input.type === "select") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<div className={style.labelContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<p>{input[`description_${language}`] ?? ""}</p>
							</div>
							<div className={style.inputContainer}>
								<select
									{...register(input.name as keyof allInputsType, {
										required: input.required.value,
									})}
								>
									{input.options?.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>

								{errors[input.name as keyof allInputsType] && (
									<ErrorComponent
										message={input.required.message?.[language] as string}
									/>
								)}
							</div>
						</div>
					);
				}
				if (input.type === "text") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<div className={style.labelContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<p>{input[`description_${language}`] ?? ""}</p>
							</div>
							<div className={style.inputContainer}>
								<input
									{...register(input.name as keyof storymapInputsType, {
										required: input.required.value,
									})}
								/>

								{input.required.value &&
									errors[input.name as keyof allInputsType] && (
										<ErrorComponent
											message={input.required.message?.[language] as string}
										/>
									)}
							</div>{" "}
						</div>
					);
				}
				if (input.type === "wysiwyg") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<div className={style.labelContainer}>
								<label htmlFor={input.name}>{input[`label_${language}`]}</label>
								<p>{input[`description_${language}`] ?? ""}</p>
							</div>
							<div className={style.inputContainer}>
								<Controller
									name={input.name as keyof allInputsType}
									control={control}
									render={({ field: { onChange } }) => (
										<EditorComponent
											ref={quillRef}
											onChange={onChange}
											defaultValue={
												defaultValues
													? defaultValues[
															`${input.name}` as keyof typeof defaultValues
														]
													: null
											}
										/>
									)}
								/>
								{input.required.value &&
									errors[input.name as keyof allInputsType] && (
										<ErrorComponent
											message={input.required.message?.[language] as string}
										/>
									)}
							</div>
						</div>
					);
				}
			})}
			<div className={style.commonFormContainerButton}>
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
					{action === "create"
						? translation[language].backoffice.storymapFormPage.form.create
						: translation[language].backoffice.storymapFormPage.form.edit}
					<ChevronRight />
				</button>
			</div>
		</form>
	);
};

export default CommonForm;
