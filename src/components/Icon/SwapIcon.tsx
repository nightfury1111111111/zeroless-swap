import React from "react"

interface IconProps {
  color: string;
  width: string;
  height: string;
}

const SwapIcon: React.FC<IconProps> = ({color, width, height}: IconProps) => {
  return <svg width={width} height={height} viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11V14.01ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z" fill={color}/>
</svg>

}

export default SwapIcon;