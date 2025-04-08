// import des types
import { OptionType } from "../../../../utils/types/commonTypes";
// import du style
import style from "./ElementCheckboxComponent.module.scss";

type ElementCheckboxComponentProps = {
    options: {
        firstLevelIds: OptionType[];
        secondLevelIds: OptionType[];
    }
    selected: any;
    setSelected: (selected: any) => void;
};

const ElementCheckboxComponent = ({ options, selected, setSelected }: ElementCheckboxComponentProps) => {


    const toggleFirstLevel = (optionId: string) => {
        const isChecked = selected[optionId]?.checked;
        const children = options.secondLevelIds;

        const newSelected = { ...selected };
        newSelected[optionId] = {
            checked: !isChecked,
            children: !isChecked ? children.map(c => c.value) : []
        };
        setSelected(newSelected);
    };

    const toggleSecondLevel = (optionId: string, childId: string) => {
        const group = selected[optionId] || { checked: false, children: [] };
        const children = group.children.includes(childId)
            ? group.children.filter(c => c !== childId)
            : [...group.children, childId];

        setSelected({
            ...selected,
            [optionId]: {
                checked: children.length > 0,
                children
            }
        });
    };



    return (<div style={{ marginBottom: '1rem' }}>
        <label>
            <input
                type="checkbox"
                checked={selected[options.firstLevelIds[0].value]?.checked || false}
                onChange={() => toggleFirstLevel(options.firstLevelIds[0].value as string)}
            />
            <strong>{options.firstLevelIds[0].label}</strong>
        </label>
        <div style={{ paddingLeft: '1.5rem' }}>
            {options.secondLevelIds.map((option) => (
                <label key={option.value} style={{ display: 'block' }}>
                    <input
                        type="checkbox"
                        checked={selected[options.firstLevelIds[0].value]?.children.includes(option.value) || false}
                        onChange={() => toggleSecondLevel(options.firstLevelIds[0].value as string, option.value as string)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    </div>);
};

export default ElementCheckboxComponent;