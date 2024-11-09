import {NavLink} from 'react-router-dom'
import {ChangeEvent} from 'react'

import classes from './project.module.css'
import editIcon from '../../assets/images/edit.png'
import saveIcon from '../../assets/images/save.png'
import Input from '../form/input/Input'
import {
    changeTitleUpdateProjectAC,
    setEditFormAC,
    UpdateForm,
    updateProjectThunk
} from '../../redux/reducers/projectReducer'
import {useAppDispatch} from '../../redux/hooks'


type ProjectLinkPropsType = {
    id: number,
    title: string,
    editForm: UpdateForm
}

const ProjectLink = (props: ProjectLinkPropsType) => {
    const dispatch = useAppDispatch()
    const {id, title, editForm} = props
    const edit: boolean = editForm.id === id

    return (
        <div className={classes.linkContainer}>
            <div className={edit ? classes.hide : classes.show}>
                <NavLink className={classes.link} to={'project/' + id}>{title}</NavLink>
                <img className={classes.editImg} src={editIcon} alt=''
                     onClick={() => {
                         dispatch(setEditFormAC(id))
                     }}/>
            </div>

            <span className={classes.error}>{edit && editForm.error}</span>
            <div className={!edit ? classes.hide : classes.showFlex}>
                <Input placeholder='Проект' value={editForm.title} error='' styles={!edit ? classes.hide : classes.show}
                       onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                           dispatch(changeTitleUpdateProjectAC(e.target.value))
                       }}/>
                <div>
                    <img className={editForm.loading ? classes.saveLoadingImg : classes.saveImg} src={saveIcon} alt=''
                         onClick={() => {
                             dispatch(updateProjectThunk())
                         }}/>
                </div>
            </div>

        </div>
    )
}

export default ProjectLink