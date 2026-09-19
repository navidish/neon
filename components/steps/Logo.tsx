import Image from 'next/image';

export function Logo() {
  return <Image src="/logo.svg" alt="لوگو" width={170} height={50} priority />;
}
