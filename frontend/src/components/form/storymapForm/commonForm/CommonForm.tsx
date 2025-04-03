// import des bibliothèques
import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
// import des composants
import EditorComponent from "../wysiwygBlock/EditorComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
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
// import du style
import style from "./commonForm.module.scss";
// import des icônes
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import { useSearchParams } from "react-router";

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

	// import des sevice de formulaire
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<allInputsType>({
		defaultValues: defaultValues ?? {},
	});

	console.log(defaultValues);

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

	const quillRef = useRef<Quill | null>(null);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={style.commonFormContainer}
		>
			{inputs.map((input) => {
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
