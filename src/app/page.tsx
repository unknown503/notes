import Heading from '@/components/Heading'
import { GenericTitle } from '@/lib/config'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: GenericTitle("Home")
}

import React from 'react'

const Home = () => (
  <Heading title="Home" />
)

export default Home