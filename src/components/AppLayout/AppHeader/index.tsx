import React from 'react';
import ColorPickerIcon from '../../icons/ColorPickerIcon.tsx';
import AppInput from '../../AppInput';

interface IAppHeaderProps {
  handleColorPickerBtnClick: React.MouseEventHandler<HTMLButtonElement>;
  handleFileInputChange: (file: File) => void;
  colors: {
    HEX: string;
    RGB: string;
  };
}

function AppHeader({
  handleColorPickerBtnClick,
  handleFileInputChange,
  colors,
}: IAppHeaderProps) {
  return (
    <header>
      <button onClick={handleColorPickerBtnClick}>
        <ColorPickerIcon />
      </button>
      <div className={'colors-wrapper'}>
        {colors.HEX && <div id="hex">HEX: {colors.HEX}</div>}
        {colors.RGB && <div id="rgb">RGBA: {colors.RGB}</div>}
      </div>
      <div>
        <AppInput handleChange={handleFileInputChange} />
      </div>
    </header>
  );
}

export default AppHeader;
