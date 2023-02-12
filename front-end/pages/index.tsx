import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import WalletView from '@/views/Wallet';

export default function Home() {
  return (
    <WalletView></WalletView>
  )
}
