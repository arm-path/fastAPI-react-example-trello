import {ChangeEvent} from 'react'

import classes from './Dashboard.module.css'
import Input from '../../../form/input/Input.tsx'
import {changeTitleCreateDashboard, createDashboard} from '../../../../redux/reducers/dashboardReducer.ts'
import ButtonLoading from '../../../form/button/ButtonLoading.tsx'
import Button from '../../../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../../../redux/hooks.ts'
import {selectDashboard} from '../../../../redux/selectors.ts'

const DashboardCreate = () => {

    const {formDashboard: form} = useAppSelector(selectDashboard)
    const dispatch = useAppDispatch()

    return (
        <div className={classes.createContainer}>
            <h4 className={classes.createTitle}>Создать панель</h4>
            <Input type='text' placeholder='Название' value={form.title}
                   onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                       dispatch(changeTitleCreateDashboard(e.target.value))
                   }}/>
            <div className={classes.btnCenter}>
                {form.loading
                    ? <ButtonLoading/>
                    : <Button type='button' title='Создать' style='success'
                              onClickHandler={() => {
                                  dispatch(createDashboard())
                              }}/>
                }
            </div>
        </div>
    )
}


export default DashboardCreate