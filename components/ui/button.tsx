import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#3498db',
        };
      default:
        return {
          backgroundColor: '#3498db',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
        };
      case 'lg':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
        };
      default:
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
    }
  };

  const getTextStyles = () => {
    return {
      fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
      fontWeight: '500' as const,
      color: variant === 'outline' ? '#3498db' : 'white',
      textAlign: 'center' as const,
    };
  };

  return (
    <TouchableOpacity
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
          ...getVariantStyles(),
          ...getSizeStyles(),
        },
        style,
      ]}
      {...props}
    >
      <Text style={getTextStyles()}>{children}</Text>
    </TouchableOpacity>
  );
};
