import React, { createContext, useState } from 'react'

export const AppContext = createContext()

const initialCartList = [
  {
    srcImg: '/images/14.png',
    itemName: 'Library in the sky, Episode 3',
    numberEdition: 1,
    price: 3.99,
    cartItemId: '0435605fb7804a128e87c675a417baed',
  },
  {
    srcImg: '/images/15.png',
    itemName: 'Library in the sky, Episode 4',
    numberEdition: 3,
    price: 3.99,
    cartItemId: '05930cc7b19f4cf2b28ae4c8fb601dc9',
  },
]

export const AppProvider = ({ children }) => {
  const calculateNumberEdition = (arr) => {
    return arr.reduce((total, item) => {
      return total + item.numberEdition
    }, 0)
  }

  const [cartList, setCartList] = useState(
    initialCartList
  )

  return (
    <AppContext.Provider
      value={{
        cartList,
        setCartList,
        calculateNumberEdition,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
