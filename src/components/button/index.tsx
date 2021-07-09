import { Button } from 'antd';
import PropTypes from 'prop-types';

export const CustomButtonField = (props) => {
	const {
		name,
		classNames,
		style,
		block,
		danger,
		disabled,
		ghost,
		href,
		htmlType,
		icon,
		iconLeft,
		iconRight,
		loading,
		shape,
		size,
		target,
		onClick,
		children,
		color,
	} = props;

	let overrideClassNames = [];

	const renderContent = () => {
		return (
			<>
				{typeof iconLeft !== 'undefined' ? iconLeft : ''}
				{children}
				{typeof iconRight !== 'undefined' ? iconRight : ''}
			</>
		);
	};

	const initArgs = () => {
		if (size === 'middle-custom') {
			overrideClassNames.push('atn-btn-md-custom');
		}

		if (size === 'large-custom') {
			overrideClassNames.push('atn-btn-lg-custom');
		}

		if (size === 'mid-large-custom') {
			overrideClassNames.push('atn-btn-mlg-custom');
		}

		if (color === 'red') {
			overrideClassNames.push('atn-btn-color-red');
		}

		if (color === 'black') {
			overrideClassNames.push('atn-btn-color-black');
		}

		if (color === 'gray') {
			overrideClassNames.push('atn-btn-color-gray');
		}

		if (color === 'white') {
			overrideClassNames.push('atn-btn-color-white');
		}

		if (color === 'white-gray') {
			overrideClassNames.push('atn-btn-color-white-gray');
		}

		if (color === 'gray-white') {
			overrideClassNames.push('atn-btn-color-gray-white');
		}

		if (color === 'white-black') {
			overrideClassNames.push('atn-btn-color-white-black');
		}

		if (color === 'orange') {
			overrideClassNames.push('atn-btn-color-orange');
		}

		if (shape === 'circle-custom') {
			overrideClassNames.push('atn-btn-shape-circle');
		}

		if (shape === 'round-custom') {
			overrideClassNames.push('atn-btn-shape-round');
		}

		if (classNames.length > 0) {
			overrideClassNames = overrideClassNames.concat(classNames);
		}

		if (disabled) {
			overrideClassNames.push('atn-btn-disable');
		}
	};

	initArgs();

	return (
		<Button
			name={name}
			className={overrideClassNames.join(' ')}
			style={style}
			block={block}
			danger={danger}
			disabled={disabled}
			ghost={ghost}
			href={href}
			htmlType={htmlType}
			icon={icon}
			loading={loading}
			shape={shape}
			size={size}
			target={target}
			onClick={onClick}>
			{renderContent()}
		</Button>
	);
};

CustomButtonField.propTypes = {
	name: PropTypes.string,
	children: PropTypes.any,
	color: PropTypes.string,
	classNames: PropTypes.array,
	style: PropTypes.any,
	block: PropTypes.bool,
	danger: PropTypes.bool,
	disabled: PropTypes.bool,
	ghost: PropTypes.bool,
	href: PropTypes.string,
	htmlType: PropTypes.string,
	icon: PropTypes.node,
	iconLeft: PropTypes.node,
	iconRight: PropTypes.node,
	loading: PropTypes.any,
	shape: PropTypes.string,
	size: PropTypes.string,
	target: PropTypes.string,
	onClick: PropTypes.func,
};

CustomButtonField.defaultProps = {
	color: 'pink',
	classNames: [],
};
