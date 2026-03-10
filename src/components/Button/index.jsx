import PropTypes from "prop-types";

export function Button({ children }) {
    return (
        <button className="button-register">{children}</button>
    )
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
};