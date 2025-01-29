import Image from "next/image";
import bg from "@/public/bg.png";

export default function Banner() {
  return (
    <div className=" bg-[#2A254B] text-white font-[family-name:var(--font-roboto)] py-3 px-4 sm:px-8 flex flex-col gap-14 sm:grid sm:grid-cols-2 items-center">
      <div>
        <h4 className=" text-[42px] mb-[80px] sm:mb-[120px]">
          The furniture brand for the future, with timeless designs
        </h4>
        <p className=" text-[24px]">
          A new era in eco friendly furniture with Avelon, the French luxury
          retail brand with nice fonts, tasteful colors and a beautiful way to
          display things digitally using modern web technologies.
        </p>
      </div>
      <div>
        <Image src={bg} alt="bg" />
      </div>
    </div>
  );
}
