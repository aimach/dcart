// import des bibliothèques
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "react-router";
// import des composants
import EditorComponent from "../wysiwygBlock/EditorComponent";
import ErrorComponent from "../../errorComponent/ErrorComponent";
import ButtonComponent from "../../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../../utils/hooks/useTranslation";
// import des services
import { useBuilderStore } from "../../../../utils/stores/storymap/builderStore";
import {
	addLangageBetweenBrackets,
	removeLang2Inputs,
} from "../../../../utils/functions/storymap";
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

type CommonFormProps = {
	onSubmit: SubmitHandler<allInputsType>;
	inputs: InputType[];
	defaultValues?:
		| storymapInputsType
		| BlockContentType
		| undefined
		| StorymapType;
	action?: string;
	children?: React.ReactNode;
	childrenLabelContent?: {
		htmlFor: string;
		label: string;
		description: string;
	};
};

/**
 * Retourne un formulaire avec inputs de type text, select et wysiwyg
 * @param {CommonFormProps} props - les props du composant
 * @param {SubmitHandler<allInputsType>} props.onSubmit - la fonction à exécuter lors de la soumission du formulaire
 * @param {InputType[]} props.inputs - le tableau des inputs du formulaire
 * @param {storymapInputsType | titleInputsType | undefined} props.defaultValues - les valeurs par défaut des inputs
 * @param {string} props.action - l'action à effectuer
 * @param {React.ReactNode} props.children - les enfants du composant
 * @returns ErrorComponent | EditorComponent
 */
const CommonForm = ({
	onSubmit,
	inputs,
	defaultValues,
	action,
	children,
}: CommonFormProps) => {
	// récupération des données de traduction
	const { translation, language } = useTranslation();

	const { storymapInfos, updateFormType } = useBuilderStore();

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

	const lang2Value = watch("lang2");
	useEffect(() => {
		if (lang2Value === null || lang2Value === "0") {
			const newFormInputs = removeLang2Inputs(inputs);
			setFormInputs(newFormInputs);
		} else {
			setFormInputs(inputs);
		}
	}, [lang2Value, inputs]);

	const quillRef = useRef<Quill | null>(null);

	const inputsWithLangInLabel = useMemo(() => {
		return addLangageBetweenBrackets(formInputs, storymapInfos as StorymapType);
	}, [formInputs, storymapInfos]);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={style.commonFormContainer}
		>
			{inputsWithLangInLabel.map((input) => {
				if (input.type === "select") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<div className={style.labelContainer}>
								<label htmlFor={input.name}>
									{input[`label_${language}`]}{" "}
									{input.required.value && (
										<span style={{ color: "#9d2121" }}>*</span>
									)}
								</label>
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
								<label htmlFor={input.name}>
									{input[`label_${language}`]}{" "}
									{input.required.value && (
										<span style={{ color: "#9d2121" }}>*</span>
									)}
								</label>
								<p>{input[`description_${language}`] ?? ""}</p>
							</div>
							<div className={style.inputContainer}>
								<input
									type="text"
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
							</div>
						</div>
					);
				}
				if (input.type === "color") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<div className={style.labelContainer}>
								<label htmlFor={input.name}>
									{input[`label_${language}`]}{" "}
									{input.required.value && (
										<span style={{ color: "#9d2121" }}>*</span>
									)}
								</label>
								<p>{input[`description_${language}`] ?? ""}</p>
							</div>
							<div className={style.inputContainer}>
								<input
									type="color"
									defaultValue="#AD9A85"
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
								<label htmlFor={input.name}>
									{input[`label_${language}`]}{" "}
									{input.required.value && (
										<span style={{ color: "#9d2121" }}>*</span>
									)}
								</label>
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
			{React.Children.map(children, (child, index) => (
				<>{child}</>
			))}
			<div className={style.commonFormContainerButton}>
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
						action === "create"
							? translation[language].backoffice.storymapFormPage.form.create
							: translation[language].backoffice.storymapFormPage.form.edit
					}
					icon={<ChevronRight />}
				/>
			</div>
		</form>
	);
};

export default CommonForm;
