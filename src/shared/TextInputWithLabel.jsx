function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  value,
  ...rest
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>

      <input
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </>
  );
}

export default TextInputWithLabel;
