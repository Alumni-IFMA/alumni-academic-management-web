import PropTypes from "prop-types";

export function Button({ children }) {
    return (
        <button className="cursor-pointer w-[53px] h-[53]">{children}</button>
    )
}
