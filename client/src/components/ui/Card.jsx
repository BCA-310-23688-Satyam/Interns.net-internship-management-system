function Card({ className = "", children }) {
  return <article className={`card${className ? ` ${className}` : ""}`}>{children}</article>;
}

export default Card;
