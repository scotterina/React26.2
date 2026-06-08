function TextInputWithLabel({ elementId, labelText, onChange, value }) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>

      <input type="text" id={elementId} value={value} onChange={onChange} />
    </>
  );
}

export default TextInputWithLabel;
