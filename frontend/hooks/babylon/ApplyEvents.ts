import useBabylon from '.';

export default function () {
  const { sceneRef } = useBabylon();
  const ConfigureEvents = () => {
    // hide/show the Inspector
    window.addEventListener('keydown', (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (sceneRef.value!.debugLayer.isVisible()) {
          sceneRef.value!.debugLayer.hide();
        } else {
          sceneRef.value!.debugLayer.show();
        }
      }
    });
  };

  return { ConfigureEvents };
}
