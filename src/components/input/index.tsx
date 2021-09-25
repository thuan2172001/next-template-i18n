import { Input as BaseInput } from 'antd'
import React from 'react'
import { InputProps } from 'antd/lib/input'

export type IInput = InputProps

export const Input: React.FC<IInput> = ({ ...rest }) => {
  return <BaseInput {...rest} />
}
