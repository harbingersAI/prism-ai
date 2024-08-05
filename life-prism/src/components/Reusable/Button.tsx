import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps, MotionValue } from 'framer-motion';
import styles from '@/styles/components/Reusable/Button.module.scss';

// Define types for button variants, sizes, and shapes
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonShape = 'rectangle' | 'rounded' | 'pill';

// Define base props common to all button types
interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  centered?: boolean;
  children?: React.ReactNode | MotionValue<number> | MotionValue<string>;
}

// Define props specific to buttons
type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

// Define props specific to links
type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'link';
    href: string;
  };

// Define props specific to motion buttons
type ButtonAsMotion = ButtonBaseProps &
  Omit<HTMLMotionProps<'button'>, 'style'> & {
    as: 'motion';
  };

// Define a union type for ButtonProps to accommodate all three cases
type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsMotion;

const ButtonComponent = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      shape = 'rounded',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      loading = false,
      disabled = false,
      centered = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClassName = [
      styles.button,
      styles[variant],
      styles[size],
      styles[shape],
      fullWidth ? styles.fullWidth : '',
      loading ? styles.loading : '',
      disabled ? styles.disabled : '',
      centered ? styles.centered : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const isMotionValue = (value: any): value is MotionValue<any> =>
      value && typeof value.get === 'function';

    const content = (
      <>
        {loading && <span className={styles.loader} />}
        {icon && iconPosition === 'left' && <span className={styles.iconLeft}>{icon}</span>}
        <span className={styles.text}>
          {isMotionValue(children) ? children.get() : children}
        </span>
        {icon && iconPosition === 'right' && <span className={styles.iconRight}>{icon}</span>}
      </>
    );

    // Handle link case
    if ('href' in props) {
      const { href, ...linkProps } = props as ButtonAsLink;
      return (
        <Link href={href} passHref legacyBehavior>
          <a ref={ref as React.Ref<HTMLAnchorElement>} className={baseClassName} {...linkProps}>
            {content}
          </a>
        </Link>
      );
    }

    // Handle motion button case
    if (props.as === 'motion') {
      const { as, ...motionProps } = props;
      return (
        <motion.button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={baseClassName}
          disabled={disabled || loading}
          whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
          whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
          {...motionProps}
        >
          {content}
        </motion.button>
      );
    }

    // Handle default button case
    const { as, ...buttonProps } = props;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={baseClassName}
        disabled={disabled || loading}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

ButtonComponent.displayName = 'Button';

export default ButtonComponent;
