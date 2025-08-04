import { useRef } from 'react';

export default function AutoResizableTextArea({ onChange, ...props }) {
  const inputRef = useRef(null);

  function handleOnChange(e) {
    if (onChange) {
      onChange(e);
    }

    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height to auto to calculate new height
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }

  return <textarea onChange={handleOnChange} ref={inputRef} {...props} />;
}
