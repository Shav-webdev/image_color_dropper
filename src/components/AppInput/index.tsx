import { ChangeEvent } from 'react';
import UploadIcon from 'components/icons/UploadIcon.tsx';

interface IAppInputProps {
  handleChange: (file: File) => void;
}

function AppInput({ handleChange }: IAppInputProps) {
  function validateFileUpload(fileName: string): boolean {
    const allowedExtensions = ['jpg', 'png', 'gif'];
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    for (let i = 0; i <= allowedExtensions.length; i++) {
      if (allowedExtensions[i] === fileExtension) {
        return true;
      }
    }

    return false;
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files) {
      alert('Please select a file');
      return;
    }

    if (validateFileUpload(event.target.files[0].name)) {
      handleChange(event.target.files[0]);
    } else {
      alert('Please select image with allowed extension (.jpg, .png, .gif)');
    }

    event.target.files = null;
  };

  return (
    <label>
      <input type="file" onChange={onInputChange} />
      <span>Upload</span>
      <UploadIcon />
    </label>
  );
}

export default AppInput;
