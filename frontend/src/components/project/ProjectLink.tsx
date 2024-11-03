import {useState} from 'react'
import {NavLink} from 'react-router-dom'

import classes from './project.module.css'
import editIcon from '../../assets/images/edit.png'
import saveIcon from '../../assets/images/save.png'
import Input from '../form/input/Input.tsx'

type ProjectLinkPropsType = {
    id: number,
    title: string,
}

const ProjectLink = (props: ProjectLinkPropsType) => {
    const {id, title} = props
    const [edit, setEdit] = useState<boolean>(false)
    return (
        <div className={classes.linkContainer}>
            <div className={edit ? classes.hide : classes.show}>
                <NavLink className={classes.link} to={'project/' + id}>{title}</NavLink>
                <img className={classes.editImg} src={editIcon} alt=''
                     onClick={() => setEdit(true)}/>
            </div>
            <div className={!edit ? classes.hide : classes.showFlex}>
                <Input placeholder='Проект' value={title} error='' styles={!edit ? classes.hide : classes.show}
                       onchangeHandler={()=>{}}/>
                <div>
                    <img className={classes.saveImg + ' ' + classes.biasEdit} src={saveIcon} alt=''
                         onClick={() => setEdit(false)}/>
                </div>


            </div>

        </div>
    )
}

export default ProjectLink