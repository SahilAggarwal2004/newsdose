export default function Loader({ type = 2 }) {
    return <div className={type === 1 ? 'd-flex justify-content-center align-items-center h-100 fixed-top' : 'd-flex justify-content-center align-items-center my-5'}>
        <div className="spinner-border" role="status" />
    </div>
}
