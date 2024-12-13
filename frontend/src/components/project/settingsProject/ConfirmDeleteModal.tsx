import Button from '../../form/button/Button.tsx'


type PropsType = {
    title: string
    deleteHandler: () => void
    setConfirmation: () => void
}

const ConfirmDeleteModal = (props: PropsType) => {
    const {title, deleteHandler, setConfirmation} = props

    return (
        <div>
            <h4 style={{textAlign: 'center'}}>{title}</h4>
            <div style={{textAlign: 'center'}}>
                <Button type='button' title='Да' style='success' onClickHandler={() => {
                        deleteHandler()
                        setConfirmation()
                }}/>
            </div>

        </div>
    )
}

export default ConfirmDeleteModal