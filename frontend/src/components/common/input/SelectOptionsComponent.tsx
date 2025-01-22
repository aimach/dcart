interface SelectOptionsComponentProps {
	selectId: string;
	label: string;
	basicOptionContent: string;
	options: string;
}

const SelectOptionsComponent = ({
	selectId,
	label,
	basicOptionContent,
	options,
}: SelectOptionsComponentProps) => {
	return (
		<>
			<label htmlFor={selectId}>{label}</label>

			<select name="pets" id={selectId}>
				<option value="">{basicOptionContent}</option>
				{options.map((option) => (
					<option key={option.id} value={option.id}>
						{option.name}
					</option>
				))}
			</select>
		</>
	);
};

export default SelectOptionsComponent;
