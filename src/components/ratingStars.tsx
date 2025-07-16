interface Props {
  rating: number;
}

const Stars: React.FC<Props> = ({ rating }) => {
 return "★★★★★".split("").map((star, i) => (
    <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
      {star}
    </span>
  ));
}

export default Stars;