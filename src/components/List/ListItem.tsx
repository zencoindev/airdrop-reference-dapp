import { memo, ReactNode } from "react";

export interface ListItemProps {
  title: string;
  children?: ReactNode;
}

export const ListItem = memo<ListItemProps>((props) => {
  return (
    <div className="item">
      <div className="secondary item-title">
        {props.title}
      </div>
      <b className="item-value">
        {props.children}
      </b>
    </div>
  );
});
