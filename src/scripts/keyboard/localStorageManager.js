const getVirtualKeyboardData = () => {
  const itemName = 'virtual-keyboard';
  const getData = () => {
    const virtualKeyboardRawData = localStorage.getItem(itemName);

    return virtualKeyboardRawData && JSON.parse(virtualKeyboardRawData);
  };
  const setData = (value) => {
    const virtualKeyboardRawData = localStorage.getItem(itemName);
    const virtualKeyboardData = virtualKeyboardRawData ? JSON.parse(virtualKeyboardRawData) : {};

    localStorage.setItem(
      itemName,
      JSON.stringify({
        ...virtualKeyboardData,
        ...value,
      })
    );
  };

  return {
    get currentLayoutLanguage() {
      return getData()?.currentLayoutLanguage;
    },
    set currentLayoutLanguage(currentLayoutLanguage) {
      setData({
        currentLayoutLanguage,
      });
    },
  };
};

export default {
  virtualKeyboard: getVirtualKeyboardData(),
};
