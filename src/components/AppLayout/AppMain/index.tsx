import React, { PointerEventHandler } from 'react';

interface IAppMainProps {
  handlePointerLeave: PointerEventHandler<HTMLCanvasElement>;
  handleSetColor: () => void;
}

const AppMain = React.forwardRef(
  (props: IAppMainProps, ref: React.ForwardedRef<HTMLCanvasElement | null>) => {
    const { handlePointerLeave, handleSetColor } = props;

    return (
      <main>
        <canvas
          className={'canvas'}
          ref={ref}
          onClick={() => handleSetColor()}
          onPointerLeave={handlePointerLeave}
        />
      </main>
    );
  },
);

export default AppMain;
