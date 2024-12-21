import {ChangeEvent} from 'react'
import classes from './Input.module.css'
import {useAppDispatch} from '../../../redux/hooks.ts';


type SelectProps = {
    placeholder: string
    options: Array<{ value: number; label: string }>
    onChangeHandler: any
}

const Select = (props: SelectProps) => {

    const dispatch = useAppDispatch()

    return (
        <div>
            <select className={classes.text} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                dispatch(props.onChangeHandler(e.target.value))
            }}>
                <option value='0'>Добавить</option>
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    )
}

export default Select