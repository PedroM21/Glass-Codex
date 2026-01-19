import Image from "next/image";

type Audience = {
  type: string;
  description: string;
  image: string;
};

type AudienceProps = {
  audiences: Audience[];
};

export default function Audience({ audiences }: AudienceProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 space-y-8">
      {audiences.map((audience) => (
        <div key={audience.type} className="lg:col-span-6 flex flex-col gap-4">
          <Image
            src={audience.image}
            width={300}
            height={300}
            alt={audience.type}
            className="mx-auto"
          />
          <h1 className="text-[25px] text-[#2B2B2B] font-semibold text-center">
            {audience.type}
          </h1>
          <p className="text-center w-1/2 mx-auto">{audience.description}</p>
        </div>
      ))}
    </div>
  );
}
