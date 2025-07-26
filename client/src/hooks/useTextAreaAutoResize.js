import { useEffect } from 'react';

export default function useTextAreaAutoResize(inputRef) {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height to auto to calculate new height
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  });
}
