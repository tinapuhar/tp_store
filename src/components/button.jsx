import "./button.scss";

const Button = (props) => {
    return (
        <button className={props.classList} onClick={props.onClick}>{props.title}</button>
    )
}
export default Button;