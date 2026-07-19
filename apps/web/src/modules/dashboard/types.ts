export type NavOpenPropsType = {
  isNavOpen: boolean;
  openNav?: () => void;
  closeNav?: () => void;
  setIsNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  navRef?: React.RefObject<HTMLDivElement>;
};

export type ShowModeText = {
  mode: "text";
  text: string;
  openModalText: string;
};

export type ShowModeButton = {
  mode: "button";
};

export type ShowMode = ShowModeText | ShowModeButton;
