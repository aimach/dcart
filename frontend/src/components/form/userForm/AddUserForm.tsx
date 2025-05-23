// import des bibliothèques
import { useForm } from "react-hook-form";
// import des composants
import LabelComponent from "../inputComponent/LabelComponent";
import ErrorComponent from "../errorComponent/ErrorComponent";
import ButtonComponent from "../../common/button/ButtonComponent";
// import des custom hooks
import { useTranslation } from "../../../utils/hooks/useTranslation";
// import des services
import userInputArray from "../../../utils/forms/userInputArray";
// import des types
// import du style
import style from "../storymapForm/commonForm/commonForm.module.scss";
// import des icônes
import { CircleAlert } from "lucide-react";

export type userInputType = {
	username: string;
	pseudo: string;
	email: string;
};

type AddUserFormProps = {
	onSubmit: (data: userInputType) => void;
	setAddUserForm: (value: boolean) => void;
};

const AddUserForm = ({ onSubmit, setAddUserForm }: AddUserFormProps) => {
	const { translation, language } = useTranslation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<userInputType>();

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={style.commonFormContainer}
		>
			{userInputArray.map((input) => (
				<div key={input.name} className={style.commonFormInputContainer}>
					<LabelComponent
						htmlFor={input.name}
						label={input[`label_${language}`]}
						description={input[`description_${language}`] as string}
					/>
					<div className={style.inputContainer}>
						<input
							{...register(input.name as keyof userInputType, {
								required: input.required.value,
							})}
						/>

						{input.required.value &&
							errors[input.name as keyof userInputType] && (
								<ErrorComponent
									message={input.required.message?.[language] as string}
								/>
							)}
					</div>
				</div>
			))}
			<div className={style.commonFormContainerButton}>
				<ButtonComponent
					type="button"
					color="brown"
					textContent={translation[language].common.close}
					onClickFunction={() => {
						setAddUserForm(false);
					}}
				/>
				<ButtonComponent
					type="submit"
					color="brown"
					textContent={
						translation[language].backoffice.storymapFormPage.form.create
					}
				/>
			</div>
			<div className={style.alertContainer}>
				<CircleAlert color="#9d2121" />
				<p>
					{
						translation[language].backoffice.userManagement
							.passwordManagementMessage
					}
				</p>
			</div>
		</form>
	);
};

export default AddUserForm;
