import classes from './Loader.module.css'


type propsType = {
    fullPage?: boolean,
    size?: 'default' | 'small' | 'large' | 'huge' | 'medium',
    color?: 'white' | 'black' | 'grey' | 'violet'
}

const Loader = (props: propsType) => {

    let classesList = classes.loader

    switch (props.color) {
        case 'white':
            classesList = classesList + ' ' + classes.white
            break
        case 'grey':
            classesList = classesList + ' ' + classes.grey
            break
        case 'black':
            classesList = classesList + ' ' + classes.black
            break
        case 'violet':
            classesList = classesList + ' ' + classes.violet
            break
        default:
            classesList = classesList + ' ' + classes.black
    }

    switch (props.size) {
        case 'small':
            classesList = classesList + ' ' + classes.small
            break
        case 'large':
            classesList = classesList + ' ' + classes.large
            break
        case 'huge':
            classesList = classesList + ' ' + classes.huge
            break
        case 'medium':
            classesList = classesList + ' ' + classes.medium
            break
        default:
            classesList = classesList + ' ' + classes.default
    }

    return (
        <div className={props.fullPage ? classes.container : ''}>
            <span className={classesList}></span>
        </div>
    )
}

export default Loader