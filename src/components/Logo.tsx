import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "default" | "white";
}

export default function Logo({ className = "", width = 700, height = 200, variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={`flex-shrink-0 m-0 p-0 ${className}`}>
      <div className="relative m-0 p-0" style={{ width, height, maxWidth: '100%' }}>
        <Image
          src="/logo.png"
          alt="AbTech-Digital"
          fill
          className="object-contain object-left"
          sizes={`${width}px`}
          priority
        />
      </div>
    </Link>
  );
}
