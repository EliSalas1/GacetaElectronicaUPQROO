import PrivateHeader from '@/components/PrivateHeader'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrivateHeader />
      <main className='p-2'>{children}</main>
    </>
  )
}