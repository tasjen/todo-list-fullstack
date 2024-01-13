import { useState, forwardRef, useImperativeHandle } from 'react';

type Props = {
  buttonLabel: string;
  children: JSX.Element;
};

const Togglable = forwardRef((props: Props, ref) => {
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? '' : 'none' };
  const hideWhenVisible = { display: visible ? 'none' : '' };

  const toggleVisible = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisible };
  });

  return (
    <div>
      <button style={hideWhenVisible} onClick={toggleVisible}>
        {props.buttonLabel}
      </button>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisible}>Cancel</button>
      </div>
    </div>
  );
});

export default Togglable;