// import des bibliothèques
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
// import des composants
import ErrorComponent from "../../errorComponent/ErrorComponent";
// import du context
// import des services
// import des types
import type { SubmitHandler } from "react-hook-form";
import type { InputType } from "../../../../utils/types/formTypes";
// import du style
import style from "./commonForm.module.scss";
// import des icônes
import { ChevronRight } from "lucide-react";

type allInputsType = any;

type CommonFormProps = {
	onSubmit: SubmitHandler<any>;
	inputs: InputType[];
	defaultValues: any | undefined;
};

const CommonForm = ({ onSubmit, inputs, defaultValues }: CommonFormProps) => {
	// on gère le formulaire
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<allInputsType>({
		defaultValues: defaultValues ?? {},
	});

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={style.commonFormContainer}
		>
			{inputs.map((input) => {
				if (input.type === "select") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<label htmlFor={input.name}>{input.label}</label>
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
								<ErrorComponent message={input.required.message as string} />
							)}
						</div>
					);
				}
				if (input.type === "text") {
					return (
						<div key={input.name} className={style.commonFormInputContainer}>
							<label htmlFor={input.name}>{input.label}</label>
							<input
								{...register(input.name as keyof storymapInputsType, {
									required: input.required.value,
								})}
							/>

							{input.required.value &&
								errors[input.name as keyof allInputsType] && (
									<ErrorComponent message={input.required.message as string} />
								)}
						</div>
					);
				}
			})}

			<button type="submit">
				Suivant <ChevronRight />
			</button>
		</form>
	);
};

export default CommonForm;
