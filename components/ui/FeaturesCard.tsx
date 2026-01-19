import Image from "next/image";

type FeaturesCardProps = {
  header: string;
  text: string;
  image: string;
};

export default function FeaturesCard({
  header,
  text,
  image,
}: FeaturesCardProps) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg shadow-md border-2 border-black w-80 gap-4">
      <h2 className="mt-4 px-4 text-[31.25px] font-semibold">{header}</h2>
      <p className="mt-2 px-4 text-gray-700 text-[20px]">{text}</p>
      <Image src={image} width={300} height={300} alt={header} />
    </div>
  );
}
