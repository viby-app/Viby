interface Props {
  totalPages: number;
  hasNextPage: boolean;
  currentPage: number;
}

export default function BusinessDots({
  totalPages,
  hasNextPage,
  currentPage,
}: Props) {
  const dotsCount = hasNextPage ? totalPages + 1 : totalPages;

  return (
    <div className="mt-2 flex justify-center space-x-2">
      {Array.from({ length: dotsCount }, (_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-transform duration-300 ${
            currentPage === i
              ? "scale-125 bg-[#48A6A7]"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}
