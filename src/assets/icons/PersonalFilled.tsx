import React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const Personal = () => {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16">
			<path
				d="m13.50167,1.65146c0,0 -0.78599,0 -0.78599,0c0,0 0,-0.79357 0,-0.79357c0,-0.43646 -0.35368,-0.79357 -0.78595,-0.79357c-0.43226,0 -0.78594,0.35711 -0.78594,0.79357c0,0 0,0.79357 0,0.79357c0,0 -6.28759,0 -6.28759,0c0,0 0,-0.79357 0,-0.79357c0,-0.43646 -0.35368,-0.79357 -0.78594,-0.79357c-0.43228,0 -0.78595,0.35711 -0.78595,0.79357c0,0 0,0.79357 0,0.79357c0,0 -0.78595,0 -0.78595,0c-0.8724,0 -1.57189,0.7142 -1.57189,1.58714c0,0 0,11.1099 0,11.1099c0,0.87299 0.70735,1.58718 1.57189,1.58718c0,0 11.00331,0 11.00331,0c0.8645,0 1.57186,-0.71419 1.57186,-1.58718c0,0 0,-11.1099 0,-11.1099c0,-0.87293 -0.70735,-1.58714 -1.57186,-1.58714c0,0 0,0 0,0zm-5.50167,2.38069c1.30468,0 2.35784,1.06339 2.35784,2.3807c0,1.31732 -1.05317,2.3807 -2.35784,2.3807c-1.30468,0 -2.35784,-1.06339 -2.35784,-2.3807c0,-1.31732 1.05317,-2.3807 2.35784,-2.3807c0,0 0,0 0,0zm4.71569,9.52281c0,0 -9.43137,0 -9.43137,0c0,0 0,-0.79353 0,-0.79353c0,-1.58718 3.1438,-2.4601 4.71569,-2.4601c1.57189,0 4.71569,0.87292 4.71569,2.4601c0,0 0,0.79353 0,0.79353c0,0 0,0 0,0z"
				fill="currentColor"
			/>
		</svg>
	);
};

interface IconComponentProps extends CustomIconComponentProps {
	onClick: () => void;
}

const PersonalFilled: React.FC<Partial<IconComponentProps>> = props => <Icon component={Personal} {...props} />;

export default PersonalFilled;